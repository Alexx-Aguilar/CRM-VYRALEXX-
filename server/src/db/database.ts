import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Creator, Agency, Brand, Campaign, Collaboration, CalendarEvent,
  PipelineDeal, Contract, PaymentRecord, Task, ChatMessage,
  MediaFile, SystemNotification, SystemSettings
} from '../types/index.js';
import {
  initialAgencies, initialCreators, initialBrands, initialCampaigns,
  initialCollaborations, initialCalendarEvents, initialPipelineDeals,
  initialContracts, initialPayments, initialTasks, initialMessages,
  initialFiles, initialNotifications, initialSettings
} from './seedData.js';
import { pool } from './mysql.js';
import type { AuthUser } from '../auth/auth.js';
import { scopeCollection } from '../auth/scope.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'vyralexx.db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

export interface DatabaseSchema {
  agencies: Agency[];
  creators: Creator[];
  brands: Brand[];
  campaigns: Campaign[];
  collaborations: Collaboration[];
  calendarEvents: CalendarEvent[];
  pipelineDeals: PipelineDeal[];
  contracts: Contract[];
  payments: PaymentRecord[];
  tasks: Task[];
  messages: ChatMessage[];
  files: MediaFile[];
  notifications: SystemNotification[];
  settings: SystemSettings;
}

