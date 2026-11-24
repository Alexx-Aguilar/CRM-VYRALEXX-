import React from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { Modal } from './Modal.js';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
          type === 'danger' ? 'bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30' :
          type === 'warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
          'bg-[#8B3DFF]/15 text-[#A855F7] border border-[#8B3DFF]/30'
        }`}>
          {type === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </div>

        <p className="text-xs text-[#A1A1B5] leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors text-xs font-semibold"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 ${
              type === 'danger' 
                ? 'bg-[#EC4899] hover:bg-[#db2777] shadow-lg shadow-[#EC4899]/30' 
                : 'gradient-primary-btn'
            }`}
          >
            {isLoading && <RefreshCw size={15} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
