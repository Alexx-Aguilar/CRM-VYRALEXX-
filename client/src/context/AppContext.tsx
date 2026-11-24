import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, SystemNotification } from '../types/index.js';
import { api } from '../services/api.js';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: ToastItem[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
  notifications: SystemNotification[];
  unreadNotifsCount: number;
  refreshNotifications: () => void;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  hasPermission: (module: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; initialRole?: UserRole }> = ({ children, initialRole = 'superadmin' }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const markNotifAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotifsAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      addToast('success', 'Notificaciones', 'Todas marcadas como leídas');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [refreshTrigger]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // RBAC permissions helper
  const hasPermission = (module: string): boolean => {
    if (userRole === 'superadmin') return true;
    if (userRole === 'agency_admin') {
      return ['dashboard', 'creators', 'brands', 'campaigns', 'collaborations', 'calendar', 'analytics', 'pipeline', 'contracts', 'payments', 'tasks', 'messages', 'files', 'notifications', 'settings'].includes(module);
    }
    if (userRole === 'campaign_manager') {
      return ['dashboard', 'creators', 'campaigns', 'collaborations', 'calendar', 'analytics', 'tasks', 'messages', 'files', 'notifications'].includes(module);
    }
    if (userRole === 'creator') {
      return ['dashboard', 'campaigns', 'collaborations', 'calendar', 'messages', 'files', 'notifications', 'settings'].includes(module);
    }
    if (userRole === 'brand') {
      return ['dashboard', 'campaigns', 'collaborations', 'calendar', 'analytics', 'messages', 'files', 'notifications', 'settings'].includes(module);
    }
    return true;
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      userRole,
      setUserRole,
      isSearchOpen,
      setIsSearchOpen,
      toasts,
      addToast,
      removeToast,
      notifications,
      unreadNotifsCount,
      refreshNotifications,
      markNotifAsRead,
      markAllNotifsAsRead,
      refreshTrigger,
      triggerRefresh,
      hasPermission
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
