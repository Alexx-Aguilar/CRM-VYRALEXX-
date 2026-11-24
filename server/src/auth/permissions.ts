import { NextFunction, Request, Response } from 'express';
import { canAccessRecord } from './scope.js';
import { db } from '../db/database.js';

const permissions: Record<string, string[]> = {
  agency_admin: ['dashboard', 'creators', 'agencies', 'brands', 'campaigns', 'collaborations', 'calendar', 'analytics', 'pipeline', 'contracts', 'payments', 'tasks', 'messages', 'files', 'notifications', 'settings'],
  campaign_manager: ['dashboard', 'creators', 'campaigns', 'collaborations', 'calendar', 'analytics', 'tasks', 'messages', 'files', 'notifications'],
  creator: ['dashboard', 'campaigns', 'collaborations', 'calendar', 'messages', 'files', 'notifications', 'settings'],
  brand: ['dashboard', 'campaigns', 'collaborations', 'calendar', 'analytics', 'messages', 'files', 'notifications', 'settings']
};

export function requireModulePermission(req: Request, res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (!role || role === 'superadmin') return next();

  const resource = req.baseUrl.endsWith('/files')
    ? 'files'
    : req.path.split('/').filter(Boolean)[0] || 'dashboard';
  if (resource === 'demo' && role !== 'superadmin') {
    return res.status(403).json({ error: 'Solo el superadministrador puede gestionar datos demo' });
  }
  const moduleAliases: Record<string, string> = { events: 'calendar', pipeline: 'pipeline', demo: 'settings', upload: 'files' };
  const moduleName = moduleAliases[resource] || resource;
  const allowed = permissions[role]?.includes(moduleName) ?? false;
  if (!allowed) return res.status(403).json({ error: 'No tienes permisos para este módulo' });
  next();
}

export function requireRecordAccess(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (!id || !req.user || req.user.role === 'superadmin') return next();
  const resource = req.path.split('/').filter(Boolean)[0];
  const collections: Record<string, string> = { events: 'calendarEvents', pipeline: 'pipelineDeals' };
  const collection = collections[resource] || resource;
  const getter = `get${collection.charAt(0).toUpperCase()}${collection.slice(1)}` as keyof typeof db;
  const getRecords = db[getter];
  if (typeof getRecords !== 'function') return next();
  const records = (getRecords as () => Record<string, any>[]).call(db);
  const record = records.find(item => item.id === id);
  if (record && !canAccessRecord(req.user, collection, record)) return res.status(403).json({ error: 'No tienes acceso a este registro' });
  next();
}
