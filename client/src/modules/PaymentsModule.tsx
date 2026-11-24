import React, { useState, useEffect } from 'react';
import {
  DollarSign, Plus, Search, Filter, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownLeft, AlertCircle, Trash2, Edit2
} from 'lucide-react';
import { api } from '../services/api.js';
import { PaymentRecord, PaymentStatus, PaymentType } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const PaymentsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'Cobro' | 'Pago'>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PaymentRecord>>({
    concept: '',
    entityType: 'Marca',
    entityName: '',
    amount: 15000,
    type: 'Cobro',
    status: 'Pendiente',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    paymentMethod: 'Transferencia SWIFT',
    notes: ''
  });

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPayments();
      setPayments(data);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error en finanzas', 'No se pudieron recuperar los pagos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setFormData({
      concept: '',
      entityType: 'Marca',
      entityName: '',
      amount: 15000,
      type: 'Cobro',
      status: 'Pendiente',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Transferencia Bancaria',
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPayment(formData);
      addToast('success', 'Movimiento Registrado', 'La transacción fue creada exitosamente.');
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar', error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: PaymentStatus) => {
    const newStatus = currentStatus === 'Pagado' ? 'Pendiente' : 'Pagado';
    try {
      await api.updatePaymentStatus(id, newStatus);
      addToast('success', 'Estado Actualizado', `Marcado como: ${newStatus}`);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al actualizar', error.message);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    try {
      await api.deletePayment(paymentToDelete.id);
      addToast('success', 'Registro Eliminado', 'La transacción fue eliminada.');
      setPaymentToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const totalInvoiced = payments.filter(p => p.type === 'Cobro').reduce((sum, p) => sum + p.amount, 0);
  const totalCollected = payments.filter(p => p.type === 'Cobro' && p.status === 'Pagado').reduce((sum, p) => sum + p.amount, 0);
  const pendingCollection = payments.filter(p => p.type === 'Cobro' && p.status === 'Pendiente').reduce((sum, p) => sum + p.amount, 0);
  const totalPayouts = payments.filter(p => p.type === 'Pago' && p.status === 'Pagado').reduce((sum, p) => sum + p.amount, 0);
  const netMargin = totalCollected - totalPayouts;

  const filteredPayments = payments.filter(p => {
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg">
          <span className="text-[11px] text-[#A1A1B5]">Total Cobrado (Marcas)</span>
          <p className="text-xl font-black text-white mt-1">${totalCollected.toLocaleString()} USD</p>
          <span className="text-[10px] text-[#22C55E] font-semibold">Facturación liquidada</span>
        </div>
        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg">
          <span className="text-[11px] text-[#A1A1B5]">Por Cobrar (Pendiente)</span>
          <p className="text-xl font-black text-[#22D3EE] mt-1">${pendingCollection.toLocaleString()} USD</p>
          <span className="text-[10px] text-[#A1A1B5]">Facturas activas</span>
        </div>
        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg">
          <span className="text-[11px] text-[#A1A1B5]">Pagos a Creadores</span>
          <p className="text-xl font-black text-[#A855F7] mt-1">${totalPayouts.toLocaleString()} USD</p>
          <span className="text-[10px] text-[#A1A1B5]">Honorarios liquidados</span>
        </div>
        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg">
          <span className="text-[11px] text-[#A1A1B5]">Margen Neto Agencia</span>
          <p className="text-xl font-black text-[#22C55E] mt-1">${netMargin.toLocaleString()} USD</p>
          <span className="text-[10px] text-[#22C55E] font-semibold">Utilidad consolidada</span>
        </div>
      </div>

      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Flujos</option>
            <option value="Cobro">Cobros a Marcas (+)</option>
            <option value="Pago">Pagos a Creadores (-)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Estados</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Atrasado">Atrasado</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Registrar Factura / Pago
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4">Factura / Recibo</th>
                <th className="px-6 py-4">Concepto</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Tipo Flujo</th>
                <th className="px-6 py-4">Monto ($ USD)</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-[#252239]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white font-mono">{p.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{p.concept}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{p.entityName}</span>
                    <span className="text-[10px] text-[#A1A1B5] block">{p.entityType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 font-semibold ${p.type === 'Cobro' ? 'text-[#22C55E]' : 'text-[#EC4899]'}`}>
                      {p.type === 'Cobro' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      {p.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-white">
                    ${p.amount.toLocaleString()} USD
                  </td>
                  <td className="px-6 py-4 text-[#A1A1B5]">{p.dueDate}</td>
                  <td className="px-6 py-4">
                    <Badge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className="px-2.5 py-1 rounded-lg bg-[#252239] hover:bg-[#2E2B45] text-[11px] font-semibold text-[#A855F7] transition-colors"
                      >
                        {p.status === 'Pagado' ? 'Marcar Pendiente' : 'Marcar Pagado'}
                      </button>
                      <button
                        onClick={() => setPaymentToDelete(p)}
                        className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PAYMENT MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Registrar Movimiento Financiero"
        subtitle="Control de cobros a marcas o pagos a talentos"
        maxWidth="2xl"
      >
        <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Concepto *</label>
            <input
              type="text"
              required
              value={formData.concept}
              onChange={e => setFormData({ ...formData, concept: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. Anticipo 50% Campaña Verano"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Tipo de Movimiento</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Cobro">Cobro a Marca (+)</option>
                <option value="Pago">Pago a Creador (-)</option>
              </select>
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Monto ($ USD) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Entidad Contraparte *</label>
              <input
                type="text"
                required
                value={formData.entityName}
                onChange={e => setFormData({ ...formData, entityName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. CyberPulse Audio o Valeria Castro"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Método de Pago</label>
              <input
                type="text"
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha de Vencimiento *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
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
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Atrasado">Atrasado</option>
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
              Guardar Movimiento
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(paymentToDelete)}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleDeletePayment}
        title="Eliminar Registro de Pago"
        message="¿Estás seguro de eliminar este registro contable?"
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
