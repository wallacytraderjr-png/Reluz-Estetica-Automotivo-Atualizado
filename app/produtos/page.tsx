'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Filter, Tag, Check, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['Todos', 'Limpeza', 'Proteção', 'Acessórios', 'Outros'];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    
    // Initial cart count from localstorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'Todos' || p.category === category;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [addedItem, setAddedItem] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((item: any) => item.id === product.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      const newCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(newCount);
      
      // Dispatch event for Navbar
      window.dispatchEvent(new Event('cart-updated'));
      
      // Show feedback
      setAddedItem(product.name);
      setTimeout(() => setAddedItem(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-2 text-sm">Loja Reluz</h2>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Produtos Exclusivos</h1>
            <p className="text-zinc-500 mt-2">Leve a qualidade profissional da Reluz para sua garagem.</p>
          </div>
          
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full bg-zinc-900 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-hidden focus:border-amber-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                category === cat 
                ? 'bg-amber-500 text-black' 
                : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:border-amber-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 flex flex-col hover:border-amber-500/20 transition-all"
                >
                  <div className="relative h-64 overflow-hidden bg-zinc-800">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                       <span className="bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-zinc-400 px-3 py-1 rounded-full border border-white/10">
                        {product.category}
                      </span>
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter animate-pulse">
                          Últimas Unidades
                        </span>
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-4 py-2 rounded-full uppercase border border-white/10">
                          Esgotado
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-1 leading-tight">{product.name}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-2 mb-4">{product.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-amber-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-medium">Estoque: {product.stock}</span>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          product.stock === 0
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-amber-500 group/btn'
                        }`}
                      >
                        <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-32 space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
              <Filter className="text-zinc-700" size={32} />
            </div>
            <h3 className="text-xl font-bold">Nenhum produto encontrado</h3>
            <p className="text-zinc-500 max-w-xs mx-auto">Tente ajustar seus filtros ou termos de pesquisa.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('Todos');}}
              className="text-amber-500 text-sm font-bold border-b border-amber-500 pb-1"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Cart Floating Button (Mobile or when item added) */}
        {cartCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-8 right-8 z-50 md:hidden"
          >
            <Link 
              href="/carrinho"
              className="bg-amber-500 text-black w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-amber-500">
                {cartCount}
              </span>
            </Link>
          </motion.div>
        )}
        {/* Toast Notification */}
        <AnimatePresence>
          {addedItem && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap"
            >
              <Check size={20} />
              {addedItem} adicionado ao carrinho!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
