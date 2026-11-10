'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  FileText,
  DollarSign,
  Loader2,
  CheckCircle2,
  Sliders,
  X,
  Filter
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
import { generateReluzReportPDF, ReportCategoryData } from '@/lib/report-generator';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados de data específica (De uma data para outra em 2026)
  const [dataInicio, setDataInicio] = useState('2026-01-01');
  const [dataFim, setDataFim] = useState('2026-11-10');
  const [configTipo, setConfigTipo] = useState<'completo' | 'financeiro' | 'operacional'>('completo');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Lavagens',
    'Estética Interna',
    'Polimento/Vitrificação',
    'Venda de Produtos'
  ]);

  const data = [
    { name: 'Jan', valor: 14000 },
    { name: 'Fev', valor: 16000 },
    { name: 'Mar', valor: 19000 },
    { name: 'Abr', valor: 17000 },
    { name: 'Mai', valor: 24000 },
    { name: 'Jun', valor: 26000 },
    { name: 'Jul', valor: 28000 },
    { name: 'Ago', valor: 31000 },
    { name: 'Set', valor: 33000 },
    { name: 'Out', valor: 37000 },
    { name: 'Nov', valor: 42000 },
  ];

  const categories: (ReportCategoryData & { color: string })[] = [
    { name: 'Lavagens', value: 45, color: 'bg-blue-500', desc: 'Ducha, expressa, técnica e detalhada' },
    { name: 'Estética Interna', value: 25, color: 'bg-amber-500', desc: 'Higienização, hidratação de couro e plásticos' },
    { name: 'Polimento/Vitrificação', value: 20, color: 'bg-purple-500', desc: 'Correção de pintura, cristalização e cerâmica' },
    { name: 'Venda de Produtos', value: 10, color: 'bg-green-500', desc: 'Ceras, microfibras, aromatizantes e acessórios' },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatPeriodoLabel = (start: string, end: string) => {
    const formatBr = (d: string) => {
      const parts = d.split('-');
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
    };
    return `${formatBr(start)} até ${formatBr(end)}`;
  };

  const applyPreset = (preset: 'mes-atual' | 'ultimos-30' | 'semestre1' | 'semestre2' | 'ano-2026') => {
    if (preset === 'mes-atual') {
      setDataInicio('2026-11-01');
      setDataFim('2026-11-10');
    } else if (preset === 'ultimos-30') {
      setDataInicio('2026-10-11');
      setDataFim('2026-11-10');
    } else if (preset === 'semestre1') {
      setDataInicio('2026-01-01');
      setDataFim('2026-06-30');
    } else if (preset === 'semestre2') {
      setDataInicio('2026-07-01');
      setDataFim('2026-11-10');
    } else if (preset === 'ano-2026') {
      setDataInicio('2026-01-01');
      setDataFim('2026-11-10');
    }
  };

  const handleExportQuickPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = await generateReluzReportPDF(data, categories, {
        dataInicio,
        dataFim,
        tipo: 'completo',
      });
      setSuccessMessage(`Relatório "${fileName}" baixado com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Erro ao gerar relatório em PDF:', err);
      alert('Houve um erro ao gerar o PDF. Verifique o console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCustomPDF = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, informe a Data Inicial e a Data Final.');
      return;
    }
    if (dataInicio > dataFim) {
      alert('A Data Inicial não pode ser maior que a Data Final.');
      return;
    }

    setIsExporting(true);
    try {
      const fileName = await generateReluzReportPDF(data, categories, {
        dataInicio,
        dataFim,
        tipo: configTipo,
        categorias: selectedCategories,
      });
      setShowConfigModal(false);
      setSuccessMessage(`Relatório "${fileName}" gerado com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Erro ao gerar relatório customizado:', err);
      alert('Houve um erro ao gerar o PDF customizado.');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleCategory = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length === 1) return; // Mantém pelo menos uma
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast de sucesso */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-black px-5 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-amber-500/30 animate-bounce">
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Relatórios Gerenciais</h1>
          <p className="text-zinc-500">Analise o crescimento e a saúde financeira da Reluz em 2026.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowConfigModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 font-medium py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-sm"
          >
            <Calendar size={16} className="text-amber-500" />
            <span>Período: <strong className="text-white">{formatPeriodoLabel(dataInicio, dataFim)}</strong></span>
          </button>
          <button 
            onClick={handleExportQuickPDF}
            disabled={isExporting}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 text-sm"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Gerando PDF...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Exportar PDF</span>
              </>
            )}
          </button>
        </div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl">Faturamento 2026</h3>
            <p className="text-zinc-500 text-xs">Desempenho financeiro do ano corrente</p>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
            <Calendar size={14} className="text-amber-500" />
            <span className="text-xs text-zinc-300 font-medium">Jan 2026 - Nov 2026</span>
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
             {categories.map((item) => (
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
             <button 
               onClick={() => setShowConfigModal(true)}
               className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
             >
               <Sliders size={18} className="text-amber-500" />
               Configurar Relatório
             </button>
           </div>
        </div>
      </div>

      {/* Modal de Configurar Relatório */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-amber-500" />
                <h3 className="font-bold text-lg">Configurar Relatório PDF</h3>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Seleção de Data Específica (De -> Até) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-500" />
                    Intervalo de Datas (2026)
                  </label>
                  <span className="text-xs text-amber-500 font-bold">
                    {formatPeriodoLabel(dataInicio, dataFim)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">De (Data Inicial)</label>
                    <input 
                      type="date"
                      value={dataInicio}
                      max={dataFim}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-500 outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Até (Data Final)</label>
                    <input 
                      type="date"
                      value={dataFim}
                      min={dataInicio}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-500 outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Atalhos rápidos para o ano de 2026 */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPreset('mes-atual')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Mês Atual (Nov/26)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('ultimos-30')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Últimos 30 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('semestre2')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    2º Semestre 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('semestre1')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    1º Semestre 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('ano-2026')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Ano Completo 2026
                  </button>
                </div>
              </div>

              {/* Tipo de Relatório */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Tipo de Relatório</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'completo', label: 'Completo' },
                    { id: 'financeiro', label: 'Financeiro' },
                    { id: 'operacional', label: 'Serviços' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setConfigTipo(t.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        configTipo === t.id
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categorias a Incluir */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Categorias a Incluir</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => toggleCategory(cat.name)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                            : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/10'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExportCustomPDF}
                disabled={isExporting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Gerar PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}