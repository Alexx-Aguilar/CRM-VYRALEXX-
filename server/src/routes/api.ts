import express, { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../db/database.js';
import { requireRecordAccess } from '../auth/permissions.js';
import { requireSuperAdmin } from '../auth/middleware.js';
import { scopeCollection } from '../auth/scope.js';

const router = express.Router();
router.param('id', requireRecordAccess);

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

// ---------------- DASHBOARD ----------------
router.get('/dashboard/stats', (req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStatsForUser(req.user);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error calculating dashboard stats' });
  }
});

// ---------------- CREATORS ----------------
router.get('/creators', (req: Request, res: Response) => {
  let creators = scopeCollection(req.user, 'creators', db.getCreators());
  const { search, category, country, status, platform } = req.query;

  if (search && typeof search === 'string') {
    const query = search.toLowerCase();
    creators = creators.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.artisticName.toLowerCase().includes(query) ||
      c.bio.toLowerCase().includes(query) ||
      c.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  if (category && typeof category === 'string' && category !== 'all') {
    creators = creators.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (country && typeof country === 'string' && country !== 'all') {
    creators = creators.filter(c => c.country.toLowerCase() === country.toLowerCase());
  }

  if (status && typeof status === 'string' && status !== 'all') {
    creators = creators.filter(c => c.status === status);
  }

  if (platform && typeof platform === 'string' && platform !== 'all') {
    creators = creators.filter(c => c.socialProfiles.some(sp => sp.platform.toLowerCase() === platform.toLowerCase()));
  }

  res.json(creators);
});

router.get('/creators/:id', (req: Request, res: Response) => {
  const creator = db.getCreators().find(c => c.id === req.params.id);
  if (!creator) return res.status(404).json({ error: 'Creator not found' });
  res.json(creator);
});

router.post('/creators', (req: Request, res: Response) => {
  const creators = db.getCreators();
  const newCreator = {
    ...req.body,
    id: generateId('cr'),
    createdAt: new Date().toISOString()
  };
  creators.unshift(newCreator);
  db.persist();
  res.status(201).json(newCreator);
});

router.put('/creators/:id', (req: Request, res: Response) => {
  const creators = db.getCreators();
  const index = creators.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Creator not found' });

  creators[index] = { ...creators[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(creators[index]);
});

router.delete('/creators/:id', (req: Request, res: Response) => {
  const creators = db.getCreators();
  const index = creators.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Creator not found' });

  const deleted = creators.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Creator deleted successfully', deleted });
});

// ---------------- AGENCIES ----------------
router.get('/agencies', (req: Request, res: Response) => {
  res.json(db.getAgencies());
});

router.get('/agencies/:id', (req: Request, res: Response) => {
  const agency = db.getAgencies().find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ error: 'Agency not found' });
  res.json(agency);
});

router.post('/agencies', (req: Request, res: Response) => {
  const agencies = db.getAgencies();
  const newAgency = {
    ...req.body,
    id: generateId('ag'),
    createdAt: new Date().toISOString()
  };
  agencies.unshift(newAgency);
  db.persist();
  res.status(201).json(newAgency);
});

router.put('/agencies/:id', (req: Request, res: Response) => {
  const agencies = db.getAgencies();
  const index = agencies.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agency not found' });

  agencies[index] = { ...agencies[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(agencies[index]);
});

router.delete('/agencies/:id', (req: Request, res: Response) => {
  const agencies = db.getAgencies();
  const index = agencies.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agency not found' });

  const deleted = agencies.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Agency deleted successfully', deleted });
});

// ---------------- BRANDS ----------------
router.get('/brands', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'brands', db.getBrands()));
});

router.get('/brands/:id', (req: Request, res: Response) => {
  const brand = db.getBrands().find(b => b.id === req.params.id);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  res.json(brand);
});

router.post('/brands', (req: Request, res: Response) => {
  const brands = db.getBrands();
  const newBrand = {
    ...req.body,
    id: generateId('br'),
    createdAt: new Date().toISOString()
  };
  brands.unshift(newBrand);
  db.persist();
  res.status(201).json(newBrand);
});

router.put('/brands/:id', (req: Request, res: Response) => {
  const brands = db.getBrands();
  const index = brands.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Brand not found' });

  brands[index] = { ...brands[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(brands[index]);
});

router.delete('/brands/:id', (req: Request, res: Response) => {
  const brands = db.getBrands();
  const index = brands.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Brand not found' });

  const deleted = brands.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Brand deleted successfully', deleted });
});

// ---------------- CAMPAIGNS ----------------
router.get('/campaigns', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'campaigns', db.getCampaigns()));
});

