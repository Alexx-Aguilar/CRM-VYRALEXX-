import express, { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { db } from '../db/database.js';
import type { MediaFile } from '../types/index.js';
import { canAccessRecord } from '../auth/scope.js';
import { fileURLToPath } from 'node:url';

const router = express.Router();
const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
    callback(null, `${Date.now()}-${baseName || 'archivo'}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = /\.(pdf|zip|rar|png|jpg|jpeg|webp|gif|mp4|mov|doc|docx|xls|xlsx|csv)$/i.test(file.originalname);
    callback(allowed ? null : new Error('Tipo de archivo no permitido'), allowed);
  }
});

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Debes seleccionar un archivo' });

  const files = db.getFiles();
  const extension = path.extname(req.file.originalname).replace('.', '').toUpperCase() || 'FILE';
  const id = `fl-${Date.now().toString(36)}`;
  const newFile: MediaFile = {
    id,
    name: req.file.originalname,
    category: (req.body.category || 'Creativos') as MediaFile['category'],
    size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
    fileType: extension,
    url: `/api/files/${id}/download`,
    storageName: req.file.filename,
    uploadedBy: req.user?.name || 'Usuario CRM',
    relatedCampaign: req.body.relatedCampaign || undefined,
    createdAt: new Date().toISOString()
  };

  files.unshift(newFile);
  db.persist();
  res.status(201).json(newFile);
});

router.get('/:id/download', (req: Request, res: Response) => {
  const file = db.getFiles().find(item => item.id === req.params.id);
  if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });
  if (!canAccessRecord(req.user, 'files', file)) return res.status(403).json({ error: 'No tienes acceso a este archivo' });

  const filename = path.basename(file.storageName || file.url.split('/').pop() || '');
  const physicalPath = path.resolve(uploadsDir, filename);
  if (!physicalPath.startsWith(uploadsDir) || !fs.existsSync(physicalPath)) {
    return res.status(404).json({ error: 'El archivo físico no existe' });
  }
  res.download(physicalPath, file.name);
});

export default router;
