import {
  Creator, Agency, Brand, Campaign, Collaboration, CalendarEvent,
  PipelineDeal, Contract, PaymentRecord, Task, ChatMessage,
  MediaFile, SystemNotification, SystemSettings, DashboardStats
} from '../types/index.js';
import { User } from '../types/index.js';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('vyralexx_token');
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });
  } catch {
    throw new Error('No se puede conectar con el backend. Inicia el servidor con npm run dev.');
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('vyralexx_token');
      localStorage.removeItem('vyralexx_user');
    }
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || errorBody.message || 'Error en la petición al servidor');
  }

  return res.json();
}

export const api = {
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('vyralexx_token', result.token);
    localStorage.setItem('vyralexx_user', JSON.stringify(result.user));
    return result.user;
  },
  logout: () => {
    localStorage.removeItem('vyralexx_token');
    localStorage.removeItem('vyralexx_user');
  },
  getStoredUser: (): User | null => {
    try {
      const value = localStorage.getItem('vyralexx_user');
      return value ? JSON.parse(value) as User : null;
    } catch {
      return null;
    }
  },
  getCurrentUser: () => request<{ user: User }>('/auth/me'),
  getUsers: () => request<User[]>('/auth/users'),
  createUser: (user: { name: string; email: string; password: string; role: User['role']; agencyId?: string; brandId?: string; creatorId?: string }) => request<User>('/auth/users', {
    method: 'POST',
    body: JSON.stringify(user)
  }),
  // Dashboard
  getDashboardStats: () => request<DashboardStats>('/dashboard/stats'),

  // Creators
  getCreators: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Creator[]>(`/creators${query}`);
  },
  getCreatorById: (id: string) => request<Creator>(`/creators/${id}`),
  createCreator: (creator: Partial<Creator>) => request<Creator>('/creators', { method: 'POST', body: JSON.stringify(creator) }),
  updateCreator: (id: string, creator: Partial<Creator>) => request<Creator>(`/creators/${id}`, { method: 'PUT', body: JSON.stringify(creator) }),
  deleteCreator: (id: string) => request<{ message: string; deleted: Creator }>(`/creators/${id}`, { method: 'DELETE' }),

  // Agencies
  getAgencies: () => request<Agency[]>('/agencies'),
  getAgencyById: (id: string) => request<Agency>(`/agencies/${id}`),
  createAgency: (agency: Partial<Agency>) => request<Agency>('/agencies', { method: 'POST', body: JSON.stringify(agency) }),
  updateAgency: (id: string, agency: Partial<Agency>) => request<Agency>(`/agencies/${id}`, { method: 'PUT', body: JSON.stringify(agency) }),
  deleteAgency: (id: string) => request<{ message: string; deleted: Agency }>(`/agencies/${id}`, { method: 'DELETE' }),

  // Brands
  getBrands: () => request<Brand[]>('/brands'),
  getBrandById: (id: string) => request<Brand>(`/brands/${id}`),
  createBrand: (brand: Partial<Brand>) => request<Brand>('/brands', { method: 'POST', body: JSON.stringify(brand) }),
  updateBrand: (id: string, brand: Partial<Brand>) => request<Brand>(`/brands/${id}`, { method: 'PUT', body: JSON.stringify(brand) }),
  deleteBrand: (id: string) => request<{ message: string; deleted: Brand }>(`/brands/${id}`, { method: 'DELETE' }),

  // Campaigns
  getCampaigns: () => request<Campaign[]>('/campaigns'),
  getCampaignById: (id: string) => request<Campaign>(`/campaigns/${id}`),
  createCampaign: (campaign: Partial<Campaign>) => request<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(campaign) }),
  updateCampaign: (id: string, campaign: Partial<Campaign>) => request<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(campaign) }),
  deleteCampaign: (id: string) => request<{ message: string; deleted: Campaign }>(`/campaigns/${id}`, { method: 'DELETE' }),

  // Collaborations
  getCollaborations: () => request<Collaboration[]>('/collaborations'),
  createCollaboration: (collab: Partial<Collaboration>) => request<Collaboration>('/collaborations', { method: 'POST', body: JSON.stringify(collab) }),
  updateCollaboration: (id: string, collab: Partial<Collaboration>) => request<Collaboration>(`/collaborations/${id}`, { method: 'PUT', body: JSON.stringify(collab) }),
  updateCollaborationStatus: (id: string, status: string) => request<Collaboration>(`/collaborations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteCollaboration: (id: string) => request<{ message: string }>(`/collaborations/${id}`, { method: 'DELETE' }),

  // Calendar
  getEvents: () => request<CalendarEvent[]>('/events'),
  createEvent: (event: Partial<CalendarEvent>) => request<CalendarEvent>('/events', { method: 'POST', body: JSON.stringify(event) }),
  updateEvent: (id: string, event: Partial<CalendarEvent>) => request<CalendarEvent>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  deleteEvent: (id: string) => request<{ message: string }>(`/events/${id}`, { method: 'DELETE' }),

  // Pipeline
  getPipelineDeals: () => request<PipelineDeal[]>('/pipeline'),
  createDeal: (deal: Partial<PipelineDeal>) => request<PipelineDeal>('/pipeline', { method: 'POST', body: JSON.stringify(deal) }),
  updateDeal: (id: string, deal: Partial<PipelineDeal>) => request<PipelineDeal>(`/pipeline/${id}`, { method: 'PUT', body: JSON.stringify(deal) }),
  updateDealStage: (id: string, stage: string) => request<PipelineDeal>(`/pipeline/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
  deleteDeal: (id: string) => request<{ message: string }>(`/pipeline/${id}`, { method: 'DELETE' }),

  // Contracts
  getContracts: () => request<Contract[]>('/contracts'),
  createContract: (contract: Partial<Contract>) => request<Contract>('/contracts', { method: 'POST', body: JSON.stringify(contract) }),
  updateContract: (id: string, contract: Partial<Contract>) => request<Contract>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(contract) }),
  deleteContract: (id: string) => request<{ message: string }>(`/contracts/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: () => request<PaymentRecord[]>('/payments'),
  createPayment: (payment: Partial<PaymentRecord>) => request<PaymentRecord>('/payments', { method: 'POST', body: JSON.stringify(payment) }),
  updatePayment: (id: string, payment: Partial<PaymentRecord>) => request<PaymentRecord>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(payment) }),
  updatePaymentStatus: (id: string, status: string) => request<PaymentRecord>(`/payments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deletePayment: (id: string) => request<{ message: string }>(`/payments/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => request<Task[]>('/tasks'),
  createTask: (task: Partial<Task>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: string, task: Partial<Task>) => request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  updateTaskStatus: (id: string, status: string) => request<Task>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteTask: (id: string) => request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: () => request<ChatMessage[]>('/messages'),
  sendMessage: (msg: Partial<ChatMessage>) => request<ChatMessage>('/messages', { method: 'POST', body: JSON.stringify(msg) }),

  // Files
  getFiles: () => request<MediaFile[]>('/files'),
  uploadFile: async (file: File, category: string, relatedCampaign?: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    if (relatedCampaign) form.append('relatedCampaign', relatedCampaign);
    const token = localStorage.getItem('vyralexx_token');
    const res = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error || 'No se pudo subir el archivo');
    }
    return res.json() as Promise<MediaFile>;
  },
  downloadFile: async (id: string, filename: string) => {
    const token = localStorage.getItem('vyralexx_token');
    const res = await fetch(`${API_BASE}/files/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!res.ok) throw new Error('No se pudo descargar el archivo');
    const url = URL.createObjectURL(await res.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
  createFile: (file: Partial<MediaFile>) => request<MediaFile>('/files', { method: 'POST', body: JSON.stringify(file) }),
  deleteFile: (id: string) => request<{ message: string }>(`/files/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request<SystemNotification[]>('/notifications'),
  markNotificationRead: (id: string) => request<SystemNotification>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request<{ message: string }>('/notifications/mark-all-read', { method: 'POST' }),

  // Settings
  getSettings: () => request<SystemSettings>('/settings'),
  updateSettings: (settings: Partial<SystemSettings>) => request<SystemSettings>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // Analytics
  getAnalytics: () => request<any>('/analytics'),
  downloadAnalyticsCsv: async () => {
    const token = localStorage.getItem('vyralexx_token');
    const res = await fetch(`${API_BASE}/analytics/export/csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!res.ok) throw new Error('No se pudo exportar la analítica');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vyralexx-analytics.csv';
    link.click();
    URL.revokeObjectURL(url);
  },

  // Demo Controls
  resetDemoData: () => request<{ message: string; stats: any }>('/demo/reset', { method: 'POST' }),
  clearDemoData: () => request<{ message: string; stats: any }>('/demo/clear', { method: 'POST' })
};
