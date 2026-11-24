import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Paperclip, Users, Clock, ShieldCheck,
  Search, Hash
} from 'lucide-react';
import { api } from '../services/api.js';
import { ChatMessage } from '../types/index.js';
import { useApp } from '../context/AppContext.js';

export const MessagesModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const channels = [
    { id: 'general', name: 'general-agencia', desc: 'Comunicaciones y anuncios de equipo' },
    { id: 'campana-cyberpulse', name: 'campaña-cyberpulse', desc: 'Coordinación de entregables' },
    { id: 'nuevos-talentos', name: 'nuevos-talentos', desc: 'Scouting y propuestas' },
    { id: 'legal-contratos', name: 'legal-contratos', desc: 'Dudas sobre NDAs y términos' },
  ];

  const loadMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [refreshTrigger]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.sendMessage({
        channelId: activeChannel,
        senderName: 'Alejandro Morales',
        senderRole: 'Superadministrador',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        message: newMessage,
        isInternal: true
      });
      setNewMessage('');
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al enviar', error.message);
    }
  };

  return (
    <div className="h-[750px] bg-[#1B1929] rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden flex flex-col md:flex-row animate-in fade-in duration-500">
      {/* Channels Sidebar */}
      <div className="w-full md:w-64 border-r border-white/[0.06] bg-[#10101B]/80 p-4 space-y-4 shrink-0">
        <h4 className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider px-2">Canales de Equipo</h4>
        <div className="space-y-1">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                activeChannel === ch.id
                  ? 'bg-gradient-to-r from-[#8B3DFF]/25 to-[#EC4899]/15 text-white border border-[#A855F7]/30 shadow-md'
                  : 'text-[#A1A1B5] hover:text-white hover:bg-[#252239] border border-transparent'
              }`}
            >
              <Hash size={15} className={activeChannel === ch.id ? 'text-[#EC4899]' : 'text-[#A1A1B5]/60'} />
              <span className="truncate">{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="flex-1 flex flex-col justify-between bg-[#1B1929]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#252239]/40">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-[#EC4899]" />
            <span className="text-sm font-bold text-white">
              {channels.find(c => c.id === activeChannel)?.name}
            </span>
          </div>
          <span className="text-[11px] text-[#A1A1B5]">
            {channels.find(c => c.id === activeChannel)?.desc}
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div key={m.id} className="flex items-start gap-3.5">
              <img
                src={m.senderAvatar}
                alt={m.senderName}
                className="w-9 h-9 rounded-full object-cover border border-[#8B3DFF]/40 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{m.senderName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#8B3DFF]/20 text-[#A855F7] border border-[#8B3DFF]/30 font-semibold">
                    {m.senderRole}
                  </span>
                  <span className="text-[10px] text-[#A1A1B5]/60">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mt-1.5 p-3.5 rounded-2xl bg-[#252239] border border-white/[0.05] text-xs text-[#F8FAFC] leading-relaxed max-w-xl shadow-sm">
                  {m.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-[#10101B]/60 flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder={`Escribe un mensaje en #${channels.find(c => c.id === activeChannel)?.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl gradient-primary-btn text-white shadow-lg"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
