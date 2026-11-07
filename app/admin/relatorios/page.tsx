'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);

  const data = [
    { name: 'Jan', valor: 12000 },
    { name: 'Fev', valor: 15000 },
    { name: 'Mar', valor: 18000 },
    { name: 'Abr', valor: 14000 },
    { name: 'Mai', valor: 22000 },
    { name: 'Jun', valor: 25000 },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Relatórios Gerenciais</h1>
          <p className="text-zinc-500">Analise o crescimento e a saúde financeira da Reluz.</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
          <Download size={20} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 space-y-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Ticket Médio</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">R$ 245,00</h3>
            <span className="text-xs text-green-500 font-bold">+5%</span>
          </div>
        </div>
        <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 space-y-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Crescimento Mensal</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">18.4%</h3>
            <span className="text-xs text-green-500 font-bold">+2.1%</span>
          </div>
        </div>
        <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 space-y-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Taxa de Conversão</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">64%</h3>
            <span className="text-xs text-zinc-500 font-bold">Estável</span>
          </div>
        </div>
        <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 space-y-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Satisfação (NPS)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">98</h3>
            <span className="text-xs text-amber-500 font-bold">Excelente</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">Faturamento Semestral</h3>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-zinc-500" />
            <span className="text-xs text-zinc-500">Jan 2024 - Jun 2024</span>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
              <Tooltip 
                 cursor={{fill: '#ffffff05'}}
                 contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                 itemStyle={{ color: '#f59e0b' }}
              />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#f59e0b' : '#3f3f46'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-bold text-lg">Distribuição por Categoria</h3>
          <div className="space-y-4">
             {[
               { name: 'Lavagens', value: 45, color: 'bg-blue-500' },
               { name: 'Estética Interna', value: 25, color: 'bg-amber-500' },
               { name: 'Polimento/Vitrificação', value: 20, color: 'bg-purple-500' },
               { name: 'Venda de Produtos', value: 10, color: 'bg-green-500' },
             ].map((item) => (
               <div key={item.name} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">{item.name}</span>
                    <span>{item.value}%</span>
                 </div>
                 <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col justify-center text-center">
           <BarChart3 className="mx-auto text-amber-500 mb-4" size={48} />
           <h3 className="font-bold text-xl">Relatórios Personalizados</h3>
           <p className="text-zinc-500 text-sm max-w-xs mx-auto">Gere relatórios detalhados por período, funcionário ou categoria de serviço.</p>
           <div className="pt-6">
             <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl font-bold transition-all">
               Configurar Relatório
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
