'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal; // Shipping could be added here

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/produtos" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Loja
        </Link>

        <h1 className="text-4xl font-bold tracking-tighter mb-12">Seu Carrinho</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
            <ShoppingBag className="mx-auto text-zinc-800 mb-6" size={64} />
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Explore nossos produtos e leve o melhor para o seu carro.</p>
            <Link 
              href="/produtos" 
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-10 rounded-full transition-all inline-block"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-zinc-900 rounded-2xl border border-white/5"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-amber-500 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-zinc-400 hover:text-white transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-zinc-400 hover:text-white transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-center sm:text-right min-w-[100px]">
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Subtotal</p>
                      <p className="font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5 sticky top-32">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-amber-500" />
                  Resumo do Pedido
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Frete</span>
                    <span className="text-green-500 font-medium">Grátis</span>
                  </div>
                  <div className="h-px bg-white/5 my-4"></div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
                >
                  Finalizar Compra
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="text-[10px] text-center text-zinc-500 mt-6 uppercase tracking-widest font-medium">
                  Pagamento 100% Seguro via Mercado Pago
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
