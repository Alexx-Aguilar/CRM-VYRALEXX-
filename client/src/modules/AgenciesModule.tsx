import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Edit2, Trash2, Globe, Mail, Phone,
  Users, Megaphone, ExternalLink, ShieldCheck, MapPin
} from 'lucide-react';
import { api } from '../services/api.js';
import { Agency } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const AgenciesModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Agency>>({
    name: '',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    description: '',
    country: 'México',
    email: '',
    phone: '',
    website: 'https://',
    managerName: '',
    representedCreatorsCount: 10,
    managedCampaignsCount: 15,
    status: 'Activa',
    notes: ''
  });

  const loadAgencies = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAgencies();
      setAgencies(data);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error al cargar agencias', 'No se pudo obtener la lista de agencias.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgencies();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setEditingAgency(null);
    setFormData({
      name: '',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      description: '',
      country: 'México',
      email: '',
      phone: '',
      website: 'https://',
      managerName: '',
      representedCreatorsCount: 0,
      managedCampaignsCount: 0,
      status: 'Activa',
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setFormData({ ...agency });
    setIsFormModalOpen(true);
  };

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await api.updateAgency(editingAgency.id, formData);
        addToast('success', 'Agencia Actualizada', `${formData.name} se actualizó con éxito.`);
      } else {
        await api.createAgency(formData);
        addToast('success', 'Agencia Creada', `${formData.name} fue registrada correctamente.`);
      }
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar agencia', error.message);
    }
  };

  const handleDeleteAgency = async () => {
    if (!agencyToDelete) return;
    try {
      await api.deleteAgency(agencyToDelete.id);
      addToast('success', 'Agencia Eliminada', `${agencyToDelete.name} fue eliminada del sistema.`);
      setAgencyToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredAgencies = agencies.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.managerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
          <input
            type="text"
            placeholder="Buscar por agencia, país o director..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Registrar Agencia
        </button>
      </div>

      {/* Agencies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgencies.map(agency => (
          <div
            key={agency.id}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#8B3DFF]/40 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white truncate">{agency.name}</h3>
                    <Badge status={agency.status} />
                  </div>
                  <p className="text-xs text-[#A855F7] flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin size={12} /> {agency.country}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                {agency.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#252239] border border-white/[0.06] text-center mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Talentos Representados</span>
                  <span className="text-sm font-black text-white">{agency.representedCreatorsCount}</span>
                </div>
                <div className="border-l border-white/[0.08]">
                  <span className="text-[10px] text-[#A1A1B5] block">Campañas Gestionadas</span>
                  <span className="text-sm font-black text-[#EC4899]">{agency.managedCampaignsCount}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-[#A1A1B5] py-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#A855F7]" />
                  <span>Responsable: <strong className="text-white">{agency.managerName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#EC4899]" />
                  <span className="truncate">{agency.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#22D3EE]" />
                  <a href={agency.website} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white hover:underline truncate">
                    {agency.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-[#A1A1B5]/60">
                Creada: {new Date(agency.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(agency)}
                  className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setAgencyToDelete(agency)}
                  className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT AGENCY MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingAgency ? 'Editar Agencia' : 'Registrar Nueva Agencia'}
        subtitle="Agrega agencias aliadas para gestión de creadores"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveAgency} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre Comercial *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. HyperNova Talent Agency"
            />
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Descripción y Especialidad</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Enfoque de mercado, nichos y alcance..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">País Sede *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Director o Responsable *</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Correo de Contacto *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Sitio Web</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Activa">Activa</option>
                <option value="En pausa">En pausa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#A1A1B5] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-primary-btn text-white font-bold"
            >
              {editingAgency ? 'Guardar Cambios' : 'Registrar Agencia'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={Boolean(agencyToDelete)}
        onClose={() => setAgencyToDelete(null)}
        onConfirm={handleDeleteAgency}
        title="Eliminar Agencia"
        message={`¿Deseas eliminar la agencia "${agencyToDelete?.name}"?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
