'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Package, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Seg', vendas: 4000 },
  { name: 'Ter', vendas: 3000 },
  { name: 'Qua', vendas: 2000 },
  { name: 'Qui', vendas: 2780 },
  { name: 'Sex', vendas: 1890 },
  { name: 'Sáb', vendas: 2390 },
  { name: 'Dom', vendas: 3490 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSalesDay: 0,
    totalSalesMonth: 0,
    customerCount: 0,
    productCount: 0,
    serviceCount: 0,
    appointmentCount: 0,
    lowStock: [],
    recentSales: [],
    nextAppointments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data || {});
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { name: 'Vendas (Hoje)', value: stats.totalSalesDay || 0, icon: DollarSign, color: 'text-green-500', isCurrency: true },
    { name: 'Vendas (Mês)', value: stats.totalSalesMonth || 0, icon: TrendingUp, color: 'text-blue-500', isCurrency: true },
    { name: 'Clientes', value: stats.customerCount || 0, icon: Users, color: 'text-amber-500', isCurrency: false },
    { name: 'Agendamentos', value: stats.appointmentCount || 0, icon: Calendar, color: 'text-purple-500', isCurrency: false },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const lowStockItems = Array.isArray(stats.lowStock) ? stats.lowStock : [];
  const nextAppointments = Array.isArray(stats.nextAppointments) ? stats.nextAppointments : [];
  const recentSales = Array.isArray(stats.recentSales) ? stats.recentSales : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
        <p className="text-zinc-500">Bem-vindo ao centro de controle da Reluz.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded-sm flex items-center gap-1 font-bold">
                <ArrowUpRight size={10} /> +12%
              </span>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{card.name}</p>
              <h3 className="text-2xl font-bold mt-1">
                {card.isCurrency 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)
                  : card.value
                }
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Desempenho Semanal</h3>
            <select className="bg-black border border-white/10 rounded-lg text-xs px-3 py-1 outline-hidden text-white">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="vendas" stroke="#f59e0b" fillOpacity={1} fill="url(#colorVendas)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock & Alerts */}
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Alertas de Estoque
          </h3>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500">Restam apenas {item.stock} unidades</p>
                  </div>
                  <button className="cursor-pointer text-xs text-amber-500 font-bold border border-amber-500/20 px-3 py-1 rounded-lg hover:bg-amber-500 hover:text-black transition-all">
                    Repor
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 text-sm italic">Estoque em dia.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Appointments */}
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Clock size={20} className="text-amber-500" />
            Próximos Agendamentos
          </h3>
          <div className="space-y-4">
             {nextAppointments.length > 0 ? (
               nextAppointments.map((app: any) => (
                 <div key={app.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-bold">
                        {app.customerName ? app.customerName[0] : 'C'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{app.customerName}</h4>
                        <p className="text-[10px] text-zinc-500">{app.serviceName} - {app.vehicle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{app.time}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{app.date}</p>
                    </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-12">
                 <p className="text-zinc-500 text-sm italic">Nenhum agendamento para hoje.</p>
               </div>
             )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <DollarSign size={20} className="text-green-500" />
            Últimas Vendas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-zinc-500 border-b border-white/5">
                <tr>
                  <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Cliente</th>
                  <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Valor</th>
                  <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Data</th>
                  <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentSales.length > 0 ? (
                  recentSales.map((sale: any) => (
                    <tr key={sale.id} className="group">
                      <td className="py-4 font-bold text-white">{sale.customerName || 'Cliente Balcão'}</td>
                      <td className="py-4 text-amber-500 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total)}
                      </td>
                      <td className="py-4 text-zinc-500">{sale.date}</td>
                      <td className="py-4">
                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-bold uppercase">
                          Pago
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-zinc-500 italic">
                      Nenhuma venda registrada recentemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}