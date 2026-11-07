'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para o formulário da nova venda de balcão
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [total, setTotal] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSales(data);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale = {
      id: `VEND-${Math.floor(100 + Math.random() * 900)}`,
      customerName: customerName || 'Cliente Balcão',
      customerEmail: 'balcao@reluz.com',
      items: [{ name: productName || 'Serviço/Produto Geral', quantity: 1, price: parseFloat(total) || 0 }],
      total: parseFloat(total) || 0,
      status: 'Concluído',
      createdAt: new Date().toISOString()
    };

    setSales([newSale, ...sales]);
    setIsModalOpen(false);
    setCustomerName('');
    setProductName('');
    setTotal('');
  };

  const filteredSales = sales.filter((s: any) => {
    const name = s.customerName || '';
    const id = s.id || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.total || 0), 0);

  return (
    <div className="p-8 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendas e Financeiro</h1>
          <p className="text-zinc-400 text-sm">Controle o faturamento da Reluz.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          + Nova Venda (Balcão)
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">FATURAMENTO TOTAL</p>
          <p className="text-2xl font-bold text-amber-500">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">SERVIÇOS</p>
          <p className="text-2xl font-bold">R$ 0,00</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">PRODUTOS</p>
          <p className="text-2xl font-bold">R$ 0,00</p>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Pesquisar venda por ID ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-full max-w-md text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
              <th className="p-4">ID / DATA</th>
              <th className="p-4">CLIENTE</th>
              <th className="p-4">ITENS</th>
              <th className="p-4">PAGAMENTO</th>
              <th className="p-4">TOTAL</th>
              <th className="p-4">AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 text-sm">
                  <td className="p-4 font-mono">
                    <div>{sale.id}</div>
                    <div className="text-xs text-zinc-500">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                    </div>
                  </td>
                  <td className="p-4">{sale.customerName}</td>
                  <td className="p-4">{sale.items?.length || 1} item(ns)</td>
                  <td className="p-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs">Pago</span></td>
                  <td className="p-4 font-bold text-amber-500">
                    R$ {(sale.total || 0).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4 text-zinc-400">&gt;</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Nenhuma venda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nova Venda Balcão */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Venda (Balcão)</h2>
            <form onSubmit={handleCreateSale} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Produto / Serviço</label>
                <input
                  type="text"
                  placeholder="Ex: Lavagem Detalhada"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Concluir Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}