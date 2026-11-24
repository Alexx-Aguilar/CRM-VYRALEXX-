import { NextFunction, Request, Response } from 'express';
import { AuthUser, verifyToken } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Autenticación requerida' });
  req.user = user;
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'superadmin') return res.status(403).json({ error: 'Solo el superadministrador puede realizar esta acción' });
  next();
}
