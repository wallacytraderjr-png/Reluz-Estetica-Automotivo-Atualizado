'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface ProductItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category?: string;
}

interface PeriodPerformance {
  date: string;
  label: string;
  shortLabel: string;
  vendas: number;
  qtdVendas: number;
  agendamentos: number;
  isToday?: boolean;
}

type PeriodType = 'diario' | 'semanal' | 'mensal' | 'anual';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vendasHoje: 0,
    vendasMes: 0,
    clientesTotal: 0,
    agendamentosTotal: 0
  });
  const [periodo, setPeriodo] = useState<PeriodType>('semanal');
  const [rawSales, setRawSales] = useState<any[]>([]);
  const [rawAppointments, setRawAppointments] = useState<any[]>([]);
  const [criticalProducts, setCriticalProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Busca vendas, clientes, agendamentos e produtos em paralelo
        const [salesRes, clientsRes, appointmentsRes, productsRes] = await Promise.all([
          fetch('/api/admin/sales').catch(() => ({ json: () => [] })),
          fetch('/api/admin/customers').catch(() => ({ json: () => [] })),
          fetch('/api/appointments').catch(() => ({ json: () => [] })),
          fetch('/api/admin/products').catch(() => ({ json: () => [] }))
        ]);

        const sales = await salesRes.json();
        const clients = await clientsRes.json();
        const appointments = await appointmentsRes.json();
        const products = await productsRes.json();

        const salesList = Array.isArray(sales) ? sales : [];
        const clientsList = Array.isArray(clients) ? clients : [];
        const appointmentsList = Array.isArray(appointments) ? appointments : [];
        const productsList: ProductItem[] = Array.isArray(products) ? products : [];

        setRawSales(salesList);
        setRawAppointments(appointmentsList);

        // Filtra produtos em nível crítico (estoque <= 5) ou em falta (estoque <= 0)
        const critical = productsList
          .filter((p) => Number(p.stock ?? 0) <= 5)
          .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0));
        setCriticalProducts(critical);

        // Data de hoje formatada em YYYY-MM-DD para comparação simples
        const todayStr = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        let totalHoje = 0;
        let totalMes = 0;

        salesList.forEach((s: any) => {
          const valor = Number(s.total || s.amount || 0);
          const dataVenda = s.createdAt || s.date || '';

          // Soma vendas do dia
          if (dataVenda.startsWith(todayStr)) {
            totalHoje += valor;
          }
          // Soma vendas do mês
          if (dataVenda.startsWith(currentMonth)) {
            totalMes += valor;
          }
        });

        setStats({
          vendasHoje: totalHoje,
          vendasMes: totalMes > 0 ? totalMes : totalHoje, // Fallback se a data diferir no formato
          clientesTotal: clientsList.length,
          agendamentosTotal: appointmentsList.length
        });
      } catch (error) {
        console.error('Erro ao carregar dados da dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Constrói os dados do gráfico dinamicamente com base no filtro selecionado (Diário, Semanal, Mensal ou Anual)
  const currentChartData = useMemo<PeriodPerformance[]>(() => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA');

    if (periodo === 'diario') {
      // Blocos de 2 horas ao longo do dia (das 06h às 22h)
      const hours = [6, 8, 10, 12, 14, 16, 18, 20];
      return hours.map((h, i) => {
        const nextH = hours[i + 1] || 22;
        const inRange = rawSales.filter((s: any) => {
          const d = s.createdAt ? new Date(s.createdAt) : null;
          if (!d) return false;
          if (d.toLocaleDateString('en-CA') !== todayStr) return false;
          const hour = d.getHours();
          return hour >= h && hour < nextH;
        });

        const inAppointments = rawAppointments.filter((a: any) => {
          const aDate = a.date || (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-CA') : '');
          if (aDate !== todayStr) return false;
          const aTime = a.time || '';
          const aHour = parseInt(aTime.split(':')[0], 10);
          return !isNaN(aHour) && aHour >= h && aHour < nextH;
        });

        const total = inRange.reduce((acc: number, s: any) => acc + Number(s.total || s.amount || 0), 0);
        return {
          date: `${todayStr}T${String(h).padStart(2, '0')}:00`,
          label: `${String(h).padStart(2, '0')}:00 às ${String(nextH).padStart(2, '0')}:00`,
          shortLabel: `${h}h`,
          vendas: total,
          qtdVendas: inRange.length,
          agendamentos: inAppointments.length,
          isToday: true,
        };
      });
    }

    if (periodo === 'semanal') {
      // Últimos 7 dias
      const days: PeriodPerformance[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');

        const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
        const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
        const dayMonth = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const daySales = rawSales.filter((s: any) => {
          const sDate = s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-CA') : (s.date || '').slice(0, 10);
          return sDate === dateStr;
        });

        const dayAppointments = rawAppointments.filter((a: any) => {
          const aDate = a.date ? a.date.slice(0, 10) : (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-CA') : '');
          return aDate === dateStr;
        });

        const totalDay = daySales.reduce((acc: number, s: any) => acc + Number(s.total || s.amount || 0), 0);

        days.push({
          date: dateStr,
          label: `${formattedDay} (${dayMonth})`,
          shortLabel: formattedDay,
          vendas: totalDay,
          qtdVendas: daySales.length,
          agendamentos: dayAppointments.length,
          isToday: i === 0,
        });
      }
      return days;
    }

    if (periodo === 'mensal') {
      // 4 semanas do mês atual (Novembro/2026)
      const currentYear = today.getFullYear();
      const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
      const weeks = [
        { label: `Sem 1 (01 a 07/${currentMonth})`, shortLabel: 'Sem 1', start: `${currentYear}-${currentMonth}-01`, end: `${currentYear}-${currentMonth}-07` },
        { label: `Sem 2 (08 a 14/${currentMonth})`, shortLabel: 'Sem 2', start: `${currentYear}-${currentMonth}-08`, end: `${currentYear}-${currentMonth}-14` },
        { label: `Sem 3 (15 a 21/${currentMonth})`, shortLabel: 'Sem 3', start: `${currentYear}-${currentMonth}-15`, end: `${currentYear}-${currentMonth}-21` },
        { label: `Sem 4 (22 a 31/${currentMonth})`, shortLabel: 'Sem 4', start: `${currentYear}-${currentMonth}-22`, end: `${currentYear}-${currentMonth}-31` },
      ];

      return weeks.map((w) => {
        const weekSales = rawSales.filter((s: any) => {
          const sDate = (s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-CA') : (s.date || '')).slice(0, 10);
          return sDate >= w.start && sDate <= w.end;
        });

        const weekAppointments = rawAppointments.filter((a: any) => {
          const aDate = (a.date || (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-CA') : '')).slice(0, 10);
          return aDate >= w.start && aDate <= w.end;
        });

        const total = weekSales.reduce((acc: number, s: any) => acc + Number(s.total || s.amount || 0), 0);
        return {
          date: w.start,
          label: w.label,
          shortLabel: w.shortLabel,
          vendas: total,
          qtdVendas: weekSales.length,
          agendamentos: weekAppointments.length,
          isToday: todayStr >= w.start && todayStr <= w.end,
        };
      });
    }

    if (periodo === 'anual') {
      // 12 meses do ano corrente (2026)
      const currentYear = today.getFullYear();
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months.map((m, idx) => {
        const mStr = String(idx + 1).padStart(2, '0');
        const prefix = `${currentYear}-${mStr}`;

        const monthSales = rawSales.filter((s: any) => {
          const sDate = (s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-CA') : (s.date || '')).slice(0, 10);
          return sDate.startsWith(prefix);
        });

        const monthAppointments = rawAppointments.filter((a: any) => {
          const aDate = (a.date || (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-CA') : '')).slice(0, 10);
          return aDate.startsWith(prefix);
        });

        const total = monthSales.reduce((acc: number, s: any) => acc + Number(s.total || s.amount || 0), 0);
        return {
          date: `${prefix}-01`,
          label: `${m} de ${currentYear}`,
          shortLabel: m,
          vendas: total,
          qtdVendas: monthSales.length,
          agendamentos: monthAppointments.length,
          isToday: idx === today.getMonth(),
        };
      });
    }

    return [];
  }, [periodo, rawSales, rawAppointments]);

  const currentPeriodTotal = useMemo(() => {
    return currentChartData.reduce((acc, d) => acc + d.vendas, 0);
  }, [currentChartData]);

  const currentPeriodCount = useMemo(() => {
    return currentChartData.reduce((acc, d) => acc + d.qtdVendas, 0);
  }, [currentChartData]);

  const currentPeriodAppointments = useMemo(() => {
    return currentChartData.reduce((acc, d) => acc + d.agendamentos, 0);
  }, [currentChartData]);

  const currentPeriodAverage = useMemo(() => {
    if (currentChartData.length === 0) return 0;
    return currentPeriodTotal / currentChartData.length;
  }, [currentPeriodTotal, currentChartData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
        <p className="text-zinc-500">Bem-vindo ao centro de controle da Reluz.</p>
      </div>

      {/* Alerta Superior de Nível Crítico de Estoque */}
      {criticalProducts.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl shrink-0">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-red-400">
                  Aviso: Estoque em Nível Crítico!
                </h4>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-[10px] font-bold">
                  {criticalProducts.length} {criticalProducts.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Existem produtos que atingiram nível crítico (5 ou menos unidades) ou estão em falta.
              </p>
            </div>
          </div>
          <Link
            href="/admin/produtos"
            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Package size={15} />
            <span>Repor no Estoque</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Vendas (Hoje)</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {loading ? '...' : formatCurrency(stats.vendasHoje)}
              </h3>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl border border-green-500/20">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Vendas (Mês)</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {loading ? '...' : formatCurrency(stats.vendasMes)}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Clientes</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {loading ? '...' : stats.clientesTotal}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agendamentos</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {loading ? '...' : stats.agendamentosTotal}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl border border-purple-500/20">
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico / Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="text-amber-500" size={20} />
                <h2 className="text-xl font-bold text-white">
                  {periodo === 'diario' && 'Desempenho Diário'}
                  {periodo === 'semanal' && 'Desempenho Semanal'}
                  {periodo === 'mensal' && 'Desempenho Mensal'}
                  {periodo === 'anual' && 'Desempenho Anual'}
                </h2>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                {periodo === 'diario' && 'Fluxo de vendas por faixa de horário de hoje.'}
                {periodo === 'semanal' && 'Faturamento e movimentação dos últimos 7 dias.'}
                {periodo === 'mensal' && 'Evolução por semanas no mês atual (Novembro/2026).'}
                {periodo === 'anual' && 'Visão consolidada mês a mês no ano de 2026.'}
              </p>
            </div>

            {/* Grupo de botões: Diário, Semanal, Mensal, Anual */}
            <div className="flex items-center bg-black/60 border border-white/10 rounded-2xl p-1 gap-1">
              {[
                { id: 'diario', label: 'Diário' },
                { id: 'semanal', label: 'Semanal' },
                { id: 'mensal', label: 'Mensal' },
                { id: 'anual', label: 'Anual' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPeriodo(tab.id as PeriodType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    periodo === tab.id
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Indicadores rápidos do período selecionado */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="bg-black/50 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-zinc-500">
                {periodo === 'diario' && 'Total Hoje: '}
                {periodo === 'semanal' && 'Total 7 dias: '}
                {periodo === 'mensal' && 'Total no Mês: '}
                {periodo === 'anual' && 'Total em 2026: '}
              </span>
              <strong className="text-white font-bold">{formatCurrency(currentPeriodTotal)}</strong>
            </div>

            <div className="bg-black/50 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-zinc-500">
                {periodo === 'diario' && 'Vendas Hoje: '}
                {periodo === 'semanal' && 'Média diária: '}
                {periodo === 'mensal' && 'Média semanal: '}
                {periodo === 'anual' && 'Média mensal: '}
              </span>
              <strong className="text-amber-500 font-bold">
                {periodo === 'diario' ? `${currentPeriodCount} vendas` : formatCurrency(currentPeriodAverage)}
              </strong>
            </div>

            {currentPeriodAppointments > 0 && (
              <div className="bg-black/50 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span className="text-zinc-500">Agendamentos: </span>
                <strong className="text-purple-400 font-bold">{currentPeriodAppointments}</strong>
              </div>
            )}
          </div>

          {/* Gráfico Recharts */}
          <div className="h-64 w-full pt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                Carregando dados operacionais...
              </div>
            ) : currentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSemana" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis 
                    dataKey="shortLabel" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$ ${v >= 1000 ? (v/1000).toFixed(1) + 'k' : v}`} 
                  />
                  <Tooltip
                    cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as PeriodPerformance;
                        return (
                          <div className="bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl space-y-1.5 text-xs">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-white">{item.label}</span>
                              {item.isToday && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">Atual</span>
                              )}
                            </div>
                            <div className="pt-1 border-t border-white/5 space-y-0.5">
                              <p className="text-amber-500 font-bold text-sm">
                                {formatCurrency(item.vendas)}
                              </p>
                              <p className="text-zinc-400 text-[11px]">
                                {item.qtdVendas} {item.qtdVendas === 1 ? 'venda registrada' : 'vendas registradas'} • {item.agendamentos} {item.agendamentos === 1 ? 'agendamento' : 'agendamentos'}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorSemana)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Card Detalhado de Alertas de Estoque */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <AlertTriangle className={criticalProducts.length > 0 ? "text-red-500 animate-pulse" : "text-amber-500"} size={22} />
                Alertas de Estoque
              </h2>
              {criticalProducts.length > 0 && (
                <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {criticalProducts.length} {criticalProducts.length === 1 ? 'crítico' : 'críticos'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-zinc-500 text-sm">
                Verificando estoque...
              </div>
            ) : criticalProducts.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] text-zinc-300">
                    <strong className="text-red-400 font-bold">Nível Crítico: </strong>
                    Produtos com 5 unidades ou menos exigem reposição imediata para evitar falta de atendimento.
                  </p>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {criticalProducts.map((p) => {
                    const isOutOfStock = Number(p.stock || 0) <= 0;
                    return (
                      <div 
                        key={p.id} 
                        className="p-3 bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{p.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{p.category || 'Geral'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${
                            isOutOfStock 
                              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          }`}>
                            {isOutOfStock ? 'Em Falta (0 un.)' : `${p.stock} un. restantes`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-bold text-white">Estoque Saudável</p>
                <p className="text-xs text-zinc-500">Nenhum produto em nível crítico ou esgotado no momento.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link
              href="/admin/produtos"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Package size={15} className="text-amber-500" />
              <span>Gerenciar Todos os Produtos</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}