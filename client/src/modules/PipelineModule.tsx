import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Plus, DollarSign, Calendar, User, ArrowRight,
  MoreVertical, Trash2, Edit2, ShieldAlert
} from 'lucide-react';
import { api } from '../services/api.js';
import { PipelineDeal, PipelineStage, Brand } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const PipelineModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<PipelineDeal | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PipelineDeal>>({
    title: '',
    brandId: '',
    brandName: '',
    contactName: '',
    contactEmail: '',
    dealValue: 50000,
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    stage: 'nuevo_prospecto',
    owner: 'Alejandro Morales',
    source: 'Inbound comercial',
    notes: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dealsData, brandsData] = await Promise.all([
        api.getPipelineDeals(),
        api.getBrands()
      ]);
      setDeals(dealsData);
      setBrands(brandsData);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error en Pipeline', 'No se pudieron recuperar las oportunidades.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const stages: { id: PipelineStage; label: string; color: string }[] = [
    { id: 'nuevo_prospecto', label: 'Nuevo Prospecto', color: 'border-t-[#8B3DFF]' },
    { id: 'primer_contacto', label: 'Primer Contacto', color: 'border-t-[#A855F7]' },
    { id: 'reunion_programada', label: 'Reunión Programada', color: 'border-t-[#4263EB]' },
    { id: 'propuesta_enviada', label: 'Propuesta Enviada', color: 'border-t-[#22D3EE]' },
    { id: 'negociacion', label: 'Negociación', color: 'border-t-[#F59E0B]' },
    { id: 'ganado', label: 'Ganado', color: 'border-t-[#22C55E]' },
    { id: 'perdido', label: 'Perdido', color: 'border-t-[#EC4899]' },
  ];

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      brandId: brands[0]?.id || '',
      brandName: brands[0]?.name || '',
      contactName: '',
      contactEmail: '',
      dealValue: 50000,
      probability: 50,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      stage: 'nuevo_prospecto',
      owner: 'Alejandro Morales',
      source: 'Inbound comercial',
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const b = brands.find(brand => brand.id === formData.brandId);
      const payload = {
        ...formData,
        brandName: b ? b.name : formData.brandName
      };

      await api.createDeal(payload);
      addToast('success', 'Oportunidad Creada', `${payload.title} añadida al pipeline.`);
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al crear deal', error.message);
    }
  };

  const handleStageMove = async (id: string, newStage: PipelineStage) => {
    try {
      await api.updateDealStage(id, newStage);
      addToast('info', 'Deal Avanzado', `Oportunidad movida de etapa.`);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al mover deal', error.message);
    }
  };

  const handleDeleteDeal = async () => {
    if (!dealToDelete) return;
    try {
      await api.deleteDeal(dealToDelete.id);
      addToast('success', 'Deal Eliminado', 'Oportunidad eliminada del pipeline.');
      setDealToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'perdido')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const weightedValue = deals
    .filter(d => d.stage !== 'perdido')
    .reduce((sum, d) => sum + (d.dealValue * (d.probability / 100)), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Banner with Pipeline Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[11px] text-[#A1A1B5] block">Valor Total Pipeline</span>
            <span className="text-xl font-black text-white">${totalPipelineValue.toLocaleString()} USD</span>
          </div>
          <div className="border-l border-white/[0.08] pl-6">
            <span className="text-[11px] text-[#A1A1B5] block">Valor Ponderado</span>
            <span className="text-xl font-black text-[#A855F7]">${Math.round(weightedValue).toLocaleString()} USD</span>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Nueva Oportunidad
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {stages.map(st => {
          const stageDeals = deals.filter(d => d.stage === st.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

          return (
            <div
              key={st.id}
              className={`flex flex-col rounded-2xl bg-[#1B1929] border border-white/[0.06] p-3 min-w-[200px] border-t-4 ${st.color} shadow-lg`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-white truncate">{st.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#252239] text-[#A1A1B5] font-bold">
                  {stageDeals.length}
                </span>
              </div>

              <div className="text-[10px] text-[#A1A1B5] mb-3 font-medium">
                ${stageTotal.toLocaleString()} USD
              </div>

              {/* Deal Cards */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px]">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="p-3 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.05] transition-all text-xs group shadow-sm"
                  >
                    <h5 className="font-bold text-white text-xs line-clamp-1">{deal.title}</h5>
                    <p className="text-[11px] text-[#A855F7] font-medium truncate mt-0.5">{deal.brandName}</p>
                    
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#22C55E] mt-2">
                      <span>${deal.dealValue.toLocaleString()} USD</span>
                      <span className="text-[#A1A1B5] font-normal">{deal.probability}%</span>
                    </div>

                    <div className="text-[10px] text-[#A1A1B5]/70 mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <span>{deal.owner}</span>
                      <button
                        onClick={() => setDealToDelete(deal)}
                        className="opacity-0 group-hover:opacity-100 hover:text-[#EC4899]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Move selector */}
                    <div className="mt-2 pt-1">
                      <select
                        value={deal.stage}
                        onChange={e => handleStageMove(deal.id, e.target.value as PipelineStage)}
                        className="w-full text-[9px] px-1.5 py-1 rounded bg-[#10101B] text-[#A1A1B5] border border-white/[0.06]"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.id}>Mover a: {s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE DEAL MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Crear Nueva Oportunidad Comercial"
        subtitle="Agrega un prospecto al embudo comercial de VYRALEXX"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveDeal} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Título de la Oportunidad *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. Campaña Anual CyberPulse"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Marca / Empresa *</label>
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
              <label className="text-[#A1A1B5] font-semibold block mb-1">Valor Estimado ($ USD) *</label>
              <input
                type="number"
                required
                value={formData.dealValue}
                onChange={e => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Contacto Principal</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Probabilidad de Cierre (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })}
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
              Guardar Deal
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(dealToDelete)}
        onClose={() => setDealToDelete(null)}
        onConfirm={handleDeleteDeal}
        title="Eliminar Oportunidad"
        message={`¿Estás seguro de eliminar el deal "${dealToDelete?.title}" del CRM?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
