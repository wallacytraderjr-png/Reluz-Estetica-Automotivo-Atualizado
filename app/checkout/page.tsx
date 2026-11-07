'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { CreditCard, ShoppingBag, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
    if (cart.length === 0 && !success) {
      router.push('/produtos');
    }
  }, [router, success]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setLoading(false);
    }, 2000);
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-zinc-900 p-12 rounded-3xl border border-white/5 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Pedido Realizado!</h1>
          <p className="text-zinc-500">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>
          <p className="text-amber-500 font-bold">Número do Pedido: #RELUZ-{Math.floor(1000 + 5000)}</p>
          <div className="pt-6">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl transition-all"
            >
              Voltar para a Loja
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tighter mb-12">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard size={20} className="text-amber-500" />
                Pagamento Seguro
              </h3>
              
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm">Escolha sua forma de pagamento preferida através do Mercado Pago:</p>
                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 rounded-2xl border border-white/10 bg-black flex items-center justify-between hover:border-amber-500 transition-all">
                    <span className="font-bold">PIX (5% de desconto)</span>
                    <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded">RÁPIDO</span>
                  </button>
                  <button className="p-4 rounded-2xl border border-white/10 bg-black flex items-center justify-between hover:border-amber-500 transition-all">
                    <span className="font-bold">Cartão de Crédito</span>
                    <span className="text-zinc-500 text-[10px] font-bold">ATÉ 12X</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-4">
                <ShieldCheck className="text-amber-500 flex-shrink-0" size={20} />
                <p className="text-[10px] text-amber-500/80 leading-relaxed uppercase tracking-wider font-medium">
                  Seus dados estão protegidos por criptografia de ponta a ponta. Não armazenamos informações de cartão em nossos servidores.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-lg shadow-xl shadow-amber-500/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Pagar'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5 h-fit">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-400">
                <ShoppingBag size={20} />
                Resumo
              </h3>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex gap-3 items-center">
                      <span className="w-6 h-6 bg-black rounded flex items-center justify-center text-[10px] font-bold text-zinc-500">{item.quantity}x</span>
                      <span className="text-zinc-300 truncate max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/5 my-6"></div>
              <div className="flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-amber-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
