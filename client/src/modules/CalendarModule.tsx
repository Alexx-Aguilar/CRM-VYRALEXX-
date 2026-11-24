import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Clock, MapPin, Tag, Trash2, Edit2, AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { CalendarEvent, EventType } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const CalendarModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date('2026-03-01'));
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    eventType: 'entrega_contenido',
    startDate: '2026-03-25T15:00:00Z',
    endDate: '2026-03-25T16:00:00Z',
    allDay: false,
    color: '#EC4899'
  });

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error en calendario', 'No se pudieron sincronizar los eventos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'entrega_contenido',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      allDay: false,
      color: '#EC4899'
    });
    setIsFormModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(formData);
      addToast('success', 'Evento Creado', `${formData.title} añadido al cronograma.`);
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar', error.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      addToast('success', 'Evento Eliminado', 'El evento fue removido del calendario.');
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const eventTypeColors: Record<EventType, string> = {
    campaña: 'bg-[#8B3DFF]/20 text-[#A855F7] border-[#8B3DFF]/40',
    entrega_contenido: 'bg-[#EC4899]/20 text-[#EC4899] border-[#EC4899]/40',
    reunión: 'bg-[#4263EB]/20 text-[#4263EB] border-[#4263EB]/40',
    vencimiento_contrato: 'bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/40',
    fecha_pago: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40',
    tarea: 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40',
  };

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(e => e.eventType === selectedType);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#252239] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-sm font-bold text-white px-3">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Tipos de Evento</option>
            <option value="campaña">Campañas</option>
            <option value="entrega_contenido">Entregas de Contenido</option>
            <option value="reunión">Reuniones</option>
            <option value="fecha_pago">Fechas de Pago</option>
            <option value="vencimiento_contrato">Vencimientos Contrato</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Programar Evento
          </button>
        </div>
      </div>

      {/* Month Calendar Grid */}
      <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
        {/* Days of week */}
        <div className="grid grid-cols-7 bg-[#252239] border-b border-white/[0.06] text-center py-3 text-xs font-bold text-[#A1A1B5]">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/[0.05]">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-28 p-2 bg-[#10101B]/40" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = filteredEvents.filter(e => e.startDate.startsWith(dateStr));

            return (
              <div key={dayNum} className="min-h-28 p-2 hover:bg-[#252239]/40 transition-colors relative flex flex-col justify-between">
                <span className="text-xs font-bold text-[#A1A1B5] self-end">
                  {dayNum}
                </span>

                <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-24">
                  {dayEvents.map(ev => (
                    <div
                      key={ev.id}
                      className={`text-[10px] p-1.5 rounded-lg border font-semibold truncate group flex items-center justify-between shadow-sm ${eventTypeColors[ev.eventType]}`}
                      title={ev.title}
                    >
                      <span className="truncate">{ev.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(ev.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Programar Nuevo Evento"
        subtitle="Registra fechas de entrega, pagos, contratos o reuniones"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Título del Evento *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. Publicación Reel CyberPulse"
            />
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Tipo de Evento</label>
            <select
              value={formData.eventType}
              onChange={e => setFormData({ ...formData, eventType: e.target.value as any })}
              className="w-full p-2.5 rounded-xl glass-input"
            >
              <option value="entrega_contenido">Entrega de Contenido</option>
              <option value="campaña">Campaña Activa</option>
              <option value="reunión">Reunión con Cliente / Creador</option>
              <option value="fecha_pago">Fecha de Pago Programada</option>
              <option value="vencimiento_contrato">Vencimiento de Contrato</option>
              <option value="tarea">Tarea de Equipo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha y Hora Inicio *</label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha y Hora Fin</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Descripción</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Observaciones y notas..."
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
              Guardar Evento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
