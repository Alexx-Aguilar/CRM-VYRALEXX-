import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Filter, LayoutGrid, Table as TableIcon,
  Eye, Edit2, Trash2, Globe, Instagram, Youtube, Sparkles,
  TrendingUp, DollarSign, MapPin, Mail, Phone, CheckCircle2,
  ExternalLink, BarChart2, Shield
} from 'lucide-react';
import { api } from '../services/api.js';
import { Creator, Agency } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Modal } from '../components/Modal.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import { Badge } from '../components/Badge.js';

export const CreatorsModule: React.FC = () => {
  const { addToast, refreshTrigger, triggerRefresh } = useApp();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Views
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'followers' | 'engagement' | 'name'>('followers');

  // Modals
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [creatorToDelete, setCreatorToDelete] = useState<Creator | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Creator>>({
    name: '',
    artisticName: '',
    email: '',
    phone: '',
    country: 'México',
    city: '',
    bio: '',
    category: 'Gaming & Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    totalFollowers: 500000,
    avgEngagementRate: 6.5,
    avgReach: 200000,
    availability: 'Disponible',
    status: 'Activo',
    tags: ['Tech', 'Gaming'],
    notes: '',
    rates: {
      instagramReel: 3000,
      instagramStory: 900,
      tiktokVideo: 3500,
      youtubeDedicated: 7000,
      youtubeIntegration: 3800,
      eventAttendance: 5000
    },
    socialProfiles: [
      { platform: 'instagram', handle: '', followers: 200000, url: 'https://instagram.com', engagementRate: 5.5, avgViews: 60000 },
      { platform: 'tiktok', handle: '', followers: 300000, url: 'https://tiktok.com', engagementRate: 7.5, avgViews: 140000 }
    ],
    audience: {
      topCountries: [
        { country: 'México', percentage: 45 },
        { country: 'España', percentage: 25 },
        { country: 'Colombia', percentage: 15 },
        { country: 'Estados Unidos', percentage: 15 }
      ],
      genderSplit: { male: 50, female: 47, other: 3 },
      ageGroups: [
        { range: '18-24', percentage: 45 },
        { range: '25-34', percentage: 40 },
        { range: '35+', percentage: 15 }
      ]
    }
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [creatorsData, agenciesData] = await Promise.all([
        api.getCreators(),
        api.getAgencies()
      ]);
      setCreators(creatorsData);
      setAgencies(agenciesData);
    } catch (e) {
      console.error(e);
      addToast('error', 'Error al cargar creadores', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setEditingCreator(null);
    setFormData({
      name: '',
      artisticName: '',
      email: '',
      phone: '',
      country: 'México',
      city: '',
      bio: '',
      category: 'Gaming & Tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      totalFollowers: 250000,
      avgEngagementRate: 6.5,
      avgReach: 120000,
      availability: 'Disponible',
      status: 'Activo',
      tags: ['General'],
      notes: '',
      rates: {
        instagramReel: 2500,
        instagramStory: 800,
        tiktokVideo: 3000,
        youtubeDedicated: 6000,
        youtubeIntegration: 3200,
        eventAttendance: 4500
      },
      socialProfiles: [
        { platform: 'instagram', handle: '@nuevo_talento', followers: 150000, url: 'https://instagram.com', engagementRate: 5.8, avgViews: 45000 },
        { platform: 'tiktok', handle: '@nuevo_talento', followers: 100000, url: 'https://tiktok.com', engagementRate: 7.2, avgViews: 75000 }
      ],
      audience: {
        topCountries: [{ country: 'México', percentage: 50 }, { country: 'España', percentage: 30 }, { country: 'Colombia', percentage: 20 }],
        genderSplit: { male: 50, female: 48, other: 2 },
        ageGroups: [{ range: '18-24', percentage: 50 }, { range: '25-34', percentage: 38 }, { range: '35+', percentage: 12 }]
      }
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (creator: Creator) => {
    setEditingCreator(creator);
    setFormData({ ...creator });
    setIsFormModalOpen(true);
  };

  const handleSaveCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCreator) {
        await api.updateCreator(editingCreator.id, formData);
        addToast('success', 'Creador Actualizado', `${formData.artisticName} ha sido modificado.`);
      } else {
        await api.createCreator(formData);
        addToast('success', 'Creador Registrado', `${formData.artisticName} ha sido añadido.`);
      }
      setIsFormModalOpen(false);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al guardar creador', error.message);
    }
  };

  const handleDeleteCreator = async () => {
    if (!creatorToDelete) return;
    try {
      await api.deleteCreator(creatorToDelete.id);
      addToast('success', 'Creador Eliminado', `${creatorToDelete.artisticName} fue eliminado.`);
      setCreatorToDelete(null);
      triggerRefresh();
    } catch (error: any) {
      addToast('error', 'Error al eliminar', error.message);
    }
  };

  const filteredCreators = creators.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.artisticName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || c.country === selectedCountry;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesCountry && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'followers') return b.totalFollowers - a.totalFollowers;
    if (sortBy === 'engagement') return b.avgEngagementRate - a.avgEngagementRate;
    return a.artisticName.localeCompare(b.artisticName);
  });

  const categories = ['Gaming & Tech', 'Moda & Lifestyle', 'Fitness & Nutrición', 'Belleza & Cuidado Personal', 'Viajes & Aventura'];
  const countries = Array.from(new Set(creators.map(c => c.country)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1B5]" />
          <input
            type="text"
            placeholder="Buscar por nombre, nickname o tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Países</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="all">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="En revisión">En revisión</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="followers">Más Seguidores</option>
            <option value="engagement">Mayor Engagement</option>
            <option value="name">Alfabético</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#252239] border border-white/[0.06]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#8B3DFF]/30 text-[#EC4899]' : 'text-[#A1A1B5] hover:text-white'}`}
              title="Vista en tarjetas"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#8B3DFF]/30 text-[#EC4899]' : 'text-[#A1A1B5] hover:text-white'}`}
              title="Vista en tabla"
            >
              <TableIcon size={16} />
            </button>
          </div>

          {/* Add Creator Button */}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Registrar Creador
          </button>
        </div>
      </div>

      {/* Grid View (Inspired by Reference Section 6) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCreators.map(creator => (
            <div
              key={creator.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Header Card with glowing avatar */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.artisticName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8B3DFF]/40 shadow-lg shadow-[#8B3DFF]/20"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1B1929] ${
                      creator.status === 'Activo' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white truncate">{creator.artisticName}</h3>
                      <Badge status={creator.availability} size="sm" />
                    </div>
                    <p className="text-xs text-[#A1A1B5] truncate">{creator.name}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A855F7] mt-1 font-medium">
                      <MapPin size={12} /> {creator.city}, {creator.country}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 mt-4 line-clamp-2 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[#252239] border border-white/[0.06] text-center">
                  <div>
                    <span className="text-[10px] text-[#A1A1B5] block">Audiencia</span>
                    <span className="text-xs font-black text-white">{(creator.totalFollowers / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="border-x border-white/[0.08]">
                    <span className="text-[10px] text-[#A1A1B5] block">Engagement</span>
                    <span className="text-xs font-black text-[#EC4899]">{creator.avgEngagementRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A1A1B5] block">Alcance Med.</span>
                    <span className="text-xs font-black text-[#22D3EE]">{(creator.avgReach / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                {/* Rates Highlight */}
                <div className="mt-4 flex items-center justify-between text-xs py-2 border-y border-white/[0.06]">
                  <span className="text-[#A1A1B5]">Tarifa IG Reel / TikTok:</span>
                  <span className="font-bold text-[#22C55E]">
                    ${creator.rates.instagramReel.toLocaleString()} USD
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {creator.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#252239] text-[#A1A1B5] border border-white/[0.05]">
                      #{tag}
                    </span>
                  ))}
                  {creator.tags.length > 3 && (
                    <span className="text-[10px] text-[#A1A1B5]/60 font-semibold">+{creator.tags.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-3.5 bg-[#252239]/40 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCreator(creator);
                    setIsDetailModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1.5"
                >
                  <Eye size={14} /> Ver Perfil Completo
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(creator)}
                    className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239] transition-colors"
                    title="Editar Creador"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setCreatorToDelete(creator)}
                    className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-colors"
                    title="Eliminar Creador"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4">Creador</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">País</th>
                  <th className="px-6 py-4">Seguidores</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4">Tarifa Base</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
                {filteredCreators.map(creator => (
                  <tr key={creator.id} className="hover:bg-[#252239]/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={creator.avatar} alt={creator.artisticName} className="w-10 h-10 rounded-xl object-cover border border-[#8B3DFF]/30" />
                      <div>
                        <p className="font-bold text-white">{creator.artisticName}</p>
                        <p className="text-[11px] text-[#A1A1B5]">{creator.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300">{creator.category}</td>
                    <td className="px-6 py-4">{creator.country}</td>
                    <td className="px-6 py-4 font-black text-white">{(creator.totalFollowers / 1000000).toFixed(1)}M</td>
                    <td className="px-6 py-4 font-black text-[#EC4899]">{creator.avgEngagementRate}%</td>
                    <td className="px-6 py-4 font-bold text-[#22C55E]">${creator.rates.instagramReel.toLocaleString()} USD</td>
                    <td className="px-6 py-4">
                      <Badge status={creator.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedCreator(creator);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#252239]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(creator)}
                          className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-white hover:bg-[#252239]"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setCreatorToDelete(creator)}
                          className="p-1.5 rounded-lg text-[#A1A1B5] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
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
      )}

      {/* DETAIL MODAL */}
      {selectedCreator && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Perfil de ${selectedCreator.artisticName}`}
          subtitle={`Información comercial y demográfica completa`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-[#252239]/60 border border-white/[0.07]">
              <img
                src={selectedCreator.avatar}
                alt={selectedCreator.artisticName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#8B3DFF] shadow-xl"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedCreator.artisticName}</h3>
                  <Badge status={selectedCreator.status} />
                  <Badge status={selectedCreator.availability} />
                </div>
                <p className="text-xs text-[#A1A1B5] mt-1">{selectedCreator.name} • {selectedCreator.category}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1B5] mt-2">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-[#A855F7]" /> {selectedCreator.city}, {selectedCreator.country}</span>
                  <span className="flex items-center gap-1"><Mail size={14} className="text-[#EC4899]" /> {selectedCreator.email}</span>
                  <span className="flex items-center gap-1"><Phone size={14} className="text-[#22D3EE]" /> {selectedCreator.phone}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Redes Sociales & Métricas Verificadas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedCreator.socialProfiles.map((sp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#252239] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#A1A1B5] mb-1">
                      <span className="capitalize font-semibold text-white">{sp.platform}</span>
                      <span className="text-[#EC4899] font-bold">{sp.engagementRate}% ER</span>
                    </div>
                    <p className="text-sm font-black text-white">{(sp.followers / 1000).toLocaleString()}K seguidores</p>
                    <p className="text-[10px] text-[#A1A1B5] mt-0.5 truncate">{sp.handle}</p>
                    <p className="text-[10px] text-[#22D3EE] mt-1">~{(sp.avgViews / 1000).toLocaleString()}K vistas prom.</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rates Table */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Tarifario de Colaboraciones</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#252239] border border-white/[0.06] text-xs">
                <div>
                  <span className="text-[#A1A1B5] block">Instagram Reel</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.instagramReel.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#A1A1B5] block">Instagram Story</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.instagramStory.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#A1A1B5] block">TikTok Video</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.tiktokVideo.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#A1A1B5] block">YouTube Integración</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.youtubeIntegration.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#A1A1B5] block">YouTube Dedicado 4K</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.youtubeDedicated.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#A1A1B5] block">Asistencia a Evento</span>
                  <span className="text-base font-black text-[#22C55E]">${selectedCreator.rates.eventAttendance.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            {/* Audience Demographics */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Demografía de Audiencia</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#252239] border border-white/[0.06] text-xs">
                <div>
                  <span className="font-bold text-white block mb-2">Países Principales</span>
                  <div className="space-y-1.5">
                    {selectedCreator.audience.topCountries.map((tc, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[#A1A1B5]">
                        <span>{tc.country}</span>
                        <span className="font-bold text-white">{tc.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white block mb-2">Distribución de Género</span>
                  <div className="space-y-1.5 text-[#A1A1B5]">
                    <div className="flex justify-between">
                      <span>Femenino</span>
                      <span className="font-bold text-[#EC4899]">{selectedCreator.audience.genderSplit.female}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Masculino</span>
                      <span className="font-bold text-[#22D3EE]">{selectedCreator.audience.genderSplit.male}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Otro</span>
                      <span className="font-bold text-[#A855F7]">{selectedCreator.audience.genderSplit.other}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white block mb-2">Rangos de Edad</span>
                  <div className="space-y-1.5 text-[#A1A1B5]">
                    {selectedCreator.audience.ageGroups.map((ag, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{ag.range} años</span>
                        <span className="font-bold text-white">{ag.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {selectedCreator.notes && (
              <div className="p-4 rounded-xl bg-[#8B3DFF]/10 border border-[#8B3DFF]/20 text-xs">
                <span className="font-bold text-[#A855F7] block mb-1">Notas Internas de Agencia:</span>
                <p className="text-slate-300 leading-relaxed">{selectedCreator.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCreator ? 'Editar Perfil de Creador' : 'Registrar Nuevo Creador'}
        subtitle="Completa los datos de perfil, redes y tarifas comerciales"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveCreator} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre Artístico / Nickname *</label>
              <input
                type="text"
                required
                value={formData.artisticName}
                onChange={e => setFormData({ ...formData, artisticName: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. Valeria CyberGlow"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Nombre Real Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
                placeholder="Ej. Valeria Castro Ruiz"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Categoría / Nicho</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">País</label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Disponibilidad</label>
              <select
                value={formData.availability}
                onChange={e => setFormData({ ...formData, availability: e.target.value as any })}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                <option value="Disponible">Disponible</option>
                <option value="En proyectos">En proyectos</option>
                <option value="No disponible">No disponible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#A1A1B5] font-semibold block mb-1">Biografía</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input"
              placeholder="Descripción del estilo de contenido y audiencia..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Total Seguidores</label>
              <input
                type="number"
                value={formData.totalFollowers}
                onChange={e => setFormData({ ...formData, totalFollowers: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Engagement Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.avgEngagementRate}
                onChange={e => setFormData({ ...formData, avgEngagementRate: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[#A1A1B5] font-semibold block mb-1">Tarifa IG Reel ($ USD)</label>
              <input
                type="number"
                value={formData.rates?.instagramReel || 2000}
                onChange={e => setFormData({
                  ...formData,
                  rates: { ...formData.rates!, instagramReel: Number(e.target.value) }
                })}
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
              {editingCreator ? 'Guardar Cambios' : 'Registrar Creador'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={Boolean(creatorToDelete)}
        onClose={() => setCreatorToDelete(null)}
        onConfirm={handleDeleteCreator}
        title="Eliminar Creador"
        message={`¿Estás seguro de eliminar el registro de ${creatorToDelete?.artisticName}? Esta acción es permanente.`}
        confirmText="Sí, Eliminar"
        type="danger"
      />
    </div>
  );
};
