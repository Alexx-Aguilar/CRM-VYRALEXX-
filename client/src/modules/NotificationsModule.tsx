import React from 'react';
import { Bell, CheckCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const NotificationsModule: React.FC = () => {
  const { notifications, markNotifAsRead, markAllNotifsAsRead, setActiveTab } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-white">Centro de Notificaciones</h3>
          <p className="text-xs text-[#A1A1B5]">Alertas de contratos, publicaciones y eventos del sistema</p>
        </div>

        <button
          onClick={markAllNotifsAsRead}
          className="px-4 py-2 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.07] text-white text-xs font-semibold flex items-center gap-2"
        >
          <CheckCheck size={16} className="text-[#EC4899]" /> Marcar Todas como Leídas
        </button>
      </div>

      <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] divide-y divide-white/[0.05] shadow-xl overflow-hidden">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => {
              markNotifAsRead(n.id);
              if (n.link) setActiveTab(n.link.replace('/', ''));
            }}
            className={`p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-[#252239]/50 ${
              n.read ? 'opacity-65' : 'bg-[#8B3DFF]/[0.05]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              n.type === 'alerta' ? 'bg-[#EC4899]/15 text-[#EC4899]' :
              n.type === 'exito' ? 'bg-[#22C55E]/15 text-[#22C55E]' :
              'bg-[#8B3DFF]/15 text-[#A855F7]'
            }`}>
              <Bell size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{n.title}</h4>
                <span className="text-[10px] text-[#A1A1B5]/60">
                  {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
