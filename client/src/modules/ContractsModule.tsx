import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Filter, Download, Trash2, Edit2,
  Calendar, DollarSign, AlertTriangle, CheckCircle, Shield
} from 'lucide-react';
import { api } from '../services/api.js';
import { Contract, ContractStatus } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const ContractsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Contract>>({
    title: '',
    contractType: 'Patrocinio de marca',
    partyType: 'Marca',
    partyId: 'br-1',
    partyName: '',
    status: 'Borrador',
    value: 25000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    fileName: 'Contrato_Acuerdo_2026.pdf',
    fileSize: '1.5 MB',
    notes: ''
  });

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getContracts();
      setContracts(data);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error en contratos', 'No se pudieron recuperar los documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      contractType: 'Patrocinio de marca',
      partyType: 'Marca',
      partyId: 'br-1',
      partyName: '',
      status: 'Firmado',
      value: 30000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      fileName: 'Contrato_VYRALEXX_Firmado.pdf',
      fileSize: '2.1 MB',
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createContract(formData);
      addToast('success', 'Contrato Registrado', `${formData.title} guardado con éxito.`);
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar contrato', error.message);
    }
  };

  const handleDeleteContract = async () => {
    if (!contractToDelete) return;
    try {
      await api.deleteContract(contractToDelete.id);
      addToast('success', 'Contrato Eliminado', 'El contrato fue eliminado.');
      setContractToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredContracts = contracts.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Alert Banner for Expiring Contracts */}
      <div className="p-4 rounded-2xl bg-[#EC4899]/10 border border-[#EC4899]/25 flex items-center gap-3">
        <AlertTriangle size={20} className="text-[#EC4899] shrink-0" />
        <div className="flex-1 text-xs">
          <p className="font-bold text-white">Recordatorio de Renovaciones Legales</p>
          <p className="text-slate-300">Tienes 1 contrato de representación de creador por vencer en los próximos 30 días.</p>
        </div>
      </div>

      {/* Top Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
          <input
            type="text"
            placeholder="Buscar por contrato, contraparte o tipo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Registrar Contrato
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4">Documento / Contrato</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Contraparte</th>
                <th className="px-6 py-4">Valor Acordado</th>
                <th className="px-6 py-4">Vigencia</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
              {filteredContracts.map(c => (
                <tr key={c.id} className="hover:bg-[#252239]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{c.title}</p>
                    <p className="text-[10px] text-[#A1A1B5]">{c.fileName} ({c.fileSize})</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{c.contractType}</td>
                  <td className="px-6 py-4 text-[#A855F7] font-semibold">{c.partyName}</td>
                  <td className="px-6 py-4 font-black text-[#22C55E]">
                    {c.value > 0 ? `$${c.value.toLocaleString()} USD` : 'N/A (NDA)'}
                  </td>
                  <td className="px-6 py-4 text-[#A1A1B5]">
                    {c.startDate} al {c.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => addToast('info', 'Descargando Contrato', `Iniciando descarga de ${c.fileName}`)}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#252239]"
                        title="Descargar Archivo PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => setContractToDelete(c)}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
                        title="Eliminar Contrato"
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

      {/* CREATE MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Registrar Nuevo Contrato Legal"
        subtitle="Almacena acuerdos de patrocinio, NDAs y representación"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveContract} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Título del Contrato *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. Acuerdo Patrocinio CyberPulse 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Tipo de Documento</label>
              <select
                value={formData.contractType}
                onChange={e => setFormData({ ...formData, contractType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Patrocinio de marca">Patrocinio de marca</option>
                <option value="Representación de creador">Representación de creador</option>
                <option value="Acuerdo de confidencialidad (NDA)">Acuerdo de confidencialidad (NDA)</option>
                <option value="Servicios de agencia">Servicios de agencia</option>
              </select>
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre de la Contraparte *</label>
              <input
                type="text"
                required
                value={formData.partyName}
                onChange={e => setFormData({ ...formData, partyName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. CyberPulse Audio & Wearables"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Valor Contrato ($ USD)</label>
              <input
                type="number"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha de Inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha de Vencimiento</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
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
              Registrar Contrato
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(contractToDelete)}
        onClose={() => setContractToDelete(null)}
        onConfirm={handleDeleteContract}
        title="Eliminar Contrato"
        message={`¿Estás seguro de eliminar "${contractToDelete?.title}"?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
