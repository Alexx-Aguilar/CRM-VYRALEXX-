import { NextFunction, Request, Response } from 'express';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numericFields = ['amount', 'budget', 'spentBudget', 'value', 'probability', 'totalAmount'];
const dateFields = ['date', 'startDate', 'endDate', 'dueDate', 'deadline', 'paymentDate'];

export function validateApiPayload(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un objeto JSON' });
  }
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'La solicitud no puede estar vacía' });
  }

  for (const [field, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    if (field.toLowerCase().includes('email') && (typeof value !== 'string' || !emailPattern.test(value))) {
      return res.status(400).json({ error: `${field} no tiene un formato válido` });
    }
    if (numericFields.includes(field) && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
      return res.status(400).json({ error: `${field} debe ser un número mayor o igual a cero` });
    }
    if (dateFields.includes(field) && (typeof value !== 'string' || Number.isNaN(Date.parse(value)))) {
      return res.status(400).json({ error: `${field} no tiene una fecha válida` });
    }
  }

  next();
}
