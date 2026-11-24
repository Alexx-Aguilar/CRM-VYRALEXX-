import React, { useState, useEffect } from 'react';
import {
  Handshake, Plus, Search, Filter, CheckCircle, Clock,
  DollarSign, ExternalLink, Trash2, Edit2, ArrowRight
} from 'lucide-react';
import { api } from '../services/api.js';
import { Collaboration, CollaborationStatus, Brand, Creator, Campaign } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const CollaborationsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [collabToDelete, setCollabToDelete] = useState<Collaboration | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Collaboration>>({
    brandId: '',
    creatorId: '',
    campaignId: '',
    proposalDetails: '',
    agreedFee: 5000,
    deliverablesText: '1x Reel + 2x Stories',
    publicationDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'Nueva propuesta',
    notes: '',
    linkReview: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [collabsData, brandsData, creatorsData, campaignsData] = await Promise.all([
        api.getCollaborations(),
        api.getBrands(),
        api.getCreators(),
        api.getCampaigns()
      ]);
      setCollabs(collabsData);
      setBrands(brandsData);
      setCreators(creatorsData);
      setCampaigns(campaignsData);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error al cargar colaboraciones', 'Error de red.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setFormData({
      brandId: brands[0]?.id || '',
      creatorId: creators[0]?.id || '',
      campaignId: campaigns[0]?.id || '',
      proposalDetails: '',
      agreedFee: 5000,
      deliverablesText: '1x Reel + 2x Stories',
      publicationDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'Nueva propuesta',
      notes: '',
      linkReview: ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const b = brands.find(brand => brand.id === formData.brandId);
      const cr = creators.find(creator => creator.id === formData.creatorId);
      const cp = campaigns.find(c => c.id === formData.campaignId);

      const payload = {
        ...formData,
        brandName: b ? b.name : 'Marca VYRALEXX',
        creatorName: cr ? cr.name : 'Creador VYRALEXX',
        creatorArtisticName: cr ? cr.artisticName : 'Creador Artístico',
        creatorAvatar: cr ? cr.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        campaignName: cp ? cp.name : 'Campaña General'
      };

      await api.createCollaboration(payload);
      addToast('success', 'Colaboración Registrada', 'La propuesta fue añadida al flujo activo.');
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar colaboración', error.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateCollaborationStatus(id, newStatus);
      addToast('info', 'Estado Actualizado', `La colaboración avanzó a: ${newStatus}`);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al cambiar estado', error.message);
    }
  };

  const handleDeleteCollab = async () => {
    if (!collabToDelete) return;
    try {
      await api.deleteCollaboration(collabToDelete.id);
      addToast('success', 'Colaboración Eliminada', 'El registro fue retirado.');
      setCollabToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredCollabs = collabs.filter(c => {
    const matchesSearch =
      c.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creatorArtisticName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: CollaborationStatus[] = [
    'Nueva propuesta',
    'En negociación',
    'Aprobada',
    'En producción',
    'Publicada',
    'Completada',
    'Rechazada'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
          <input
            type="text"
            placeholder="Buscar por marca, creador o campaña..."
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
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Nueva Colaboración
          </button>
        </div>
      </div>

      {/* Collaborations Cards */}
      <div className="space-y-3.5">
        {filteredCollabs.map(collab => (
          <div
            key={collab.id}
            className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Match Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={collab.creatorAvatar}
                alt={collab.creatorArtisticName}
                className="w-14 h-14 rounded-2xl object-cover border border-[#8B3DFF]/40 shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{collab.creatorArtisticName}</span>
                  <span className="text-[#A1A1B5] text-xs">x</span>
                  <span className="font-bold text-[#EC4899] text-sm">{collab.brandName}</span>
                </div>
                <p className="text-xs text-[#A1A1B5] truncate mt-0.5">{collab.campaignName}</p>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                  <strong>Entregables:</strong> {collab.deliverablesText}
                </p>
              </div>
            </div>

            {/* Fee & Dates */}
            <div className="flex items-center gap-6 text-xs text-slate-300 shrink-0">
              <div>
                <span className="text-[10px] text-[#A1A1B5] block">Tarifa Acordada</span>
                <span className="text-sm font-black text-[#22C55E]">${collab.agreedFee.toLocaleString()} USD</span>
              </div>
              <div className="border-l border-white/[0.08] pl-6">
                <span className="text-[10px] text-[#A1A1B5] block">Publicación</span>
                <span className="font-semibold text-white">{collab.publicationDate}</span>
              </div>
            </div>

            {/* Status & Flow Changer */}
            <div className="flex items-center gap-3 shrink-0">
              <Badge status={collab.status} />

              <select
                value={collab.status}
                onChange={e => handleStatusChange(collab.id, e.target.value)}
                className="px-2.5 py-1.5 rounded-lg glass-input text-xs bg-[#252239]"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => setCollabToDelete(collab)}
                className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-colors"
                title="Eliminar Colaboración"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Registrar Propuesta de Colaboración"
        subtitle="Conecta una marca con un creador bajo una campaña específica"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveCollab} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Marca Contratante *</label>
              <select
                required
                value={formData.brandId}
                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="">Selecciona marca...</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Creador / Talento *</label>
              <select
                required
                value={formData.creatorId}
                onChange={e => setFormData({ ...formData, creatorId: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="">Selecciona creador...</option>
                {creators.map(c => (
                  <option key={c.id} value={c.id}>{c.artisticName} ({c.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Campaña Vinculada *</label>
            <select
              required
              value={formData.campaignId}
              onChange={e => setFormData({ ...formData, campaignId: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
            >
              <option value="">Selecciona campaña...</option>
              {campaigns.map(cp => (
                <option key={cp.id} value={cp.id}>{cp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Detalles de la Propuesta</label>
            <textarea
              rows={2}
              value={formData.proposalDetails}
              onChange={e => setFormData({ ...formData, proposalDetails: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Enfoque de contenido, concepto creativo..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Tarifa Acordada ($ USD) *</label>
              <input
                type="number"
                required
                value={formData.agreedFee}
                onChange={e => setFormData({ ...formData, agreedFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha Programada de Publicación *</label>
              <input
                type="date"
                required
                value={formData.publicationDate}
                onChange={e => setFormData({ ...formData, publicationDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Especificación de Entregables</label>
            <input
              type="text"
              required
              value={formData.deliverablesText}
              onChange={e => setFormData({ ...formData, deliverablesText: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. 1x YouTube Video Integración + 2x Reels con hashtag"
            />
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
              Crear Propuesta
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(collabToDelete)}
        onClose={() => setCollabToDelete(null)}
        onConfirm={handleDeleteCollab}
        title="Eliminar Colaboración"
        message="¿Estás seguro de cancelar y eliminar este registro de colaboración?"
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
