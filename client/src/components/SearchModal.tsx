import React, { useState, useEffect } from 'react';
import { Search, Users, Megaphone, Briefcase, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { Creator, Campaign, Brand } from '../types/index.js';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      Promise.all([
        api.getCreators(),
        api.getCampaigns(),
        api.getBrands()
      ]).then(([cData, cpData, bData]) => {
        setCreators(cData);
        setCampaigns(cpData);
        setBrands(bData);
      }).catch(console.error);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredCreators = trimmed
    ? creators.filter(c =>
        c.name.toLowerCase().includes(trimmed) ||
        c.artisticName.toLowerCase().includes(trimmed) ||
        c.category.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredCampaigns = trimmed
    ? campaigns.filter(c =>
        c.name.toLowerCase().includes(trimmed) ||
        (c.brandName && c.brandName.toLowerCase().includes(trimmed))
      ).slice(0, 4)
    : [];

  const filteredBrands = trimmed
    ? brands.filter(b =>
        b.name.toLowerCase().includes(trimmed) ||
        b.industry.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0A12]/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Command Palette Dialog */}
      <div className="relative w-full max-w-2xl bg-[#1B1929] border border-[#8B3DFF]/30 rounded-2xl shadow-2xl overflow-hidden z-10 shadow-[#8B3DFF]/15">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/[0.06] gap-3 bg-[#252239]/60">
          <Search size={20} className="text-[#A855F7]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar creadores, campañas, marcas, o atajos..."
            className="flex-1 bg-transparent border-none text-white placeholder-[#A1A1B5] text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!trimmed && (
            <div className="py-6 text-center">
              <p className="text-xs text-[#A1A1B5]">Escribe para buscar o elige un acceso directo:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  onClick={() => handleSelect('creators')}
                  className="px-3.5 py-2 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.06] text-xs text-white flex items-center gap-2 transition-colors"
                >
                  <Users size={14} className="text-[#A855F7]" /> Explorar Creadores
                </button>
                <button
                  onClick={() => handleSelect('campaigns')}
                  className="px-3.5 py-2 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.06] text-xs text-white flex items-center gap-2 transition-colors"
                >
                  <Megaphone size={14} className="text-[#EC4899]" /> Ver Campañas
                </button>
                <button
                  onClick={() => handleSelect('pipeline')}
                  className="px-3.5 py-2 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.06] text-xs text-white flex items-center gap-2 transition-colors"
                >
                  <Briefcase size={14} className="text-[#22C55E]" /> CRM Comercial
                </button>
              </div>
            </div>
          )}

          {/* Creadores Encontrados */}
          {filteredCreators.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider px-2">Creadores</span>
              <div className="mt-1.5 space-y-1">
                {filteredCreators.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('creators')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#252239] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.artisticName} className="w-8 h-8 rounded-lg object-cover border border-[#8B3DFF]/30" />
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#EC4899]">{c.artisticName}</p>
                        <p className="text-[10px] text-[#A1A1B5]">{c.name} • {c.category}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#A1A1B5] group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campañas Encontradas */}
          {filteredCampaigns.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider px-2">Campañas</span>
              <div className="mt-1.5 space-y-1">
                {filteredCampaigns.map(cp => (
                  <button
                    key={cp.id}
                    onClick={() => handleSelect('campaigns')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#252239] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#8B3DFF]/20 text-[#A855F7] flex items-center justify-center">
                        <Megaphone size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#A855F7]">{cp.name}</p>
                        <p className="text-[10px] text-[#A1A1B5]">{cp.brandName} • ${cp.budget.toLocaleString()} USD</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#A1A1B5] group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marcas Encontradas */}
          {filteredBrands.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider px-2">Marcas y Clientes</span>
              <div className="mt-1.5 space-y-1">
                {filteredBrands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('brands')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#252239] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#22D3EE]">{b.name}</p>
                        <p className="text-[10px] text-[#A1A1B5]">{b.industry} • {b.country}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#A1A1B5] group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {trimmed && filteredCreators.length === 0 && filteredCampaigns.length === 0 && filteredBrands.length === 0 && (
            <div className="py-8 text-center text-[#A1A1B5] text-xs">
              No se encontraron resultados para "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
