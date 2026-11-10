'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Store, 
  Truck, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle,
  Banknote
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const router = useRouter();

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryType: 'pickup', // 'pickup' ou 'delivery'
    address: '',
    paymentMethod: 'Pix' // 'Pix', 'Cartão de Crédito', 'Pagar na Retirada'
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
    if (cart.length === 0 && !success) {
      router.push('/produtos');
    }
  }, [router, success]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Se for PIX, oferece 5% de desconto
  const isPix = formData.paymentMethod === 'Pix';
  const discount = isPix ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Por favor, digite um e-mail válido para receber a confirmação do pedido.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Por favor, informe seu telefone ou WhatsApp para contato.');
      return;
    }
    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      alert('Por favor, preencha o endereço completo para a entrega.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            deliveryType: formData.deliveryType,
            address: formData.address
          },
          items,
          paymentMethod: formData.paymentMethod,
          total
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar compra.');
      }

      setCompletedOrder(data);
      setSuccess(true);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      alert(error.message || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'pix' | 'order') => {
    navigator.clipboard.writeText(text);
    if (type === 'pix') {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    } else {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 3000);
    }
  };

  // Tela de Sucesso
  if (success && completedOrder) {
    const pixKey = completedOrder.pixKey || '79988594996';
    const orderId = completedOrder.orderId || '#RELUZ-6000';

    return (
      <div className="pt-32 pb-24 bg-black min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-zinc-900/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl"
        >
          {/* Ícone de Sucesso */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
            <CheckCircle2 size={42} />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Compra Confirmada
            </span>
            <h1 className="text-3xl font-bold tracking-tighter text-white mt-3">Pedido Realizado!</h1>
            
            {/* Número do Pedido com botão de copiar */}
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-amber-500 font-mono font-bold text-sm">Pedido: {orderId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(orderId, 'order')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Copiar número do pedido"
              >
                {copiedOrderId ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Destaque do E-mail */}
          <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-left flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl mt-0.5">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Confirmação enviada para:</p>
              <p className="text-sm font-bold text-white break-all">{formData.email}</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Enviamos os detalhes do pedido e o recibo de compra para o seu e-mail.
              </p>
            </div>
          </div>

          {/* Se a opção foi PIX, exibe Chave Pix */}
          {formData.paymentMethod === 'Pix' && (
            <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/20 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1.5">
                  <QrCode size={16} /> Pagamento via PIX
                </span>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                  5% Desconto Aplicado
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Pague pelo aplicativo do seu banco usando a Chave PIX (Telefone) da Reluz:
              </p>
              <div className="flex items-center gap-2 bg-black/80 p-3 rounded-xl border border-white/10">
                <span className="font-mono text-sm text-white font-bold flex-1 select-all">{pixKey}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pixKey, 'pix')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPix ? (
                    <>
                      <Check size={14} /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copiar Chave
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Favorecido: <strong className="text-zinc-200">Reluz Estética Automotiva</strong> • Chave: <strong className="text-amber-500">79988594996</strong>
              </p>
              <p className="text-[11px] text-zinc-400">
                Valor total: <strong className="text-amber-500 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</strong>
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="space-y-3 pt-2">
            {completedOrder.whatsappLink && (
              <a
                href={completedOrder.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-green-600/20 text-sm"
              >
                <MessageCircle size={18} />
                Confirmar Pedido via WhatsApp
              </a>
            )}

            <button 
              onClick={() => router.push('/produtos')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-sm border border-white/5"
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
        <Link href="/carrinho" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors mb-8 group text-sm">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Carrinho
        </Link>

        <h1 className="text-4xl font-bold tracking-tighter mb-10">Finalizar Compra</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-7 space-y-6">
            {/* Seção 1: Identificação do Cliente */}
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <User size={18} className="text-amber-500" />
                Dados do Comprador
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                    Nome Completo *
                  </label>
                  <input
                    required
                    placeholder="Seu nome completo"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1 flex items-center justify-between">
                    <span>E-mail para Confirmação *</span>
                    <span className="text-amber-500/80 font-normal normal-case">Receberá comprovante</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      placeholder="(79) 98888-8888"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Forma de Recebimento */}
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Store size={18} className="text-amber-500" />
                Entrega ou Retirada
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.deliveryType === 'pickup'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-black hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Store size={16} className={formData.deliveryType === 'pickup' ? 'text-amber-500' : 'text-zinc-500'} />
                    <span className="font-bold text-sm text-white">Retirar na Loja</span>
                  </div>
                  <p className="text-xs text-zinc-400">Grátis • Pronto para retirada na Reluz</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'delivery' })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.deliveryType === 'delivery'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-black hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck size={16} className={formData.deliveryType === 'delivery' ? 'text-amber-500' : 'text-zinc-500'} />
                    <span className="font-bold text-sm text-white">Entrega em Domicílio</span>
                  </div>
                  <p className="text-xs text-zinc-400">Receba no seu endereço</p>
                </button>
              </div>

              {formData.deliveryType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5 pt-2"
                >
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                    Endereço Completo (Rua, Número, Bairro, Cidade) *
                  </label>
                  <div className="relative">
                    <input
                      required
                      placeholder="Ex: Rua A, 123, Bairro Centro - Aracaju/SE"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Seção 3: Forma de Pagamento */}
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <CreditCard size={18} className="text-amber-500" />
                Forma de Pagamento
              </h3>

              <div className="space-y-2.5">
                {/* Opção PIX */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Pix' })}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    formData.paymentMethod === 'Pix'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-black hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.paymentMethod === 'Pix' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      <QrCode size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">PIX</span>
                      <span className="text-xs text-zinc-400">Aprovação imediata</span>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-green-500/30">
                    5% DE DESCONTO
                  </span>
                </button>

                {/* Detalhes da Chave PIX caso selecionado */}
                {formData.paymentMethod === 'Pix' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-black/80 rounded-2xl border border-amber-500/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                        <QrCode size={14} /> Chave PIX da Reluz
                      </span>
                      <span className="text-[11px] text-zinc-400">Tipo: Telefone / WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-white/10">
                      <span className="font-mono text-sm text-white font-bold flex-1 select-all">79988594996</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('79988594996', 'pix')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedPix ? (
                          <>
                            <Check size={14} /> Copiada!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copiar Chave
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Favorecido: <strong className="text-zinc-200">Reluz Estética Automotiva</strong> • Chave: <strong className="text-amber-500">79988594996</strong>
                    </p>
                  </motion.div>
                )}

                {/* Opção Cartão */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Cartão de Crédito' })}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    formData.paymentMethod === 'Cartão de Crédito'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-black hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.paymentMethod === 'Cartão de Crédito' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Cartão de Crédito</span>
                      <span className="text-xs text-zinc-400">Em até 12x</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 text-xs font-semibold">Online / Maquininha</span>
                </button>

                {/* Opção Pagar na Retirada/Entrega */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Pagar na Retirada' })}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    formData.paymentMethod === 'Pagar na Retirada'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-black hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.paymentMethod === 'Pagar na Retirada' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      <Banknote size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Pagar no Recebimento</span>
                      <span className="text-xs text-zinc-400">Dinheiro ou Cartão</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 text-xs font-semibold">Balcão</span>
                </button>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-3.5">
                <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-amber-500/90 leading-relaxed font-medium">
                  Compra 100% segura. Seus dados cadastrais e de pagamento são protegidos com sigilo e criptografia.
                </p>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido Lateral */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-white/5 sticky top-32 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <ShoppingBag size={18} className="text-amber-500" />
                Resumo do Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
              </h3>

              {/* Lista dos Itens */}
              <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm gap-3 py-1">
                    <div className="flex gap-3 items-center min-w-0">
                      <span className="w-6 h-6 bg-black rounded-lg flex items-center justify-center text-[10px] font-bold text-amber-500 shrink-0 border border-white/10">
                        {item.quantity}x
                      </span>
                      <span className="text-zinc-300 truncate text-xs">{item.name}</span>
                    </div>
                    <span className="font-bold text-white shrink-0 text-xs">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/5 my-2"></div>

              {/* Totais */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                </div>

                {isPix && (
                  <div className="flex justify-between text-green-400 text-xs font-semibold">
                    <span>Desconto PIX (5%)</span>
                    <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Frete / Retirada</span>
                  <span className="text-green-500 font-bold uppercase text-[10px]">Grátis</span>
                </div>

                <div className="h-px bg-white/10 my-3"></div>

                <div className="flex justify-between items-baseline text-white">
                  <span className="text-base font-bold">Total a Pagar</span>
                  <span className="text-2xl font-bold text-amber-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-base shadow-xl shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processando Pedido...
                  </>
                ) : (
                  'Confirmar e Finalizar Pedido'
                )}
              </button>

              <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                Ao finalizar, você concorda com nossos{' '}
                <Link href="/termos" target="_blank" className="text-amber-500 hover:underline">
                  Termos
                </Link>{' '}
                e{' '}
                <Link href="/privacidade" target="_blank" className="text-amber-500 hover:underline">
                  Privacidade
                </Link>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
