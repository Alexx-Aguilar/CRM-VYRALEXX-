import React, { useState, useEffect } from 'react';
import {
  BarChart3, Download, TrendingUp, Users, Eye, MousePointerClick,
  Sparkles, DollarSign, Calendar, FileText, ArrowUpRight, Award,
  CheckCircle2, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { Campaign } from '../types/index.js';
import { Badge } from '../components/Badge.js';

export const AnalyticsModule: React.FC = () => {
  const { addToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    Promise.all([
      api.getAnalytics(),
      api.getCampaigns()
    ])
      .then(([analyticsData, campaignsData]) => {
        setData(analyticsData);
        setCampaigns(campaignsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleExportCsv = async () => {
    try {
      await api.downloadAnalyticsCsv();
      addToast('success', 'Exportación Exitosa', 'El archivo CSV de analítica se ha descargado.');
    } catch (error: any) {
      addToast('error', 'Error de exportación', error.message);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (isLoading || !data) {
    return <div className="text-center py-24 text-xs text-[#A1A1B5]">Generando analítica de rendimiento...</div>;
  }

  const { metrics, platformStats, creatorPerformance } = data;

  const timelinePerformance = [
    { name: 'Sem 1', clics: 4200, conversiones: 450, ctr: 4.8 },
    { name: 'Sem 2', clics: 7800, conversiones: 820, ctr: 5.4 },
    { name: 'Sem 3', clics: 12400, conversiones: 1390, ctr: 6.2 },
    { name: 'Sem 4', clics: 19800, conversiones: 2150, ctr: 7.1 },
  ];

  const pieColors = ['#EC4899', '#8B3DFF', '#22D3EE', '#4263EB'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-[#EC4899]" /> Analítica y Métricas de Rendimiento
          </h3>
          <p className="text-xs text-[#A1A1B5]">Análisis consolidado de impresiones, alcance, conversiones e inversión</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="year">Todo el Año 2026</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.07] text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download size={14} className="text-[#22D3EE]" /> Exportar CSV
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-1.5"
          >
            <FileText size={14} /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Top 4 Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A1A1B5] font-semibold">Total Impresiones</span>
            <div className="p-2 rounded-lg bg-[#EC4899]/15 text-[#EC4899]">
              <Eye size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{(metrics.totalImpressions / 1000000).toFixed(1)}M</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">+18.4%</span>
            <span className="text-[10px] text-[#A1A1B5]">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A1A1B5] font-semibold">Alcance Único</span>
            <div className="p-2 rounded-lg bg-[#8B3DFF]/15 text-[#A855F7]">
              <Target size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[#A855F7]">{(metrics.totalReach / 1000000).toFixed(1)}M</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">+22.1%</span>
            <span className="text-[10px] text-[#A1A1B5]">audiencia expandida</span>
          </div>
        </div>

        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A1A1B5] font-semibold">Interacciones</span>
            <div className="p-2 rounded-lg bg-[#22D3EE]/15 text-[#22D3EE]">
              <MousePointerClick size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{(metrics.totalEngagements / 1000).toLocaleString()}K</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full">{metrics.avgEngagementRate}% ER</span>
            <span className="text-[10px] text-[#A1A1B5]">tasa media</span>
          </div>
        </div>

        <div className="bg-[#1B1929] p-5 rounded-2xl border border-white/[0.06] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A1A1B5] font-semibold">ROI Promedio</span>
            <div className="p-2 rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[#22C55E]">{metrics.avgRoi}x</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">+31.5%</span>
            <span className="text-[10px] text-[#A1A1B5]">retorno publicitario</span>
          </div>
        </div>
      </div>

      {/* Charts Grid: Bars (Fuchsia & Violet) and Area Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Bar Chart in Fuchsia & Violet (Section 5 Requirement) */}
        <div className="lg:col-span-2 bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-white">Rendimiento por Plataforma (Fucsia & Violeta)</h4>
              <p className="text-xs text-[#A1A1B5]">Alcance (vistas) vs Inversión publicitaria consumida (USD)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Alcance (Vistas)
              </span>
              <span className="flex items-center gap-1.5 text-[#A1A1B5] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B3DFF]" /> Inversión ($)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252239" vertical={false} />
                <XAxis dataKey="platform" stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.7)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="reach" name="Alcance Generado" fill="#EC4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="spend" name="Inversión ($ USD)" fill="#8B3DFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular Distribution Donut */}
        <div className="bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Cuota de Engagement</h4>
            <p className="text-xs text-[#A1A1B5]">Distribución porcentual por red</p>
          </div>

          <div className="h-56 w-full my-auto flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="engagements"
                >
                  {platformStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-white">1.3M</span>
              <span className="text-[10px] text-[#A1A1B5]">Total Likes</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.06]">
            {platformStats.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                <span className="text-[#A1A1B5] truncate">{p.platform}</span>
                <span className="text-white font-bold ml-auto">{p.rate}% ER</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Line Chart: Conversion Trends */}
      <div className="bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Evolución de Clics y Conversiones</h4>
            <p className="text-xs text-[#A1A1B5]">Progresión semanal de tráfico calificado hacia marcas</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" /> Clics a Preventa
            </span>
            <span className="flex items-center gap-1.5 text-[#EC4899] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Conversiones
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelinePerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252239" vertical={false} />
              <XAxis dataKey="name" stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="clics" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4, fill: '#22D3EE' }} />
              <Line type="monotone" dataKey="conversiones" stroke="#EC4899" strokeWidth={3} dot={{ r: 4, fill: '#EC4899' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Information Tables (Section 5 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Creator Performance Ranking */}
        <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-[#A855F7]" /> Ranking de Creadores por Impacto
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="px-5 py-3">Creador</th>
                  <th className="px-5 py-3">Seguidores</th>
                  <th className="px-5 py-3">Alcance Med.</th>
                  <th className="px-5 py-3">Engagement</th>
                  <th className="px-5 py-3">Campañas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
                {creatorPerformance.map((cr: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#252239]/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{cr.name}</td>
                    <td className="px-5 py-3.5 text-[#A1A1B5]">{(cr.followers / 1000000).toFixed(1)}M</td>
                    <td className="px-5 py-3.5 text-[#22D3EE] font-semibold">{(cr.reach / 1000).toFixed(0)}K</td>
                    <td className="px-5 py-3.5 font-bold text-[#EC4899]">{cr.engagementRate}%</td>
                    <td className="px-5 py-3.5 font-medium">{cr.completedCampaigns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Results Overview */}
        <div className="bg-[#1B1929] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Target size={16} className="text-[#EC4899]" /> Desempeño por Campaña
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#252239] text-[#A1A1B5] uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="px-5 py-3">Campaña</th>
                  <th className="px-5 py-3">Presupuesto</th>
                  <th className="px-5 py-3">Impresiones</th>
                  <th className="px-5 py-3">Clicks</th>
                  <th className="px-5 py-3">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#F8FAFC]">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-[#252239]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white line-clamp-1">{c.name}</p>
                      <p className="text-[10px] text-[#A1A1B5]">{c.brandName}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">${c.budget.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-[#A855F7] font-semibold">{(c.metrics.impressions / 1000).toFixed(0)}K</td>
                    <td className="px-5 py-3.5 text-[#22D3EE] font-medium">{c.metrics.clicks.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-[#22C55E] px-2 py-0.5 rounded-full bg-[#22C55E]/10">
                        {c.metrics.roi}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