router.get('/campaigns/:id', (req: Request, res: Response) => {
  const campaign = db.getCampaigns().find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json(campaign);
});

router.post('/campaigns', (req: Request, res: Response) => {
  const campaigns = db.getCampaigns();
  const newCampaign = {
    ...req.body,
    id: generateId('cp'),
    metrics: req.body.metrics || {
      impressions: 0,
      reach: 0,
      engagements: 0,
      clicks: 0,
      conversions: 0,
      roi: 0
    },
    deliverables: req.body.deliverables || [],
    createdAt: new Date().toISOString()
  };
  campaigns.unshift(newCampaign);
  db.persist();
  res.status(201).json(newCampaign);
});

router.put('/campaigns/:id', (req: Request, res: Response) => {
  const campaigns = db.getCampaigns();
  const index = campaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Campaign not found' });

  campaigns[index] = { ...campaigns[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(campaigns[index]);
});

router.delete('/campaigns/:id', (req: Request, res: Response) => {
  const campaigns = db.getCampaigns();
  const index = campaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Campaign not found' });

  const deleted = campaigns.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Campaign deleted successfully', deleted });
});

// ---------------- COLLABORATIONS ----------------
router.get('/collaborations', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'collaborations', db.getCollaborations()));
});

router.get('/collaborations/:id', (req: Request, res: Response) => {
  const collab = db.getCollaborations().find(c => c.id === req.params.id);
  if (!collab) return res.status(404).json({ error: 'Collaboration not found' });
  res.json(collab);
});

router.post('/collaborations', (req: Request, res: Response) => {
  const collabs = db.getCollaborations();
  const newCollab = {
    ...req.body,
    id: generateId('col'),
    createdAt: new Date().toISOString()
  };
  collabs.unshift(newCollab);
  db.persist();
  res.status(201).json(newCollab);
});

router.put('/collaborations/:id', (req: Request, res: Response) => {
  const collabs = db.getCollaborations();
  const index = collabs.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Collaboration not found' });

  collabs[index] = { ...collabs[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(collabs[index]);
});

router.patch('/collaborations/:id/status', (req: Request, res: Response) => {
  const collabs = db.getCollaborations();
  const index = collabs.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Collaboration not found' });

  collabs[index].status = req.body.status;
  db.persist();
  res.json(collabs[index]);
});

router.delete('/collaborations/:id', (req: Request, res: Response) => {
  const collabs = db.getCollaborations();
  const index = collabs.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Collaboration not found' });

  const deleted = collabs.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Collaboration deleted successfully', deleted });
});

// ---------------- CALENDAR / EVENTS ----------------
router.get('/events', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'calendarEvents', db.getCalendarEvents()));
});

router.post('/events', (req: Request, res: Response) => {
  const events = db.getCalendarEvents();
  const newEvent = {
    ...req.body,
    id: generateId('ev'),
    createdAt: new Date().toISOString()
  };
  events.unshift(newEvent);
  db.persist();
  res.status(201).json(newEvent);
});

router.put('/events/:id', (req: Request, res: Response) => {
  const events = db.getCalendarEvents();
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  events[index] = { ...events[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(events[index]);
});

router.delete('/events/:id', (req: Request, res: Response) => {
  const events = db.getCalendarEvents();
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  const deleted = events.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Event deleted successfully', deleted });
});

// ---------------- PIPELINE / CRM ----------------
router.get('/pipeline', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'pipelineDeals', db.getPipelineDeals()));
});

router.post('/pipeline', (req: Request, res: Response) => {
  const deals = db.getPipelineDeals();
  const newDeal = {
    ...req.body,
    id: generateId('dl'),
    createdAt: new Date().toISOString()
  };
  deals.unshift(newDeal);
  db.persist();
  res.status(201).json(newDeal);
});

router.put('/pipeline/:id', (req: Request, res: Response) => {
  const deals = db.getPipelineDeals();
  const index = deals.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Deal not found' });

  deals[index] = { ...deals[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(deals[index]);
});

router.patch('/pipeline/:id/stage', (req: Request, res: Response) => {
  const deals = db.getPipelineDeals();
  const index = deals.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Deal not found' });

  deals[index].stage = req.body.stage;
  db.persist();
  res.json(deals[index]);
});

router.delete('/pipeline/:id', (req: Request, res: Response) => {
  const deals = db.getPipelineDeals();
  const index = deals.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Deal not found' });

  const deleted = deals.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Deal deleted successfully', deleted });
});

// ---------------- CONTRACTS ----------------
router.get('/contracts', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'contracts', db.getContracts()));
});

