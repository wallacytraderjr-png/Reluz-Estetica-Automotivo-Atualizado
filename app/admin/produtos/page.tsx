'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const method = currentProduct.id ? 'PUT' : 'POST';
    const response = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProduct),
    });

    if (response.ok) {
      setIsModalOpen(false);
      fetchProducts();
    } else {
      alert('Erro ao guardar o produto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchProducts();
    }
  };

  const openModal = (product: Product | null = null) => {
    setCurrentProduct(product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Limpeza',
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gerenciamento de Produtos</h1>
          <p className="text-zinc-500">Cadastre e controle o estoque da sua loja.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por nome ou categoria..."
              className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-hidden focus:border-amber-500 transition-all text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold bg-black/20">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 relative flex-shrink-0 border border-white/5 flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-zinc-600"><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-bold text-sm text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-300 bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${Number(p.stock) <= 5 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(p)}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && currentProduct && (
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
              className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">{currentProduct.id ? 'Editar Produto' : 'Novo Produto'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome do Produto</label>
                    <input
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-white"
                      value={currentProduct.name || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Categoria</label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-white"
                      value={currentProduct.category || 'Limpeza'}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    >
                      <option value="Limpeza">Limpeza</option>
                      <option value="Proteção">Proteção</option>
                      <option value="Acessórios">Acessórios</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Descrição</label>
                    <textarea
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-white"
                      value={currentProduct.description || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-amber-500 font-bold"
                      value={currentProduct.price || 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Estoque</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-white"
                      value={currentProduct.stock || 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">URL da Imagem</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-white"
                      value={currentProduct.imageUrl || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                    />
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
                    type="submit"
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Save size={20} />
                    Salvar Produto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}