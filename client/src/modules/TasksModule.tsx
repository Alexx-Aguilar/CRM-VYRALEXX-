import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Plus, Search, Filter, LayoutGrid, List,
  Calendar, User, Trash2, Edit2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';
import { Task, TaskStatus, TaskPriority, Campaign } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const TasksModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: 'Alejandro Morales',
    priority: 'Media',
    status: 'por_hacer',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    campaignId: ''
  });

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const [tasksData, campaignsData] = await Promise.all([
        api.getTasks(),
        api.getCampaigns()
      ]);
      setTasks(tasksData);
      setCampaigns(campaignsData);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error en tareas', 'No se pudieron recuperar las tareas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      assignee: 'Alejandro Morales',
      priority: 'Media',
      status: 'por_hacer',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      campaignId: campaigns[0]?.id || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const c = campaigns.find(cp => cp.id === formData.campaignId);
      const payload = {
        ...formData,
        campaignName: c ? c.name : undefined
      };

      await api.createTask(payload);
      addToast('success', 'Tarea Creada', `${payload.title} añadida.`);
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar tarea', error.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      await api.updateTaskStatus(id, newStatus);
      addToast('info', 'Estado de Tarea', `Actualizado a: ${newStatus}`);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al actualizar', error.message);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.deleteTask(taskToDelete.id);
      addToast('success', 'Tarea Eliminada', 'La tarea fue eliminada.');
      setTaskToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'por_hacer', label: 'Por Hacer', color: 'border-t-[#8B3DFF]' },
    { id: 'en_progreso', label: 'En Progreso', color: 'border-t-[#A855F7]' },
    { id: 'en_revision', label: 'En Revisión', color: 'border-t-[#F59E0B]' },
    { id: 'completada', label: 'Completada', color: 'border-t-[#22C55E]' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-[#252239] border border-white/[0.06]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-[#8B3DFF]/30 text-[#EC4899]' : 'text-[#A1A1B5] hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#8B3DFF]/30 text-[#EC4899]' : 'text-[#A1A1B5] hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>
          <span className="text-xs text-[#A1A1B5] font-medium">{tasks.length} Tareas registradas</span>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Nueva Tarea
        </button>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-2xl bg-[#1B1929] border border-white/[0.06] p-4 border-t-4 ${col.color} shadow-lg`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-white">{col.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#252239] text-[#A1A1B5] font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.05] transition-colors text-xs group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'Alta' ? 'bg-[#EC4899]/20 text-[#EC4899]' :
                          task.priority === 'Media' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-[#A855F7]/20 text-[#A855F7]'
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="opacity-0 group-hover:opacity-100 text-[#A1A1B5] hover:text-[#EC4899]"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <h5 className="font-bold text-white leading-snug">{task.title}</h5>
                      <p className="text-[11px] text-[#A1A1B5] line-clamp-2 mt-1">{task.description}</p>

                      <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#A1A1B5]">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#A855F7]" /> {task.assignee}
                        </span>
                        <span>Vence: {task.dueDate}</span>
                      </div>

                      {/* State advance shortcut */}
                      <div className="mt-2 pt-2 border-t border-white/[0.06]">
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="w-full text-[10px] px-2 py-1 rounded bg-[#10101B] text-[#A1A1B5] border border-white/[0.06]"
                        >
                          {columns.map(c => (
                            <option key={c.id} value={c.id}>Mover a: {c.label}</option>
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
      ) : (
        /* List View */
        <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
          <div className="divide-y divide-white/[0.05]">
            {tasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-[#252239]/50 flex items-center justify-between gap-4 text-xs transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    onClick={() => handleStatusChange(task.id, task.status === 'completada' ? 'por_hacer' : 'completada')}
                    className={`cursor-pointer ${task.status === 'completada' ? 'text-[#22C55E]' : 'text-slate-600'}`}
                  />
                  <div>
                    <h5 className={`font-bold text-white ${task.status === 'completada' ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h5>
                    <p className="text-[11px] text-[#A1A1B5]">{task.assignee} • Vence: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={task.status} />
                  <button onClick={() => setTaskToDelete(task)} className="text-[#A1A1B5] hover:text-[#EC4899]">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Crear Nueva Tarea"
        subtitle="Asigna responsables, prioridades y fechas límite"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Título de la Tarea *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. Revisar video de YouTube antes de publicar"
            />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Responsable *</label>
              <input
                type="text"
                required
                value={formData.assignee}
                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Prioridad</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Fecha Límite</label>
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
                <option value="por_hacer">Por Hacer</option>
                <option value="en_progreso">En Progreso</option>
                <option value="en_revision">En Revisión</option>
                <option value="completada">Completada</option>
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
              Crear Tarea
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Eliminar Tarea"
        message={`¿Estás seguro de eliminar la tarea "${taskToDelete?.title}"?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