class Database {
  private data: DatabaseSchema;
  private persistQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.data = this.loadDatabase();
  }

  public async initialize(): Promise<void> {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crm_store (
        collection VARCHAR(50) PRIMARY KEY,
        payload JSON NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await pool.query('SELECT collection, payload FROM crm_store');
    const mysqlData = rows as Array<{ collection: string; payload: unknown }>;

    if (mysqlData.length === 0) {
      await this.persistToMySql();
      console.log('Datos JSON migrados a MySQL');
      return;
    }

    for (const row of mysqlData) {
      const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
      if (row.collection in this.data) {
        (this.data as unknown as Record<string, unknown>)[row.collection] = payload;
      }
    }

    this.saveData(this.data);
    console.log('Datos cargados desde MySQL');
  }

  private getDefaultData(): DatabaseSchema {
    return {
      agencies: JSON.parse(JSON.stringify(initialAgencies)),
      creators: JSON.parse(JSON.stringify(initialCreators)),
      brands: JSON.parse(JSON.stringify(initialBrands)),
      campaigns: JSON.parse(JSON.stringify(initialCampaigns)),
      collaborations: JSON.parse(JSON.stringify(initialCollaborations)),
      calendarEvents: JSON.parse(JSON.stringify(initialCalendarEvents)),
      pipelineDeals: JSON.parse(JSON.stringify(initialPipelineDeals)),
      contracts: JSON.parse(JSON.stringify(initialContracts)),
      payments: JSON.parse(JSON.stringify(initialPayments)),
      tasks: JSON.parse(JSON.stringify(initialTasks)),
      messages: JSON.parse(JSON.stringify(initialMessages)),
      files: JSON.parse(JSON.stringify(initialFiles)),
      notifications: JSON.parse(JSON.stringify(initialNotifications)),
      settings: JSON.parse(JSON.stringify(initialSettings)),
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        if (content.trim()) {
          const parsed = JSON.parse(content);
          return {
            ...this.getDefaultData(),
            ...parsed,
          };
        }
      }
    } catch (error) {
      console.error('Error reading database file, using defaults:', error);
    }

    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        const backupFile = path.join(BACKUP_DIR, `vyralexx-${new Date().toISOString().slice(0, 10)}.json`);
        if (!fs.existsSync(backupFile)) fs.copyFileSync(DB_FILE, backupFile);
      }
      const temporaryFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(temporaryFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(temporaryFile, DB_FILE);
    } catch (error) {
      console.error('Failed to write database file:', error);
    }
  }

  public persist(): void {
    this.saveData(this.data);
    this.persistQueue = this.persistQueue
      .then(() => this.persistToMySql())
      .catch(error => console.error('Error guardando datos en MySQL:', error));
  }

  public async flush(): Promise<void> {
    await this.persistQueue;
  }

  private async persistToMySql(): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const [collection, payload] of Object.entries(this.data)) {
        await connection.query(
          `INSERT INTO crm_store (collection, payload)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE payload = VALUES(payload)`,
          [collection, JSON.stringify(payload)]
        );
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Error guardando datos en MySQL:', error);
    } finally {
      connection.release();
    }
  }

  public resetToDemo(): void {
    this.data = this.getDefaultData();
    this.persist();
  }

  public clearAllData(): void {
    this.data = {
      agencies: [],
      creators: [],
      brands: [],
      campaigns: [],
      collaborations: [],
      calendarEvents: [],
      pipelineDeals: [],
      contracts: [],
      payments: [],
      tasks: [],
      messages: [],
      files: [],
      notifications: [],
      settings: {
        companyName: 'Mi Empresa CRM',
        currency: 'USD ($)',
        timezone: 'America/Mexico_City',
        language: 'Español (ES)',
        notificationsEnabled: true,
        apiIntegrations: { instagram: false, tiktok: false, youtube: false, metaAds: false }
      }
    };
    this.persist();
  }

  // Generic collections access
  public getAgencies(): Agency[] { return this.data.agencies; }
  public getCreators(): Creator[] { return this.data.creators; }
  public getBrands(): Brand[] { return this.data.brands; }
  public getCampaigns(): Campaign[] { return this.data.campaigns; }
  public getCollaborations(): Collaboration[] { return this.data.collaborations; }
  public getCalendarEvents(): CalendarEvent[] { return this.data.calendarEvents; }
  public getPipelineDeals(): PipelineDeal[] { return this.data.pipelineDeals; }
  public getContracts(): Contract[] { return this.data.contracts; }
  public getPayments(): PaymentRecord[] { return this.data.payments; }
  public getTasks(): Task[] { return this.data.tasks; }
  public getMessages(): ChatMessage[] { return this.data.messages; }
  public getFiles(): MediaFile[] { return this.data.files; }
  public getNotifications(): SystemNotification[] { return this.data.notifications; }
  public getSettings(): SystemSettings { return this.data.settings; }

  // Setters / Updates
  public updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
    return this.data.settings;
  }

  // Dashboard Aggregates
  public getDashboardStatsForUser(user?: AuthUser) {
    const originalData = this.data;
    this.data = {
      ...originalData,
      creators: scopeCollection(user, 'creators', originalData.creators),
      brands: scopeCollection(user, 'brands', originalData.brands),
      campaigns: scopeCollection(user, 'campaigns', originalData.campaigns),
      collaborations: scopeCollection(user, 'collaborations', originalData.collaborations),
      payments: scopeCollection(user, 'payments', originalData.payments)
    };
    try {
      return this.getDashboardStats();
    } finally {
      this.data = originalData;
    }
  }

  public getDashboardStats(user?: AuthUser) {
    const creators = scopeCollection(user, 'creators', this.data.creators);
    const campaigns = scopeCollection(user, 'campaigns', this.data.campaigns);
    const collaborations = scopeCollection(user, 'collaborations', this.data.collaborations);
    const payments = scopeCollection(user, 'payments', this.data.payments);
    const totalCreators = creators.length;
    const activeCreators = creators.filter(c => c.status === 'Activo').length;
    const totalAgencies = this.data.agencies.length;
    const totalBrands = this.data.brands.length;
    const activeCampaigns = this.data.campaigns.filter(c => c.status === 'En ejecución' || c.status === 'Planificación').length;
    const finishedCampaigns = this.data.campaigns.filter(c => c.status === 'Finalizada').length;
    const pendingCollaborations = this.data.collaborations.filter(c => c.status === 'Nueva propuesta' || c.status === 'En negociación' || c.status === 'En producción').length;

    // Financials
    const totalRevenue = payments
      .filter(p => p.type === 'Cobro' && p.status === 'Pagado')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRevenue = payments
      .filter(p => p.type === 'Cobro' && p.status === 'Pendiente')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayouts = payments
      .filter(p => p.type === 'Pago' && p.status === 'Pendiente')
      .reduce((sum, p) => sum + p.amount, 0);

    // Performance aggregations
    let totalImpressions = 0;
    let totalReach = 0;
    let totalEngagements = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalBudgetSpent = 0;

    campaigns.forEach(c => {
      totalImpressions += c.metrics?.impressions || 0;
      totalReach += c.metrics?.reach || 0;
      totalEngagements += c.metrics?.engagements || 0;
      totalClicks += c.metrics?.clicks || 0;
      totalConversions += c.metrics?.conversions || 0;
      totalBudgetSpent += c.spentBudget || 0;
    });

    const avgEngagementRate = totalReach > 0 ? Number(((totalEngagements / totalReach) * 100).toFixed(2)) : 0;
    const overallRoi = totalBudgetSpent > 0 ? Number(((totalRevenue / totalBudgetSpent)).toFixed(2)) : 0;

    // Monthly revenue simulation based on payments
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const payments = this.data.payments.filter(payment => {
        const date = new Date(payment.issueDate || payment.createdAt);
        return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
      });
      return {
        month: monthNames[monthDate.getMonth()],
        revenue: payments.filter(payment => payment.type === 'Cobro').reduce((sum, payment) => sum + payment.amount, 0),
        payouts: payments.filter(payment => payment.type === 'Pago').reduce((sum, payment) => sum + payment.amount, 0)
      };
    });

    // Platform share calculation
    const platformColors: Record<string, string> = {
      Instagram: '#E1306C', TikTok: '#22D3EE', YouTube: '#EF4444', Twitch: '#9333EA', Facebook: '#4267B2'
    };
    const platformCounts = new Map<string, number>();
    this.data.campaigns.forEach(campaign => campaign.platforms?.forEach(platform => {
      const label = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
      platformCounts.set(label, (platformCounts.get(label) || 0) + 1);
    }));
    const platformTotal = Array.from(platformCounts.values()).reduce((sum, count) => sum + count, 0);
    const platformBreakdown = Array.from(platformCounts.entries()).map(([name, count]) => ({
      name,
      value: platformTotal > 0 ? Number(((count / platformTotal) * 100).toFixed(1)) : 0,
      color: platformColors[name] || '#A855F7'
    }));

    // Status distribution
    const campaignStatusDistribution = [
      { status: 'En ejecución', count: this.data.campaigns.filter(c => c.status === 'En ejecución').length },
      { status: 'Planificación', count: this.data.campaigns.filter(c => c.status === 'Planificación').length },
      { status: 'En revisión', count: this.data.campaigns.filter(c => c.status === 'En revisión').length },
      { status: 'Finalizada', count: this.data.campaigns.filter(c => c.status === 'Finalizada').length },
    ];

    // Recent activities
    const recentActivity = [
      { id: 'act-1', text: 'Valeria CyberGlow publicó el Instagram Reel acordado', time: 'Hace 2 horas', type: 'campaign' },
      { id: 'act-2', text: 'Pago recibido de CyberPulse Audio por $22,500 USD', time: 'Hace 5 horas', type: 'payment' },
      { id: 'act-3', text: 'Luminary Skincare Lab avanzó a Negociación en CRM', time: 'Hace 1 día', type: 'crm' },
      { id: 'act-4', text: 'Nueva propuesta enviada a CamiFit Iron', time: 'Hace 2 días', type: 'collab' },
    ];

    const activityCandidates = [
      ...this.data.campaigns.map(campaign => ({ id: campaign.id, text: `Campaña actualizada: ${campaign.name}`, createdAt: campaign.createdAt, type: 'campaign' })),
      ...this.data.payments.map(payment => ({ id: payment.id, text: `Pago registrado: ${payment.entityName}`, createdAt: payment.createdAt, type: 'payment' })),
      ...this.data.collaborations.map(collaboration => ({ id: collaboration.id, text: `Colaboración: ${collaboration.creatorName} / ${collaboration.brandName}`, createdAt: collaboration.createdAt, type: 'collab' }))
    ];
    const recentActivityFromData = activityCandidates
      .filter(activity => activity.createdAt)
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, 4)
      .map(activity => {
        const hours = Math.max(0, Math.floor((Date.now() - new Date(activity.createdAt).getTime()) / 3600000));
        return { id: activity.id, text: activity.text, time: hours < 1 ? 'Hace unos minutos' : `Hace ${hours} h`, type: activity.type };
      });

    // Urgent campaigns
    const urgentCampaigns = this.data.campaigns
      .filter(c => c.status === 'En ejecución' || c.status === 'Planificación')
      .slice(0, 3);

    return {
      overview: {
        totalCreators,
        activeCreators,
        totalAgencies,
        totalBrands,
        activeCampaigns,
        finishedCampaigns,
        pendingCollaborations,
        totalRevenue,
        pendingRevenue,
        pendingPayouts,
        totalImpressions,
        totalReach,
        totalEngagements,
        avgEngagementRate,
        totalClicks,
        totalConversions,
        totalBudgetSpent,
        overallRoi
      },
      monthlyRevenue,
      platformBreakdown,
      campaignStatusDistribution,
      recentActivity: recentActivityFromData,
      urgentCampaigns
    };
  }
}

export const db = new Database();
