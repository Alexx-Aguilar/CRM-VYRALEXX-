import React from 'react';
import {
  LayoutDashboard, Users, Building2, Briefcase, Megaphone,
  Handshake, Calendar, BarChart3, TrendingUp, FileText,
  DollarSign, CheckSquare, MessageSquare, FolderGit2,
  Bell, Settings, Zap, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, unreadNotifsCount, hasPermission, userRole } = useApp();

  const navGroups = [
    {
      title: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'creators', label: 'Creadores', icon: Users },
        { id: 'agencies', label: 'Agencias', icon: Building2 },
        { id: 'brands', label: 'Marcas y Clientes', icon: Briefcase },
      ]
    },
    {
      title: 'GESTIÓN Y OPERACIONES',
      items: [
        { id: 'campaigns', label: 'Campañas', icon: Megaphone },
        { id: 'collaborations', label: 'Colaboraciones', icon: Handshake },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'tasks', label: 'Tareas y Proyectos', icon: CheckSquare },
      ]
    },
    {
      title: 'COMERCIAL Y FINANZAS',
      items: [
        { id: 'pipeline', label: 'CRM Comercial', icon: TrendingUp },
        { id: 'analytics', label: 'Analítica y Reportes', icon: BarChart3 },
        { id: 'contracts', label: 'Contratos y Docs', icon: FileText },
        { id: 'payments', label: 'Presupuestos y Pagos', icon: DollarSign },
      ]
    },
    {
      title: 'SISTEMA Y EQUIPO',
      items: [
        { id: 'messages', label: 'Mensajes', icon: MessageSquare },
        { id: 'files', label: 'Archivos', icon: FolderGit2 },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, badge: unreadNotifsCount },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ]
    }
  ];

  const getRoleLabel = () => {
    switch (userRole) {
      case 'superadmin': return 'Super Admin';
      case 'agency_admin': return 'Admin Agencia';
      case 'campaign_manager': return 'Gestor Campañas';
      case 'creator': return 'Creador Pro';
      case 'brand': return 'Marca Cliente';
      default: return 'Usuario';
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ease-in-out border-r border-white/[0.06] flex flex-col bg-[#10101B] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#10101B]">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B3DFF] via-[#A855F7] to-[#EC4899] p-[1.5px] shadow-lg shadow-[#8B3DFF]/25">
              <div className="w-full h-full bg-[#10101B] rounded-[10px] flex items-center justify-center">
                <Zap size={20} className="text-[#EC4899] fill-[#EC4899]/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">VYRALEXX</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#8B3DFF]/20 text-[#A855F7] border border-[#8B3DFF]/30">CRM</span>
              </div>
              <p className="text-[11px] text-[#A1A1B5] font-medium tracking-tight">Creator & Agency Suite</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-[#8B3DFF] via-[#A855F7] to-[#EC4899] p-[1.5px] shadow-lg shadow-[#8B3DFF]/25">
            <div className="w-full h-full bg-[#10101B] rounded-[10px] flex items-center justify-center">
              <Zap size={20} className="text-[#EC4899]" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors ${collapsed ? 'hidden' : 'block'}`}
          title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => hasPermission(item.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#A1A1B5]/70 uppercase mb-2">
                  {group.title}
                </h4>
              )}
              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B3DFF]/25 via-[#A855F7]/15 to-[#EC4899]/10 text-white border border-[#A855F7]/40 shadow-md shadow-[#8B3DFF]/15'
                        : 'text-[#A1A1B5] hover:text-white hover:bg-[#1B1929] border border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#A855F7] to-[#EC4899] rounded-r-full shadow-[0_0_10px_#A855F7]" />
                    )}

                    <Icon
                      size={18}
                      className={`transition-colors shrink-0 ${
                        isActive
                          ? 'text-[#EC4899]'
                          : 'text-[#A1A1B5] group-hover:text-white'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EC4899] text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Collapse button on collapsed view */}
      {collapsed && (
        <div className="p-3 border-t border-white/[0.06] flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-xl text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* User Profile at Bottom (Per User Request Section 3) */}
      {!collapsed && (
        <div className="p-3 border-t border-white/[0.06] bg-[#10101B]">
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-3 p-2 rounded-xl bg-[#1B1929] hover:bg-[#252239] border border-white/[0.06] transition-colors cursor-pointer group"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Alejandro Morales"
                className="w-9 h-9 rounded-xl object-cover border border-[#8B3DFF]/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#1B1929]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-[#EC4899] transition-colors">
                Alejandro Morales
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-[#A855F7] truncate">
                  {getRoleLabel()}
                </span>
                <span className="text-[9px] text-[#A1A1B5]/60">• Conectado</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