router.post('/contracts', (req: Request, res: Response) => {
  const contracts = db.getContracts();
  const newContract = {
    ...req.body,
    id: generateId('ct'),
    createdAt: new Date().toISOString()
  };
  contracts.unshift(newContract);
  db.persist();
  res.status(201).json(newContract);
});

router.put('/contracts/:id', (req: Request, res: Response) => {
  const contracts = db.getContracts();
  const index = contracts.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Contract not found' });

  contracts[index] = { ...contracts[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(contracts[index]);
});

router.delete('/contracts/:id', (req: Request, res: Response) => {
  const contracts = db.getContracts();
  const index = contracts.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Contract not found' });

  const deleted = contracts.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Contract deleted successfully', deleted });
});

// ---------------- PAYMENTS ----------------
router.get('/payments', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'payments', db.getPayments()));
});

router.post('/payments', (req: Request, res: Response) => {
  const payments = db.getPayments();
  const newPayment = {
    ...req.body,
    id: generateId('pay'),
    invoiceNumber: req.body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString()
  };
  payments.unshift(newPayment);
  db.persist();
  res.status(201).json(newPayment);
});

router.put('/payments/:id', (req: Request, res: Response) => {
  const payments = db.getPayments();
  const index = payments.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment record not found' });

  payments[index] = { ...payments[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(payments[index]);
});

router.patch('/payments/:id/status', (req: Request, res: Response) => {
  const payments = db.getPayments();
  const index = payments.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment not found' });

  payments[index].status = req.body.status;
  if (req.body.status === 'Pagado' && !payments[index].paidDate) {
    payments[index].paidDate = new Date().toISOString().split('T')[0];
  }
  db.persist();
  res.json(payments[index]);
});

router.delete('/payments/:id', (req: Request, res: Response) => {
  const payments = db.getPayments();
  const index = payments.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment not found' });

  const deleted = payments.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Payment deleted successfully', deleted });
});

// ---------------- TASKS ----------------
router.get('/tasks', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'tasks', db.getTasks()));
});

router.post('/tasks', (req: Request, res: Response) => {
  const tasks = db.getTasks();
  const newTask = {
    ...req.body,
    id: generateId('tsk'),
    createdAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  db.persist();
  res.status(201).json(newTask);
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  const tasks = db.getTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index] = { ...tasks[index], ...req.body, id: req.params.id };
  db.persist();
  res.json(tasks[index]);
});

router.patch('/tasks/:id/status', (req: Request, res: Response) => {
  const tasks = db.getTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index].status = req.body.status;
  if (req.body.status === 'completada') {
    tasks[index].completedAt = new Date().toISOString();
  } else {
    tasks[index].completedAt = undefined;
  }
  db.persist();
  res.json(tasks[index]);
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const tasks = db.getTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const deleted = tasks.splice(index, 1)[0];
  db.persist();
  res.json({ message: 'Task deleted successfully', deleted });
});

// ---------------- MESSAGES ----------------
router.get('/messages', (req: Request, res: Response) => {
  res.json(db.getMessages());
});

router.post('/messages', (req: Request, res: Response) => {
  const messages = db.getMessages();
  const newMessage = {
    ...req.body,
    id: generateId('msg'),
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  db.persist();
  res.status(201).json(newMessage);
});

// ---------------- FILES ----------------
router.get('/files', (req: Request, res: Response) => {
  res.json(scopeCollection(req.user, 'files', db.getFiles()));
});

router.post('/files', (req: Request, res: Response) => {
  const files = db.getFiles();
  const newFile = {
    ...req.body,
    id: generateId('fl'),
    createdAt: new Date().toISOString()
  };
  files.unshift(newFile);
  db.persist();
  res.status(201).json(newFile);
});

router.delete('/files/:id', (req: Request, res: Response) => {
  const files = db.getFiles();
  const index = files.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'File not found' });

  const deleted = files.splice(index, 1)[0];
  if (deleted.storageName) {
    const physicalPath = path.resolve(process.cwd(), 'uploads', path.basename(deleted.storageName));
    if (physicalPath.startsWith(path.resolve(process.cwd(), 'uploads'))) fs.unlink(physicalPath, () => undefined);
  }
  db.persist();
  res.json({ message: 'File deleted successfully', deleted });
});

// ---------------- NOTIFICATIONS ----------------
router.get('/notifications', (req: Request, res: Response) => {
  res.json(db.getNotifications());
});

