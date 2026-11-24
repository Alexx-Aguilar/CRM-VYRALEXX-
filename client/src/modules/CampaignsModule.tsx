import React, { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Search, Filter, Edit2, Trash2, Eye,
  Calendar, DollarSign, Users, CheckCircle2, TrendingUp,
  Clock, Share2, Layers, AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { Campaign, Brand, Creator, CampaignStatus } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const CampaignsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    brandId: '',
    brandName: '',
    description: '',
    objectives: '',
    budget: 30000,
    spentBudget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    platforms: ['Instagram', 'TikTok'],
    creatorIds: [],
    managerName: 'Alejandro Morales',
    status: 'Planificación',
    deliverables: []
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [campaignsData, brandsData, creatorsData] = await Promise.all([
        api.getCampaigns(),
        api.getBrands(),
        api.getCreators()
      ]);
      setCampaigns(campaignsData);
      setBrands(brandsData);
      setCreators(creatorsData);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error al cargar campañas', 'No se pudo sincronizar la información.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      brandId: brands[0]?.id || '',
      brandName: brands[0]?.name || '',
      description: '',
      objectives: '',
      budget: 35000,
      spentBudget: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      platforms: ['Instagram', 'TikTok'],
      creatorIds: [],
      managerName: 'Alejandro Morales',
      status: 'Planificación',
      deliverables: []
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({ ...campaign });
    setIsFormModalOpen(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const b = brands.find(brand => brand.id === formData.brandId);
      const payload = {
        ...formData,
        brandName: b ? b.name : formData.brandName
      };

      if (editingCampaign) {
        await api.updateCampaign(editingCampaign.id, payload);
        addToast('success', 'Campaña Actualizada', `${payload.name} guardada correctamente.`);
      } else {
        await api.createCampaign(payload);
        addToast('success', 'Campaña Creada', `${payload.name} añadida al catálogo.`);
      }
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar campaña', error.message);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    try {
      await api.deleteCampaign(campaignToDelete.id);
      addToast('success', 'Campaña Eliminada', `${campaignToDelete.name} fue eliminada.`);
      setCampaignToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.brandName && c.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
          <input
            type="text"
            placeholder="Buscar por campaña, marca o descripción..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Estados</option>
            <option value="Borrador">Borrador</option>
            <option value="Planificación">Planificación</option>
            <option value="Pendiente de aprobación">Pendiente de aprobación</option>
            <option value="En ejecución">En ejecución</option>
            <option value="En revisión">En revisión</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Crear Campaña
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCampaigns.map(camp => {
          const spentPct = camp.budget > 0 ? Math.round((camp.spentBudget / camp.budget) * 100) : 0;
          return (
            <div
              key={camp.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                      {camp.brandName || 'Marca Cliente'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{camp.name}</h3>
                  </div>
                  <Badge status={camp.status} />
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {camp.description}
                </p>

                {/* Platforms */}
                <div className="flex items-center gap-1.5 mb-4">
                  {camp.platforms.map((p, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#252239] text-[#A1A1B5] border border-white/[0.05]">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Budget Progress Bar */}
                <div className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06] space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1B5]">Presupuesto Ejecutado</span>
                    <span className="font-bold text-white">${camp.spentBudget.toLocaleString()} / ${camp.budget.toLocaleString()} USD</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#10101B] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#EC4899] rounded-full"
                      style={{ width: `${Math.min(spentPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#A1A1B5]">
                    <span>{spentPct}% consumido</span>
                    <span>Restante: ${(camp.budget - camp.spentBudget).toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="flex items-center justify-between text-xs text-[#A1A1B5] py-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#A855F7]" /> {camp.startDate} al {camp.endDate}
                  </span>
                  <span>{camp.deliverables.length} Entregables</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCampaign(camp);
                    setIsDetailModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
                >
                  <Eye size={14} /> Ficha y Resultados
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(camp)}
                    className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setCampaignToDelete(camp)}
                    className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedCampaign && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedCampaign.name}
          subtitle={`Cliente: ${selectedCampaign.brandName} • Gestión por ${selectedCampaign.managerName}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#252239] border border-white/[0.06] text-center">
              <div>
                <span className="text-[10px] text-[#A1A1B5] block">Presupuesto Total</span>
                <span className="text-base font-black text-white">${selectedCampaign.budget.toLocaleString()} USD</span>
              </div>
              <div className="border-l border-white/[0.08]">
                <span className="text-[10px] text-[#A1A1B5] block">Ejecutado</span>
                <span className="text-base font-black text-[#EC4899]">${selectedCampaign.spentBudget.toLocaleString()} USD</span>
              </div>
              <div className="border-l border-white/[0.08]">
                <span className="text-[10px] text-[#A1A1B5] block">Estado Actual</span>
                <Badge status={selectedCampaign.status} />
              </div>
              <div className="border-l border-white/[0.08]">
                <span className="text-[10px] text-[#A1A1B5] block">ROI Final</span>
                <span className="text-base font-black text-[#22C55E]">{selectedCampaign.metrics.roi}x</span>
              </div>
            </div>

            {/* Objectives */}
            <div className="p-4 rounded-xl bg-[#252239] border border-white/[0.06] space-y-1">
              <span className="font-bold text-white block">Objetivos de Campaña:</span>
              <p className="text-slate-300 leading-relaxed">{selectedCampaign.objectives}</p>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="font-bold text-white mb-3">Rendimiento e Impacto</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-[#252239] border border-white/[0.06] text-center">
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Impresiones</span>
                  <span className="text-sm font-black text-white">{(selectedCampaign.metrics.impressions / 1000).toLocaleString()}K</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Alcance Único</span>
                  <span className="text-sm font-black text-[#A855F7]">{(selectedCampaign.metrics.reach / 1000).toLocaleString()}K</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Interacciones</span>
                  <span className="text-sm font-black text-[#EC4899]">{(selectedCampaign.metrics.engagements / 1000).toLocaleString()}K</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Clicks</span>
                  <span className="text-sm font-black text-[#22D3EE]">{selectedCampaign.metrics.clicks.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1B5] block">Conversiones</span>
                  <span className="text-sm font-black text-[#22C55E]">{selectedCampaign.metrics.conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <h4 className="font-bold text-white mb-3">Entregables de Campaña</h4>
              <div className="space-y-2">
                {selectedCampaign.deliverables.map((del, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#252239] border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className={del.status === 'Publicado' ? 'text-[#22C55E]' : 'text-[#A1A1B5]'} />
                      <div>
                        <p className="font-bold text-white">{del.type}</p>
                        <p className="text-[11px] text-[#A1A1B5]">Creador: {del.creatorName} • Fecha límite: {del.dueDate}</p>
                      </div>
                    </div>
                    <Badge status={del.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCampaign ? 'Editar Campaña' : 'Crear Nueva Campaña'}
        subtitle="Planifica presupuestos, marcas contratantes y fechas"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre de la Campaña *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. CyberPulse Titan — Lanzamiento"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Marca / Cliente *</label>
              <select
                required
                value={formData.brandId}
                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="">Selecciona una marca...</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Descripción</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Objetivos y Metas Clave (KPIs)</label>
            <textarea
              rows={2}
              value={formData.objectives}
              onChange={e => setFormData({ ...formData, objectives: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. 10M de impresiones, 25K clics..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Presupuesto ($ USD) *</label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha de Inicio *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha de Finalización *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Borrador">Borrador</option>
                <option value="Planificación">Planificación</option>
                <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                <option value="En ejecución">En ejecución</option>
                <option value="En revisión">En revisión</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Responsable</label>
              <input
                type="text"
                value={formData.managerName}
                onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
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
              {editingCampaign ? 'Guardar Cambios' : 'Crear Campaña'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(campaignToDelete)}
        onClose={() => setCampaignToDelete(null)}
        onConfirm={handleDeleteCampaign}
        title="Eliminar Campaña"
        message={`¿Estás seguro de eliminar la campaña "${campaignToDelete?.name}"?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
