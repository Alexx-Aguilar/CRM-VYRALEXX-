import React, { useState, useEffect } from 'react';
import {
  Settings, RotateCcw, Trash2, CheckCircle, Shield, Globe,
  DollarSign, Key, Zap, Check
} from 'lucide-react';
import { api } from '../services/api.js';
import { SystemSettings, UserRole, Creator, Brand } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const SettingsModule: React.FC = () => {
  const { addToast, userRole, setUserRole, triggerRefresh } = useApp();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newUser, setNewUser] = useState<{ name: string; email: string; password: string; role: UserRole; creatorId?: string; brandId?: string }>({ name: '', email: '', password: '', role: 'campaign_manager' });

  // Modals for demo data
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then(res => setSettings(res))
      .catch(console.error)
      .finally(() => setIsLoading(false));
    if (userRole === 'superadmin') {
      api.getUsers().then(setUsers).catch(console.error);
      api.getCreators().then(setCreators).catch(console.error);
      api.getBrands().then(setBrands).catch(console.error);
    }
  }, [userRole]);

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const created = await api.createUser(newUser);
      setUsers(previous => [created, ...previous]);
      setNewUser({ name: '', email: '', password: '', role: 'campaign_manager' });
      addToast('success', 'Usuario creado', 'El usuario ya puede iniciar sesión.');
    } catch (error: any) {
      addToast('error', 'No se pudo crear el usuario', error.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      addToast('success', 'Configuración Guardada', 'Preferencias actualizadas correctamente.');
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar', error.message);
    }
  };

  const handleResetDemoData = async () => {
    try {
      await api.resetDemoData();
      addToast('success', 'Datos Restablecidos', 'Se han restaurado los datos de demostración de VYRALEXX.');
      setIsResetConfirmOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error', error.message);
    }
  };

  const handleClearDemoData = async () => {
    try {
      await api.clearDemoData();
      addToast('warning', 'Base de Datos Limpia', 'Se han borrado los datos de prueba. La plataforma está vacía y lista.');
      setIsClearConfirmOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error', error.message);
    }
  };

  if (isLoading || !settings) {
    return <div className="text-center py-24 text-xs text-[#A1A1B5]">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      {/* General Settings */}
      <div className="bg-[#1B1929] rounded-2xl p-6 border border-white/[0.06] shadow-xl space-y-5">
        <div className="border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe size={18} className="text-[#EC4899]" /> Preferencias Generales de la Empresa
          </h3>
          <p className="text-xs text-[#A1A1B5] mt-0.5">Identidad corporativa y moneda para presupuestos y contratos</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Moneda del Sistema</label>
              <select
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="MXN ($)">MXN ($)</option>
                <option value="COP ($)">COP ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Zona Horaria</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Idioma Predeterminado</label>
              <input
                type="text"
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl gradient-primary-btn text-white font-bold"
          >
            Guardar Preferencias
          </button>
        </form>
      </div>

      {/* User Access Management */}
      {userRole === 'superadmin' && (
        <div className="bg-[#1B1929] rounded-2xl p-6 border border-white/[0.06] shadow-xl space-y-4">
          <div className="border-b border-white/[0.06] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2"><Shield size={18} className="text-[#22D3EE]" /> Usuarios y permisos</h3>
            <p className="text-xs text-[#A1A1B5] mt-0.5">Crea usuarios con roles reales para acceder al CRM.</p>
          </div>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="p-2.5 rounded-xl glass-input" placeholder="Nombre" />
            <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="p-2.5 rounded-xl glass-input" placeholder="Correo" />
            <input required minLength={8} type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="p-2.5 rounded-xl glass-input" placeholder="Contraseña" />
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })} className="p-2.5 rounded-xl glass-input">
              <option value="agency_admin">Admin de agencia</option>
              <option value="campaign_manager">Gestor de campañas</option>
              <option value="creator">Creador</option>
              <option value="brand">Marca</option>
            </select>
            {newUser.role === 'creator' && <select required value={newUser.creatorId || ''} onChange={e => setNewUser({ ...newUser, creatorId: e.target.value })} className="p-2.5 rounded-xl glass-input"><option value="">Selecciona creador</option>{creators.map(creator => <option key={creator.id} value={creator.id}>{creator.artisticName || creator.name}</option>)}</select>}
            {newUser.role === 'brand' && <select required value={newUser.brandId || ''} onChange={e => setNewUser({ ...newUser, brandId: e.target.value })} className="p-2.5 rounded-xl glass-input"><option value="">Selecciona marca</option>{brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select>}
            <button type="submit" className="sm:col-span-4 justify-self-start px-5 py-2.5 rounded-xl gradient-primary-btn text-white font-bold">Crear usuario</button>
          </form>
          <div className="space-y-2">
            {users.map(user => <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-[#252239] text-xs"><span className="text-white font-semibold">{user.name}<span className="text-[#A1A1B5] font-normal ml-2">{user.email}</span></span><span className="text-[#22D3EE]">{user.role}</span></div>)}
          </div>
        </div>
      )}

      {/* Social APIs Integration Status */}
      <div className="bg-[#1B1929] rounded-2xl p-6 border border-white/[0.06] shadow-xl space-y-4">
        <div className="border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap size={18} className="text-[#A855F7]" /> Conectores de Redes Sociales & APIs
          </h3>
          <p className="text-xs text-[#A1A1B5] mt-0.5">Sincronización de métricas de creadores en vivo</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06] flex items-center justify-between">
            <span className="font-semibold text-white">Instagram Graph API</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${settings.apiIntegrations.instagram ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-slate-500/20 text-[#A1A1B5]'}`}>{settings.apiIntegrations.instagram ? 'Conectado' : 'No configurado'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06] flex items-center justify-between">
            <span className="font-semibold text-white">TikTok Creator Marketplace API</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${settings.apiIntegrations.tiktok ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-slate-500/20 text-[#A1A1B5]'}`}>{settings.apiIntegrations.tiktok ? 'Conectado' : 'No configurado'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06] flex items-center justify-between">
            <span className="font-semibold text-white">YouTube Data API v3</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${settings.apiIntegrations.youtube ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-slate-500/20 text-[#A1A1B5]'}`}>{settings.apiIntegrations.youtube ? 'Conectado' : 'No configurado'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06] flex items-center justify-between">
            <span className="font-semibold text-white">Meta Marketing Ads API</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-[#A1A1B5] text-[10px]">Opcional</span>
          </div>
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="bg-[#1B1929] rounded-2xl p-6 border border-[#EC4899]/20 shadow-xl space-y-4">
        <div className="border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RotateCcw size={18} className="text-[#EC4899]" /> Gestión de Datos de Demostración
          </h3>
          <p className="text-xs text-[#A1A1B5] mt-0.5">
            Opciones para restablecer o limpiar la información de prueba de la presentación
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex-1 p-4 rounded-xl bg-[#8B3DFF]/10 hover:bg-[#8B3DFF]/20 border border-[#8B3DFF]/30 text-left transition-colors"
          >
            <h5 className="font-bold text-[#A855F7] text-xs flex items-center gap-2">
              <RotateCcw size={16} /> Restablecer Datos de Demostración
            </h5>
            <p className="text-[11px] text-[#A1A1B5] mt-1">
              Restaura creadores, campañas, presupuestos y reportes de muestra para presentaciones.
            </p>
          </button>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex-1 p-4 rounded-xl bg-[#EC4899]/10 hover:bg-[#EC4899]/20 border border-[#EC4899]/30 text-left transition-colors"
          >
            <h5 className="font-bold text-[#EC4899] text-xs flex items-center gap-2">
              <Trash2 size={16} /> Limpiar Base de Datos (Comenzar en Blanco)
            </h5>
            <p className="text-[11px] text-[#A1A1B5] mt-1">
              Elimina todos los datos de muestra para empezar a registrar información real.
            </p>
          </button>
        </div>
      </div>

      {/* CONFIRM RESET MODAL */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetDemoData}
        title="Restablecer Datos de Demostración"
        message="¿Deseas restaurar todos los creadores, agencias, marcas y campañas de demostración predeterminados?"
        confirmText="Sí, Restablecer"
        type="info"
      />

      {/* CONFIRM CLEAR MODAL */}
      <ConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearDemoData}
        title="Limpiar Todos los Datos"
        message="¿Estás seguro de vaciar la base de datos? Esto removerá todos los registros de demostración para iniciar desde cero."
        confirmText="Sí, Vaciar Base de Datos"
        type="danger"
      />
    </div>
  );
};
