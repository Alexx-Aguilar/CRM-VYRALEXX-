import dotenv from 'dotenv';
import { pool } from '../db/mysql.js';

dotenv.config();

const requiredTables = ['crm_store', 'users'];

try {
  await pool.query('SELECT 1');
  const [rows] = await pool.query('SHOW TABLES');
  const tableNames = (rows as Record<string, string>[]).map(row => Object.values(row)[0]);
  const missingTables = requiredTables.filter(table => !tableNames.includes(table));

  if (missingTables.length > 0) {
    throw new Error(`Faltan tablas: ${missingTables.join(', ')}`);
  }
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en producción');
  }

  console.log('Verificación VYRALEXX correcta');
  console.log(`Base de datos: ${process.env.DB_NAME}`);
  console.log(`Tablas verificadas: ${requiredTables.join(', ')}`);
} catch (error) {
  console.error('Verificación VYRALEXX fallida:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
