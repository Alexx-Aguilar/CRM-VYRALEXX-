import React, { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Search, Filter, Edit2, Trash2, Globe,
  Mail, Phone, DollarSign, Building, User, Eye
} from 'lucide-react';
import { api } from '../services/api.js';
import { Brand, BrandStatus } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const BrandsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80',
    industry: 'Tecnología',
    country: 'México',
    contactName: '',
    email: '',
    phone: '',
    website: 'https://',
    estimatedBudget: 50000,
    accountManager: 'Alejandro Morales',
    status: 'Prospecto',
    campaignsCount: 0,
    notes: ''
  });

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBrands();
      setBrands(data);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error al cargar clientes', 'No se pudieron recuperar las marcas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80',
      industry: 'Tecnología',
      country: 'México',
      contactName: '',
      email: '',
      phone: '',
      website: 'https://',
      estimatedBudget: 50000,
      accountManager: 'Alejandro Morales',
      status: 'Prospecto',
      campaignsCount: 0,
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ ...brand });
    setIsFormModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await api.updateBrand(editingBrand.id, formData);
        addToast('success', 'Cliente Actualizado', `${formData.name} se actualizó con éxito.`);
      } else {
        await api.createBrand(formData);
        addToast('success', 'Cliente Creado', `${formData.name} fue registrado en el CRM.`);
      }
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar', error.message);
    }
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    try {
      await api.deleteBrand(brandToDelete.id);
      addToast('success', 'Cliente Eliminado', `${brandToDelete.name} fue eliminado.`);
      setBrandToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredBrands = brands.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
            <input
              type="text"
              placeholder="Buscar por empresa, contacto o industria..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Estados</option>
            <option value="Prospecto">Prospecto</option>
            <option value="Contactado">Contactado</option>
            <option value="Negociación">Negociación</option>
            <option value="Cliente activo">Cliente activo</option>
            <option value="Cliente inactivo">Cliente inactivo</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Agregar Cliente / Marca
          </button>
        </div>
      </div>

      {/* Brands Table View */}
      <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4">Empresa / Marca</th>
                <th className="px-6 py-4">Industria</th>
                <th className="px-6 py-4">Contacto Principal</th>
                <th className="px-6 py-4">Presupuesto Estimado</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Estado CRM</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
              {filteredBrands.map(brand => (
                <tr key={brand.id} className="hover:bg-[#252239]/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                    <div>
                      <p className="font-bold text-white">{brand.name}</p>
                      <p className="text-[11px] text-[#A1A1B5]">{brand.country}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{brand.industry}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{brand.contactName}</p>
                    <p className="text-[10px] text-[#A1A1B5]">{brand.email}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-[#22C55E]">
                    ${brand.estimatedBudget.toLocaleString()} USD
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{brand.accountManager}</td>
                  <td className="px-6 py-4">
                    <Badge status={brand.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedBrand(brand);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#252239]"
                        title="Ver Ficha de Cliente"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(brand)}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239]"
                        title="Editar Marca"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setBrandToDelete(brand)}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
                        title="Eliminar Marca"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedBrand && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Ficha Comercial: ${selectedBrand.name}`}
          subtitle="Información corporativa, campañas y acuerdos"
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252239]/60 border border-white/[0.06]">
              <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-16 h-16 rounded-xl object-cover border border-[#8B3DFF]/30" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{selectedBrand.name}</h3>
                  <Badge status={selectedBrand.status} />
                </div>
                <p className="text-xs text-[#A1A1B5]">{selectedBrand.industry} • {selectedBrand.country}</p>
                <a href={selectedBrand.website} target="_blank" rel="noreferrer" className="text-[#A855F7] hover:underline text-[11px] mt-1 block">
                  {selectedBrand.website}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#252239] border border-white/[0.06]">
              <div>
                <span className="text-[#A1A1B5] block">Contacto Comercial:</span>
                <span className="font-bold text-white">{selectedBrand.contactName}</span>
                <span className="text-[#A1A1B5] block mt-0.5">{selectedBrand.email}</span>
                <span className="text-[#A1A1B5] block">{selectedBrand.phone}</span>
              </div>
              <div>
                <span className="text-[#A1A1B5] block">Presupuesto Anual Estimado:</span>
                <span className="text-lg font-black text-[#22C55E]">${selectedBrand.estimatedBudget.toLocaleString()} USD</span>
                <span className="text-[#A1A1B5] block mt-1">Líder de Cuenta: {selectedBrand.accountManager}</span>
              </div>
            </div>

            {selectedBrand.notes && (
              <div className="p-4 rounded-xl bg-[#8B3DFF]/10 border border-[#8B3DFF]/20">
                <span className="font-bold text-[#A855F7] block mb-1">Notas y Requisitos Especiales:</span>
                <p className="text-slate-300 leading-relaxed">{selectedBrand.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingBrand ? 'Editar Marca / Cliente' : 'Registrar Nuevo Cliente'}
        subtitle="Registra las empresas que contratan publicidad e influencers"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre de la Empresa *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. CyberPulse Audio"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Industria / Sector *</label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. Cosmética, Gaming, Bebidas..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Contacto Principal *</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Correo Electrónico *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Presupuesto Estimado ($ USD)</label>
              <input
                type="number"
                value={formData.estimatedBudget}
                onChange={e => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Estado en CRM</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Prospecto">Prospecto</option>
                <option value="Contactado">Contactado</option>
                <option value="Negociación">Negociación</option>
                <option value="Cliente activo">Cliente activo</option>
                <option value="Cliente inactivo">Cliente inactivo</option>
              </select>
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Responsable Comercial</label>
              <input
                type="text"
                value={formData.accountManager}
                onChange={e => setFormData({ ...formData, accountManager: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Notas Internas</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
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
              {editingBrand ? 'Guardar Cambios' : 'Registrar Marca'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(brandToDelete)}
        onClose={() => setBrandToDelete(null)}
        onConfirm={handleDeleteBrand}
        title="Eliminar Cliente"
        message={`¿Deseas eliminar la marca "${brandToDelete?.name}"? Sus contratos deberán reasignarse.`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
