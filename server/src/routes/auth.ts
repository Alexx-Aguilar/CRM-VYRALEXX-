import express, { Request, Response } from 'express';
import { pool } from '../db/mysql.js';
import { createToken, hashPassword, verifyPassword } from '../auth/auth.js';
import { requireAuth, requireSuperAdmin } from '../auth/middleware.js';

const router = express.Router();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function initializeAuth(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'superadmin',
      agency_id VARCHAR(50) NULL,
      brand_id VARCHAR(50) NULL,
      creator_id VARCHAR(50) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [columns] = await pool.query('SHOW COLUMNS FROM users');
  const existingColumns = new Set((columns as Array<{ Field: string }>).map(column => column.Field));
  for (const [name, definition] of [['agency_id', 'VARCHAR(50) NULL'], ['brand_id', 'VARCHAR(50) NULL'], ['creator_id', 'VARCHAR(50) NULL']] as const) {
    if (!existingColumns.has(name)) await pool.query(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
  }

  const [rows] = await pool.query('SELECT id FROM users LIMIT 1');
  if ((rows as unknown[]).length === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@vyralexx.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      ['usr-admin', 'Administrador VYRALEXX', email, await hashPassword(password), 'superadmin']
    );
    console.log(`Usuario administrador creado: ${email}`);
  }
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const clientKey = req.ip || 'unknown';
    const now = Date.now();
    const attempt = loginAttempts.get(clientKey);
    if (attempt && attempt.resetAt > now && attempt.count >= MAX_LOGIN_ATTEMPTS) {
      return res.status(429).json({ error: 'Demasiados intentos. Intenta nuevamente en unos minutos.' });
    }
    if (attempt && attempt.resetAt <= now) loginAttempts.delete(clientKey);

    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!email || password.length < 8) return res.status(400).json({ error: 'Correo y contraseña válidos son obligatorios' });

    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, agency_id, brand_id, creator_id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const user = (rows as Array<{ id: string; name: string; email: string; password_hash: string; role: string; agency_id?: string; brand_id?: string; creator_id?: string }>)[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      const current = loginAttempts.get(clientKey);
      loginAttempts.set(clientKey, {
        count: (current?.count || 0) + 1,
        resetAt: current?.resetAt && current.resetAt > now ? current.resetAt : now + LOGIN_WINDOW_MS
      });
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    loginAttempts.delete(clientKey);
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, agencyId: user.agency_id, brandId: user.brand_id, creatorId: user.creator_id };
    res.json({ token: createToken(safeUser), user: { ...safeUser, avatar: '' } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
});

router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: { ...req.user, avatar: '' } });
});

router.get('/users', requireAuth, requireSuperAdmin, async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT id, name, email, role, agency_id AS agencyId, brand_id AS brandId, creator_id AS creatorId, created_at AS createdAt FROM users ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/users', requireAuth, requireSuperAdmin, async (req: Request, res: Response) => {
  const { name, email, password, role, agencyId, brandId, creatorId } = req.body || {};
  const allowedRoles = ['superadmin', 'agency_admin', 'campaign_manager', 'creator', 'brand'];
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 8 || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Nombre, correo, contraseña y rol válidos son obligatorios' });
  }

  const id = `usr-${Date.now().toString(36)}`;
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, agency_id, brand_id, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name.trim(), email.trim().toLowerCase(), await hashPassword(password), role, agencyId || null, brandId || null, creatorId || null]
  );
  res.status(201).json({ id, name: name.trim(), email: email.trim().toLowerCase(), role, agencyId, brandId, creatorId });
});

export default router;
