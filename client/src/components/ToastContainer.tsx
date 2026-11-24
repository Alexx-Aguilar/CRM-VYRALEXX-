import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => {
        const icons = {
          success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
          error: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
          warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
          info: <Info size={18} className="text-cyan-400 shrink-0" />
        };

        const borderColors = {
          success: 'border-emerald-500/30 bg-[#0E1B26]/95',
          error: 'border-rose-500/30 bg-[#1F1018]/95',
          warning: 'border-amber-500/30 bg-[#1F1A0F]/95',
          info: 'border-cyan-500/30 bg-[#0F1C28]/95'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 ${borderColors[t.type]}`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white">{t.title}</h5>
              {t.message && <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
