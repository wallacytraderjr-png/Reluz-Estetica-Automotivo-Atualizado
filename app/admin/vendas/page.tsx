'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, ShoppingBag, X, Save, Wrench, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Sale {
  id: string;
  clientName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do Modal de Venda
  const [saleType, setSaleType] = useState<'service' | 'product'>('service');
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  
  // Seleções
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customTotal, setCustomTotal] = useState('');

  useEffect(() => {
    fetchSales();
    fetchCatalog();
  }, []);

  async function fetchSales() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sales');
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setSales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setSales([]);
    }
    setLoading(false);
  }

  async function fetchCatalog() {
    try {
      // Busca serviços cadastrados
      const servRes = await fetch('/api/services').catch(() => null);
      const servText = servRes ? await servRes.text() : '';
      const servData = servText ? JSON.parse(servText) : [];
      setServices(Array.isArray(servData) && servData.length > 0 ? servData : [
        { id: '1', name: 'Lavagem Simples', price: 50 },
        { id: '2', name: 'Lavagem Detalhada', price: 120 },
        { id: '3', name: 'Higienização Interna', price: 200 },
        { id: '4', name: 'Polimento Técnico', price: 450 },
        { id: '5', name: 'Vitrificação', price: 1200 }
      ]);

      // Busca produtos reais cadastrados na tabela products do SQLite
      const prodRes = await fetch('/api/admin/products').catch(() => null);
      const prodText = prodRes ? await prodRes.text() : '';
      const prodData = prodText ? JSON.parse(prodText) : [];
      
      if (Array.isArray(prodData) && prodData.length > 0) {
        // Filtra para garantir que apenas os produtos principais da loja apareçam limpos
        setProducts(prodData);
      } else {
        setProducts([
          { id: 'p1', name: 'Cera Ceramic Pro Vonixx', price: 149.90, stock: 15 },
          { id: 'p2', name: 'Shampoo Automotivo High Tech', price: 59.90, stock: 25 }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
      setProducts([
        { id: 'p1', name: 'Cera Ceramic Pro Vonixx', price: 149.90, stock: 15 },
        { id: 'p2', name: 'Shampoo Automotivo High Tech', price: 59.90, stock: 25 }
      ]);
    }
  }

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    const serv = services.find(s => s.id === id || s.name === id);
    if (serv) {
      setCustomTotal(String(serv.price));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setCustomTotal(String(prod.price * quantity));
    }
  };

  const handleCreateSale = async () => {
    if (!clientName) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    let itemName = '';
    let totalVal = Number(customTotal || 0);

    if (saleType === 'service') {
      const serv = services.find(s => s.id === selectedServiceId || s.name === selectedServiceId);
      itemName = serv ? serv.name : 'Serviço Automotivo';
    } else {
      const prod = products.find(p => p.id === selectedProductId);
      if (!prod) {
        alert('Selecione um produto válido.');
        return;
      }
      itemName = `${prod.name} (${quantity} un.)`;
      totalVal = prod.price * quantity;
    }

    if (totalVal <= 0) {
      alert('O valor total da venda deve ser maior que zero.');
      return;
    }

    try {
      const res = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          items: itemName,
          paymentMethod,
          total: totalVal,
          type: saleType,
          productId: selectedProductId,
          quantity
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setClientName('');
        setSelectedServiceId('');
        setSelectedProductId('');
        setQuantity(1);
        setCustomTotal('');
        fetchSales();
        fetchCatalog();
      } else {
        alert('Erro ao registar venda.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  const totalFaturamento = sales.reduce((acc, s) => acc + Number(s.total || 0), 0);
  const totalServicos = sales.filter(s => !s.items.includes('un.') && !s.id.includes('PROD')).reduce((acc, s) => acc + Number(s.total || 0), 0);
  const totalProdutos = totalFaturamento - totalServicos;

  const filteredSales = sales.filter(s =>
    (s.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Vendas e Financeiro</h1>
          <p className="text-zinc-500">Controle o faturamento da Reluz.</p>
        </div>
        <button
          onClick={() => {
            fetchCatalog();
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={20} />
          Nova Venda (Balcão)
        </button>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Faturamento Total</p>
          <h3 className="text-2xl font-bold mt-2 text-amber-500">{formatCurrency(totalFaturamento)}</h3>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Serviços</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{formatCurrency(totalServicos > 0 ? totalServicos : totalFaturamento)}</h3>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Produtos</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{formatCurrency(totalProdutos > 0 ? totalProdutos : 0)}</h3>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          placeholder="Pesquisar venda por ID ou cliente..."
          className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-amber-500 outline-none text-white"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            Nenhuma venda encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  <th className="p-6">ID / Data</th>
                  <th className="p-6">Cliente</th>
                  <th className="p-6">Itens</th>
                  <th className="p-6">Pagamento</th>
                  <th className="p-6">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-bold">
                      <span className="text-white">{sale.id}</span>
                      <span className="block text-xs text-zinc-500 font-normal">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-6 font-medium text-zinc-200">
                      <span className="block text-white font-semibold">{sale.clientName}</span>
                      {sale.customerEmail && (
                        <span className="block text-xs text-zinc-400">{sale.customerEmail}</span>
                      )}
                      {sale.customerPhone && (
                        <span className="block text-[11px] text-amber-500/80">{sale.customerPhone}</span>
                      )}
                    </td>
                    <td className="p-6 text-zinc-400">{sale.items}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-amber-500">{formatCurrency(sale.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Venda com Abas */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Registar Nova Venda (Balcão)</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Abas Servicos / Produtos */}
                <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => { setSaleType('service'); setSelectedProductId(''); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      saleType === 'service' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Wrench size={16} />
                    Serviços
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSaleType('product'); setSelectedServiceId(''); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      saleType === 'product' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Package size={16} />
                    Produtos (Estoque)
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome do Cliente</label>
                    <input
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                    />
                  </div>

                  {saleType === 'service' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Selecionar Serviço Habilitado</label>
                      <select
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                        value={selectedServiceId}
                        onChange={e => handleSelectService(e.target.value)}
                      >
                        <option value="">Selecione um serviço...</option>
                        {services.map((s) => (
                          <option key={s.id || s.name} value={s.id || s.name}>
                            {s.name} - R$ {s.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Produto com Estoque</label>
                        <select
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                          value={selectedProductId}
                          onChange={e => handleSelectProduct(e.target.value)}
                        >
                          <option value="">Selecione o produto...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Disp: {p.stock} un.) - R$ {Number(p.price).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Qtd</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                          value={quantity}
                          onChange={e => {
                            const qty = Math.max(1, Number(e.target.value));
                            setQuantity(qty);
                            const prod = products.find(p => p.id === selectedProductId);
                            if (prod) setCustomTotal(String(prod.price * qty));
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Valor Total (R$)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                        value={customTotal}
                        onChange={e => setCustomTotal(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Forma de Pagamento</label>
                      <select
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                      >
                        <option value="Pix">Pix</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Cartão de Débito">Cartão de Débito</option>
                        <option value="Dinheiro">Dinheiro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSale}
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Save size={20} />
                    Finalizar Venda
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}