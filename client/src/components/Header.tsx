import React, { useState } from 'react';
import {
  Search, Bell, Shield, ChevronDown, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { UserRole } from '../types/index.js';
import { api } from '../services/api.js';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    setIsSearchOpen,
    unreadNotifsCount,
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead,
    addToast
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const roles: { id: UserRole; name: string; desc: string; badge: string }[] = [
    { id: 'superadmin', name: 'Superadministrador', desc: 'Control global de la plataforma', badge: 'bg-[#8B3DFF]/20 text-[#A855F7] border-[#8B3DFF]/30' },
    { id: 'agency_admin', name: 'Admin de Agencia', desc: 'Gestión de talentos y campañas', badge: 'bg-[#4263EB]/20 text-[#4263EB] border-[#4263EB]/30' },
    { id: 'campaign_manager', name: 'Gestor de Campañas', desc: 'Entregables y seguimiento', badge: 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/30' },
    { id: 'creator', name: 'Creador / Influencer', desc: 'Perfil, métricas y propuestas', badge: 'bg-[#EC4899]/20 text-[#EC4899] border-[#EC4899]/30' },
    { id: 'brand', name: 'Marca / Cliente', desc: 'Campañas y entregables contratados', badge: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30' },
  ];

  const currentRoleInfo = roles.find(r => r.id === userRole) || roles[0];
  const canSwitchRole = userRole === 'superadmin';

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setShowRoleDropdown(false);
    addToast('info', 'Rol de Usuario Cambiado', `Ahora navegando como: ${roles.find(r => r.id === role)?.name}`);
  };

  const getPageTitle = (tab: string) => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Dashboard Ejecutivo', subtitle: 'Métricas de rendimiento de creadores, marcas y campañas' },
      creators: { title: 'Gestión de Creadores', subtitle: 'Directorio de talentos, perfiles y tarifas comerciales' },
      agencies: { title: 'Gestión de Agencias', subtitle: 'Cartera de agencias colaboradoras y creadores asociados' },
      brands: { title: 'Marcas y Clientes', subtitle: 'Empresas contratantes y relaciones comerciales activas' },
      campaigns: { title: 'Gestión de Campañas', subtitle: 'Planificación, entregables y desempeño publicitario' },
      collaborations: { title: 'Colaboraciones', subtitle: 'Conexión y acuerdos directos entre marcas y creadores' },
      calendar: { title: 'Calendario y Planificación', subtitle: 'Cronograma de publicaciones, reuniones y vencimientos' },
      analytics: { title: 'Analítica y Reportes', subtitle: 'Métricas de alcance, engagement, ROI y exportaciones' },
      pipeline: { title: 'CRM Comercial (Pipeline)', subtitle: 'Seguimiento y cierre de oportunidades comerciales' },
      contracts: { title: 'Contratos y Documentos', subtitle: 'Gestión legal de patrocinios, NDAs y acuerdos de agencia' },
      payments: { title: 'Presupuestos y Pagos', subtitle: 'Control financiero de facturación a marcas y pagos a talentos' },
      tasks: { title: 'Tareas y Proyectos', subtitle: 'Flujos de productividad del equipo y entregables clave' },
      messages: { title: 'Mensajes y Comunicaciones', subtitle: 'Centro de comunicación interna y notas de equipo' },
      files: { title: 'Archivos y Creativos', subtitle: 'Biblioteca de media kits, activos de marca y contratos' },
      notifications: { title: 'Centro de Notificaciones', subtitle: 'Alertas del sistema, aprobaciones y recordatorios' },
      settings: { title: 'Configuración de Plataforma', subtitle: 'Ajustes globales, monedas y conectores API' },
    };
    return titles[tab] || { title: 'VYRALEXX CRM', subtitle: 'Plataforma integral para creadores y marcas' };
  };

  const pageInfo = getPageTitle(activeTab);

  return (
    <header
      className={`fixed top-0 right-0 h-20 z-20 transition-all duration-300 border-b border-white/[0.06] bg-[#10101B]/95 backdrop-blur-xl flex items-center justify-between px-6 sm:px-8 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-[#A1A1B5] font-normal">{pageInfo.subtitle}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3.5">
        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#1B1929] hover:bg-[#252239] border border-white/[0.07] text-[#A1A1B5] hover:text-white transition-all shadow-sm"
        >
          <Search size={16} className="text-[#A855F7]" />
          <span className="text-xs pr-4 font-normal text-[#A1A1B5]">Buscar creador, campaña, cliente...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-[#A1A1B5] bg-[#252239] border border-white/[0.06] rounded">
            Ctrl K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2.5 rounded-xl bg-[#1B1929] hover:bg-[#252239] border border-white/[0.07] text-[#A1A1B5] hover:text-white transition-colors"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B3DFF] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-[#EC4899]/30">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-84 bg-[#1B1929] border border-white/[0.08] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-sm font-bold text-white">Notificaciones</span>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotifsAsRead}
                    className="text-xs text-[#EC4899] hover:underline"
                  >
                    Marcar todo leído
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotifAsRead(n.id);
                      if (n.link) {
                        const tab = n.link.replace('/', '');
                        setActiveTab(tab);
                      }
                      setShowNotifDropdown(false);
                    }}
                    className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                      n.read ? 'bg-[#252239]/50 text-[#A1A1B5]' : 'bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-[11px] text-[#A1A1B5] line-clamp-2 mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-[#A1A1B5]/60 mt-1 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-center mt-2">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifDropdown(false);
                  }}
                  className="text-xs text-[#A1A1B5] hover:text-white"
                >
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RBAC Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => canSwitchRole && setShowRoleDropdown(!showRoleDropdown)}
            disabled={!canSwitchRole}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[#1B1929] hover:bg-[#252239] border border-white/[0.07] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B3DFF] to-[#EC4899] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#8B3DFF]/25">
              <Shield size={16} />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                {currentRoleInfo.name}
              </div>
              <div className="text-[10px] text-[#A855F7]">Vista de Rol Activa</div>
            </div>
            <ChevronDown size={14} className="text-[#A1A1B5]" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-3 w-72 bg-[#1B1929] border border-white/[0.08] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <span className="text-xs font-bold text-white">Seleccionar Rol (RBAC)</span>
                <p className="text-[10px] text-[#A1A1B5]">Prueba la plataforma desde la perspectiva de cada perfil</p>
              </div>
              <div className="space-y-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                      userRole === r.id ? 'bg-[#252239] text-white border border-[#A855F7]/30' : 'hover:bg-[#252239]/60 text-[#A1A1B5]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {userRole === r.id ? (
                        <Check size={16} className="text-[#EC4899]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">
                        {r.name}
                      </div>
                      <p className="text-[10px] text-[#A1A1B5] truncate">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  api.logout();
                  window.location.reload();
                }}
                className="w-full mt-2 pt-3 border-t border-white/[0.06] px-3 py-2 text-left text-xs font-bold text-[#FB7185] hover:bg-[#FB7185]/10 rounded-xl"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
