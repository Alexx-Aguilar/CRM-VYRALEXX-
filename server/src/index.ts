import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { pool } from './db/mysql.js';
import { db } from './db/database.js';
import authRoutes, { initializeAuth } from './routes/auth.js';
import { requireAuth } from './auth/middleware.js';
import { requireModulePermission } from './auth/permissions.js';
import { validateApiPayload } from './middleware/validation.js';
import uploadRoutes from './routes/uploads.js';

dotenv.config();

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD)) {
  throw new Error('En producción debes configurar JWT_SECRET y ADMIN_PASSWORD en server/.env');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'online', database: 'connected', system: 'VYRALEXX CRM API', version: '1.0.0', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'disconnected', system: 'VYRALEXX CRM API', version: '1.0.0', timestamp: new Date().toISOString() });
  }
});

// Login remains public; CRM data requires an authenticated user.
app.use('/api/auth', authRoutes);
app.use('/api/files', requireAuth, requireModulePermission, uploadRoutes);
app.use('/api', requireAuth, requireModulePermission, validateApiPayload, apiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err?.code === 'LIMIT_FILE_SIZE' || err?.message === 'Tipo de archivo no permitido' ? 400 : 500;
  res.status(status).json({
    error: status === 400 ? err.message || 'Archivo inválido' : 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

let httpServer: ReturnType<typeof app.listen> | undefined;

const shutdown = async (signal: string) => {
  console.log(`Cerrando servidor por ${signal}...`);
  httpServer?.close();
  await db.flush();
  await pool.end();
  process.exit(0);
};

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL conectado correctamente');
    await db.initialize();
    await initializeAuth();
  } catch (error) {
    console.error('Error conectando con MySQL:', error);
    process.exit(1);
  }

  httpServer = app.listen(PORT, () => {
    console.log(`VYRALEXX Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
  });
};

void startServer();