router.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const notifs = db.getNotifications();
  const notif = notifs.find(n => n.id === req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification not found' });

  notif.read = true;
  db.persist();
  res.json(notif);
});

router.post('/notifications/mark-all-read', (req: Request, res: Response) => {
  const notifs = db.getNotifications();
  notifs.forEach(n => (n.read = true));
  db.persist();
  res.json({ message: 'All notifications marked as read' });
});

// ---------------- SETTINGS ----------------
router.get('/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

router.put('/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// ---------------- ANALYTICS & EXPORTS ----------------
router.get('/analytics', (req: Request, res: Response) => {
  const campaigns = scopeCollection(req.user, 'campaigns', db.getCampaigns());
  const creators = scopeCollection(req.user, 'creators', db.getCreators());

  let totalImpressions = 0;
  let totalReach = 0;
  let totalEngagements = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalSpent = 0;

  campaigns.forEach(c => {
    totalImpressions += c.metrics?.impressions || 0;
    totalReach += c.metrics?.reach || 0;
    totalEngagements += c.metrics?.engagements || 0;
    totalClicks += c.metrics?.clicks || 0;
    totalConversions += c.metrics?.conversions || 0;
    totalSpent += c.spentBudget || 0;
  });

  const avgEngagementRate = totalReach > 0 ? Number(((totalEngagements / totalReach) * 100).toFixed(2)) : 0;
  const avgRoi = campaigns.length > 0 ? Number((campaigns.reduce((sum, c) => sum + (c.metrics?.roi || 0), 0) / campaigns.length).toFixed(2)) : 0;

  const platformTotals = new Map<string, { reach: number; engagements: number; spend: number }>();
  campaigns.forEach(campaign => {
    const platforms = campaign.platforms?.length ? campaign.platforms : ['Sin plataforma'];
    platforms.forEach(platform => {
      const current = platformTotals.get(platform) || { reach: 0, engagements: 0, spend: 0 };
      const share = 1 / platforms.length;
      current.reach += (campaign.metrics?.reach || 0) * share;
      current.engagements += (campaign.metrics?.engagements || 0) * share;
      current.spend += (campaign.spentBudget || 0) * share;
      platformTotals.set(platform, current);
    });
  });
  const platformStats = Array.from(platformTotals.entries()).map(([platform, totals]) => ({
    platform,
    reach: Math.round(totals.reach),
    engagements: Math.round(totals.engagements),
    rate: totals.reach > 0 ? Number(((totals.engagements / totals.reach) * 100).toFixed(2)) : 0,
    spend: Number(totals.spend.toFixed(2))
  }));

  // Creator ROI ranking
  const creatorPerformance = creators.slice(0, 5).map(cr => ({
    name: cr.artisticName,
    followers: cr.totalFollowers,
    reach: cr.avgReach,
    engagementRate: cr.avgEngagementRate,
    completedCampaigns: campaigns.filter(cp => cp.creatorIds.includes(cr.id)).length
  }));

  res.json({
    metrics: {
      totalImpressions,
      totalReach,
      totalEngagements,
      avgEngagementRate,
      totalClicks,
      totalConversions,
      totalSpent,
      avgRoi
    },
    platformStats,
    creatorPerformance
  });
});

router.get('/analytics/export/csv', (req: Request, res: Response) => {
  const campaigns = scopeCollection(req.user, 'campaigns', db.getCampaigns());
  let csv = 'ID,Campaña,Marca,Presupuesto,Gastado,Estado,Impresiones,Alcance,Engagement,Clicks,Conversiones,ROI\n';

  campaigns.forEach(c => {
    csv += `"${c.id}","${c.name}","${c.brandName || ''}",${c.budget},${c.spentBudget},"${c.status}",${c.metrics.impressions},${c.metrics.reach},${c.metrics.engagements},${c.metrics.clicks},${c.metrics.conversions},${c.metrics.roi}\n`;
  });

  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment('vyralexx-analytics-report.csv');
  res.send(csv);
});

// ---------------- DEMO DATA CONTROLS ----------------
router.post('/demo/reset', requireSuperAdmin, (_req: Request, res: Response) => {
  db.resetToDemo();
  res.json({ message: 'Datos de demostración restablecidos con éxito', stats: db.getDashboardStats() });
});

router.post('/demo/clear', requireSuperAdmin, (_req: Request, res: Response) => {
  db.clearAllData();
  res.json({ message: 'Todos los datos de demostración han sido eliminados', stats: db.getDashboardStats() });
});

export default router;
