import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, Megaphone, DollarSign, TrendingUp,
  AlertCircle, Eye, MousePointerClick, CheckCircle2,
  ArrowUpRight, Plus, RefreshCw, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { api } from '../services/api.js';
import { DashboardStats } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Badge } from '../components/Badge.js';

export const DashboardModule: React.FC = () => {
  const { setActiveTab, refreshTrigger } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={36} className="text-[#A855F7] animate-spin" />
          <p className="text-xs text-[#A1A1B5]">Cargando métricas de VYRALEXX...</p>
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, platformBreakdown, campaignStatusDistribution, recentActivity, urgentCampaigns } = stats;

  const platformColors = ['#EC4899', '#22D3EE', '#8B3DFF', '#4263EB'];

  const kpiCards = [
    {
      title: 'Creadores Registrados',
      value: `${overview.activeCreators} / ${overview.totalCreators}`,
      sub: '+14% este mes',
      trend: '+14.2%',
      icon: Users,
      iconBg: 'bg-[#8B3DFF]/15 text-[#A855F7] border border-[#8B3DFF]/30',
      badgeColor: 'text-[#22C55E] bg-[#22C55E]/10',
      onClick: () => setActiveTab('creators')
    },
    {
      title: 'Campañas Activas',
      value: overview.activeCampaigns,
      sub: `${overview.finishedCampaigns} finalizadas`,
      trend: '+8.5%',
      icon: Megaphone,
      iconBg: 'bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30',
      badgeColor: 'text-[#EC4899] bg-[#EC4899]/10',
      onClick: () => setActiveTab('campaigns')
    },
    {
      title: 'Marcas y Clientes',
      value: overview.totalBrands,
      sub: `${overview.totalAgencies} agencias asociadas`,
      trend: '+19.0%',
      icon: Briefcase,
      iconBg: 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30',
      badgeColor: 'text-[#22D3EE] bg-[#22D3EE]/10',
      onClick: () => setActiveTab('brands')
    },
    {
      title: 'Facturación Global',
      value: `$${overview.totalRevenue.toLocaleString()}`,
      sub: `Pendiente: $${overview.pendingRevenue.toLocaleString()}`,
      trend: '+24.8%',
      icon: DollarSign,
      iconBg: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
      badgeColor: 'text-[#22C55E] bg-[#22C55E]/10',
      onClick: () => setActiveTab('payments')
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-[#1B1929] border border-white/[0.07] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B3DFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B3DFF]/15 border border-[#8B3DFF]/30 text-[#A855F7] text-xs font-semibold mb-2.5">
              <Sparkles size={13} className="text-[#EC4899]" /> Panel de Gestión y Control SaaS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido a <span className="gradient-brand-text">VYRALEXX</span>
            </h2>
            <p className="text-xs text-[#A1A1B5] mt-1.5 leading-relaxed">
              "Where creators and brands connect." Monitorea en vivo contratos, colaboraciones, presupuestos y el ROI de tus talentos.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('campaigns')}
              className="px-4 py-2.5 rounded-xl gradient-primary-btn text-white text-xs font-bold flex items-center gap-2"
            >
              <Plus size={15} /> Nueva Campaña
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className="px-4 py-2.5 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.08] text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <Users size={15} className="text-[#A855F7]" /> Registrar Creador
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="px-4 py-2.5 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.08] text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <TrendingUp size={15} className="text-[#22C55E]" /> Nuevo Deal
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className="glass-card p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#A1A1B5]">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{kpi.value}</div>
              
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-xs">
                <span className="text-[11px] text-[#A1A1B5] truncate">{kpi.sub}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.badgeColor}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Performance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#1B1929] border border-white/[0.06] shadow-lg">
        <div className="border-r border-white/[0.06] pr-4">
          <p className="text-[11px] font-medium text-[#A1A1B5]">Alcance Total</p>
          <p className="text-lg font-black text-white mt-1">{(overview.totalReach / 1000000).toFixed(1)}M</p>
          <span className="text-[10px] text-[#22D3EE] font-semibold">Usuarios únicos</span>
        </div>
        <div className="border-r border-white/[0.06] px-4">
          <p className="text-[11px] font-medium text-[#A1A1B5]">Impresiones</p>
          <p className="text-lg font-black text-white mt-1">{(overview.totalImpressions / 1000000).toFixed(1)}M</p>
          <span className="text-[10px] text-[#EC4899] font-semibold">Vistas brutas</span>
        </div>
        <div className="border-r border-white/[0.06] px-4">
          <p className="text-[11px] font-medium text-[#A1A1B5]">Tasa Engagement</p>
          <p className="text-lg font-black text-[#A855F7] mt-1">{overview.avgEngagementRate}%</p>
          <span className="text-[10px] text-[#22C55E] font-semibold">Alto impacto</span>
        </div>
        <div className="pl-4">
          <p className="text-[11px] font-medium text-[#A1A1B5]">Retorno Promedio (ROI)</p>
          <p className="text-lg font-black text-[#22C55E] mt-1">{overview.overallRoi}x</p>
          <span className="text-[10px] text-[#A1A1B5]">Por cada $1 USD</span>
        </div>
      </div>

      {/* Charts Grid: Evolution (2 cols) & Social Share (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Performance AreaChart */}
        <div className="lg:col-span-2 bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Evolución de Ingresos y Payouts</h3>
              <p className="text-xs text-[#A1A1B5]">Facturación a marcas vs pagos a talentos (USD)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Cobros
              </span>
              <span className="flex items-center gap-1.5 text-[#A1A1B5] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B3DFF]" /> Payouts
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B3DFF" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#8B3DFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252239" vertical={false} />
                <XAxis dataKey="month" stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1B5" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.7)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="payouts" stroke="#8B3DFF" strokeWidth={3} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Donut */}
        <div className="bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Distribución de Redes</h3>
            <p className="text-xs text-[#A1A1B5]">Cuota de participación por plataforma</p>
          </div>

          <div className="h-56 w-full my-auto flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={platformColors[index % platformColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-white">100%</span>
              <span className="text-[10px] text-[#A1A1B5]">Impacto</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.06]">
            {platformBreakdown.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: platformColors[idx % platformColors.length] }} />
                <span className="text-[#A1A1B5] truncate">{p.name}</span>
                <span className="text-white font-bold ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns in Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Urgent Campaigns */}
        <div className="lg:col-span-2 bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Campañas Prioritarias</h3>
              <p className="text-xs text-[#A1A1B5]">Seguimiento de presupuesto y entregables</p>
            </div>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="text-xs text-[#EC4899] hover:underline font-semibold flex items-center gap-1"
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3.5">
            {urgentCampaigns.map(camp => {
              const spentPct = Math.round((camp.spentBudget / camp.budget) * 100);
              return (
                <div
                  key={camp.id}
                  onClick={() => setActiveTab('campaigns')}
                  className="p-4 rounded-xl bg-[#252239] hover:bg-[#2E2B45] border border-white/[0.05] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#EC4899] transition-colors">
                        {camp.name}
                      </h4>
                      <p className="text-xs text-[#A1A1B5] truncate">{camp.brandName}</p>
                    </div>
                    <Badge status={camp.status} />
                  </div>

                  {/* Progress */}
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-[11px] text-[#A1A1B5]">
                      <span>Presupuesto ejecutado</span>
                      <span className="font-semibold text-white">
                        ${camp.spentBudget.toLocaleString()} / ${camp.budget.toLocaleString()} USD ({spentPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#10101B] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#EC4899] rounded-full transition-all"
                        style={{ width: `${Math.min(spentPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-[#A1A1B5]">
                    <span>Vence: {camp.endDate}</span>
                    <span>{camp.deliverables.length} Entregables</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-[#1B1929] p-6 rounded-2xl border border-white/[0.06] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Actividad Reciente</h3>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((act, i) => {
                const nodeColors = ['#EC4899', '#A855F7', '#22D3EE', '#22C55E'];
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: nodeColors[i % nodeColors.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 leading-snug">{act.text}</p>
                      <span className="text-[10px] text-[#A1A1B5]/70 mt-0.5 block">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <button
              onClick={() => setActiveTab('calendar')}
              className="w-full py-2.5 rounded-xl bg-[#252239] hover:bg-[#2E2B45] text-xs font-semibold text-white transition-colors"
            >
              Consultar Calendario Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
