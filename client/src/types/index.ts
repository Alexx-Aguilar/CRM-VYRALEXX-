export type UserRole = 'superadmin' | 'agency_admin' | 'campaign_manager' | 'creator' | 'brand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  agencyId?: string;
  brandId?: string;
  creatorId?: string;
}

export interface SocialProfile {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitch' | 'twitter';
  handle: string;
  followers: number;
  url: string;
  engagementRate: number;
  avgViews: number;
}

export interface CreatorRates {
  instagramReel: number;
  instagramStory: number;
  tiktokVideo: number;
  youtubeDedicated: number;
  youtubeIntegration: number;
  eventAttendance: number;
}

export interface AudienceDemographics {
  topCountries: { country: string; percentage: number }[];
  genderSplit: { male: number; female: number; other: number };
  ageGroups: { range: string; percentage: number }[];
}

export interface Creator {
  id: string;
  name: string;
  artisticName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  category: string;
  avatar: string;
  socialProfiles: SocialProfile[];
  rates: CreatorRates;
  audience: AudienceDemographics;
  totalFollowers: number;
  avgEngagementRate: number;
  avgReach: number;
  availability: 'Disponible' | 'En proyectos' | 'No disponible';
  status: 'Activo' | 'En revisión' | 'Inactivo';
  agencyId?: string;
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  managerName: string;
  representedCreatorsCount: number;
  managedCampaignsCount: number;
  status: 'Activa' | 'En pausa' | 'Inactiva';
  notes: string;
  createdAt: string;
}

export type BrandStatus = 'Prospecto' | 'Contactado' | 'Negociación' | 'Cliente activo' | 'Cliente inactivo';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  industry: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  estimatedBudget: number;
  accountManager: string;
  status: BrandStatus;
  campaignsCount: number;
  notes: string;
  createdAt: string;
}

export type CampaignStatus = 
  | 'Borrador' 
  | 'Planificación' 
  | 'Pendiente de aprobación' 
  | 'En ejecución' 
  | 'En revisión' 
  | 'Finalizada' 
  | 'Cancelada';

export interface CampaignDeliverable {
  id: string;
  creatorId: string;
  creatorName: string;
  type: string;
  quantity: number;
  dueDate: string;
  status: 'Pendiente' | 'En producción' | 'En revisión' | 'Aprobado' | 'Publicado';
  publishUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  brandId: string;
  brandName?: string;
  agencyId?: string;
  agencyName?: string;
  description: string;
  objectives: string;
  budget: number;
  spentBudget: number;
  startDate: string;
  endDate: string;
  platforms: string[];
  creatorIds: string[];
  deliverables: CampaignDeliverable[];
  managerName: string;
  status: CampaignStatus;
  metrics: {
    impressions: number;
    reach: number;
    engagements: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  createdAt: string;
}

export type CollaborationStatus = 
  | 'Nueva propuesta' 
  | 'En negociación' 
  | 'Aprobada' 
  | 'En producción' 
  | 'Publicada' 
  | 'Completada' 
  | 'Rechazada';

export interface Collaboration {
  id: string;
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorArtisticName: string;
  creatorAvatar: string;
  proposalDetails: string;
  agreedFee: number;
  deliverablesText: string;
  publicationDate: string;
  status: CollaborationStatus;
  notes: string;
  linkReview?: string;
  createdAt: string;
}

export type EventType = 'campaña' | 'entrega_contenido' | 'reunión' | 'vencimiento_contrato' | 'fecha_pago' | 'tarea';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  relatedType?: string;
  relatedId?: string;
  allDay: boolean;
  color?: string;
  createdAt: string;
}

export type PipelineStage = 
  | 'nuevo_prospecto' 
  | 'primer_contacto' 
  | 'reunion_programada' 
  | 'propuesta_enviada' 
  | 'negociacion' 
  | 'ganado' 
  | 'perdido';

export interface PipelineDeal {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  contactName: string;
  contactEmail: string;
  dealValue: number;
  probability: number;
  expectedCloseDate: string;
  stage: PipelineStage;
  owner: string;
  source: string;
  notes: string;
  createdAt: string;
}

export type ContractStatus = 'Borrador' | 'En revisión' | 'Firmado' | 'Vencido' | 'Cancelado';

export interface Contract {
  id: string;
  title: string;
  contractType: 'Patrocinio de marca' | 'Representación de creador' | 'Acuerdo de confidencialidad (NDA)' | 'Servicios de agencia' | 'Licencia de contenido';
  partyType: 'Marca' | 'Creador' | 'Agencia';
  partyId: string;
  partyName: string;
  status: ContractStatus;
  value: number;
  startDate: string;
  endDate: string;
  fileName: string;
  fileSize: string;
  notes: string;
  createdAt: string;
}

export type PaymentStatus = 'Pagado' | 'Pendiente' | 'Atrasado' | 'Cancelado';
export type PaymentType = 'Cobro' | 'Pago';

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  concept: string;
  entityType: 'Marca' | 'Creador';
  entityId: string;
  entityName: string;
  campaignId?: string;
  campaignName?: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskStatus = 'por_hacer' | 'en_progreso' | 'en_revision' | 'completada';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  campaignId?: string;
  campaignName?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  message: string;
  attachments?: { name: string; size: string; type: string }[];
  timestamp: string;
  isInternal: boolean;
}

export interface MediaFile {
  id: string;
  name: string;
  category: 'Creativos' | 'Media Kits' | 'Contratos' | 'Reportes' | 'Facturas' | 'Bocetos';
  size: string;
  fileType: string;
  url: string;
  storageName?: string;
  uploadedBy: string;
  relatedCampaign?: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'alerta' | 'info' | 'exito' | 'recordatorio';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SystemSettings {
  companyName: string;
  currency: string;
  timezone: string;
  language: string;
  notificationsEnabled: boolean;
  apiIntegrations: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    metaAds: boolean;
  };
}

export interface DashboardStats {
  overview: {
    totalCreators: number;
    activeCreators: number;
    totalAgencies: number;
    totalBrands: number;
    activeCampaigns: number;
    finishedCampaigns: number;
    pendingCollaborations: number;
    totalRevenue: number;
    pendingRevenue: number;
    pendingPayouts: number;
    totalImpressions: number;
    totalReach: number;
    totalEngagements: number;
    avgEngagementRate: number;
    totalClicks: number;
    totalConversions: number;
    totalBudgetSpent: number;
    overallRoi: number;
  };
  monthlyRevenue: { month: string; revenue: number; payouts: number }[];
  platformBreakdown: { name: string; value: number; color: string }[];
  campaignStatusDistribution: { status: string; count: number }[];
  recentActivity: { id: string; text: string; time: string; type: string }[];
  urgentCampaigns: Campaign[];
}
