import React, { useState, useEffect } from 'react';
import {
  FolderGit2, Plus, Search, Download, Trash2, FileText,
  FileArchive, Image, Sparkles
} from 'lucide-react';
import { api } from '../services/api.js';
import { MediaFile } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const FilesModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<MediaFile>>({
    name: '',
    category: 'Creativos',
    size: '12 MB',
    fileType: 'ZIP',
    url: '#',
    uploadedBy: 'Alejandro Morales',
    relatedCampaign: 'CyberPulse Titan Wireless'
  });

  const loadFiles = async () => {
    try {
      const data = await api.getFiles();
      setFiles(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const handleSaveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedFile) throw new Error('Selecciona un archivo para continuar');
      await api.uploadFile(selectedFile, formData.category || 'Creativos', formData.relatedCampaign);
      addToast('success', 'Archivo Registrado', `${formData.name} añadido a la biblioteca.`);
      setIsFormModalOpen(false);
      setSelectedFile(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar archivo', error.message);
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      await api.deleteFile(fileToDelete.id);
      addToast('success', 'Archivo Eliminado', 'El archivo ha sido borrado.');
      setFileToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const categories = ['Creativos', 'Media Kits', 'Contratos', 'Reportes', 'Facturas'];
  const filteredFiles = selectedCategory === 'all'
    ? files
    : files.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-xs text-[#A1A1B5] font-medium">{filteredFiles.length} Archivos disponibles</span>
        </div>

        <button
          onClick={() => setIsFormModalOpen(true)}
          className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Subir Archivo / Creativo
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFiles.map(file => (
          <div
            key={file.id}
            className="glass-card rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#8B3DFF]/15 border border-[#8B3DFF]/30 flex items-center justify-center text-[#A855F7] mb-4">
                {file.fileType === 'PDF' ? <FileText size={24} /> : <FileArchive size={24} />}
              </div>

              <h4 className="text-xs font-bold text-white line-clamp-1">{file.name}</h4>
              <p className="text-[10px] text-[#EC4899] font-bold mt-1">{file.category}</p>
              
              <div className="mt-3 text-[10px] text-[#A1A1B5] space-y-0.5">
                <p>Tamaño: {file.size}</p>
                <p>Subido por: {file.uploadedBy}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-4">
              <button
                onClick={async () => {
                  try {
                    await api.downloadFile(file.id, file.name);
                  } catch (error: any) {
                    addToast('error', 'Error de descarga', error.message);
                  }
                }}
                className="text-xs font-bold text-[#A855F7] hover:underline flex items-center gap-1"
              >
                <Download size={14} /> Descargar
              </button>
              <button
                onClick={() => setFileToDelete(file)}
                className="p-1 rounded text-[#A1A1B5] hover:text-[#EC4899]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REAL FILE UPLOAD MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Subir Archivo o Creativo"
        subtitle="Registra activos de campaña, media kits o acuerdos"
        maxWidth="md"
      >
        <form onSubmit={handleSaveFile} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Archivo *</label>
            <input
              type="file"
              required
              accept=".pdf,.zip,.rar,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov,.doc,.docx,.xls,.xlsx,.csv"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-2.5 rounded-xl glass-input text-xs"
            />
            <p className="text-[10px] text-[#A1A1B5] mt-1">Máximo 25 MB.</p>
          </div>
          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre del Archivo *</label>
            <input
              type="text"
              required
              value={selectedFile?.name || formData.name}
              readOnly={Boolean(selectedFile)}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Ej. MediaKit_Oficial_2026.pdf"
            />
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full p-2.5 rounded-xl glass-input"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Tamaño Estimado</label>
              <input
                type="text"
                value={formData.size}
                onChange={e => setFormData({ ...formData, size: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. 14 MB"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Formato</label>
              <input
                type="text"
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="PDF, ZIP, MP4..."
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
              Guardar Archivo
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={Boolean(fileToDelete)}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDeleteFile}
        title="Eliminar Archivo"
        message={`¿Estás seguro de eliminar el archivo "${fileToDelete?.name}"?`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
