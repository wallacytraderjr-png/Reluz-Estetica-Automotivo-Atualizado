'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Lock, 
  MapPin, 
  Phone, 
  Clock, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Globe,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'perfil', name: 'Perfil e Conta', icon: User },
    { id: 'loja', name: 'Dados da Loja', icon: MapPin },
    { id: 'seguranca', name: 'Segurança', icon: Lock },
    { id: 'notificacoes', name: 'Notificações', icon: Bell },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Configurações</h1>
        <p className="text-zinc-500">Gerencie as informações da sua empresa e do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="bg-zinc-900 p-4 rounded-3xl border border-white/5 h-fit space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-amber-500 text-black' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">
            <form onSubmit={handleSave}>
              <div className="p-8 space-y-8">
                {activeTab === 'perfil' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold">Informações do Administrador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Usuário de Acesso</label>
                        <input className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" defaultValue="adm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">E-mail de Recuperação</label>
                        <input className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" defaultValue="wallacytraderjr@gmail.com" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'loja' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold">Dados Públicos da Reluz</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Telefone / WhatsApp</label>
                        <input className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" defaultValue="(79) 98859-4996" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Endereço Completo</label>
                        <input className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" defaultValue="Rua Siriri, nº 90, Centro, Aracaju – SE" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Horário de Funcionamento</label>
                        <input className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" defaultValue="Seg-Sex: 08h às 18h | Sáb: 08h às 13h" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'seguranca' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold">Alterar Senha</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Senha Atual</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nova Senha</label>
                        <input type="password" placeholder="Mínimo 6 caracteres" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Confirmar Nova Senha</label>
                        <input type="password" placeholder="Digite novamente" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notificacoes' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold">Alertas e Notificações</h3>
                    <div className="space-y-4">
                       {[
                         { id: 'n1', name: 'Novo agendamento por e-mail', active: true },
                         { id: 'n2', name: 'Aviso de estoque baixo no dashboard', active: true },
                         { id: 'n3', name: 'Relatório mensal automático', active: false },
                         { id: 'n4', name: 'Confirmação de venda realizada', active: true },
                       ].map((n) => (
                         <div key={n.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                            <span className="text-sm font-medium">{n.name}</span>
                            <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${n.active ? 'bg-amber-500' : 'bg-zinc-800'}`}>
                               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${n.active ? 'right-1' : 'left-1'}`}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-8 border-t border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <AlertCircle size={14} />
                  Algumas alterações podem exigir que você entre novamente no sistema.
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {success && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-500 font-bold text-sm mr-4">
                      <CheckCircle2 size={18} /> Salvo!
                    </motion.div>
                  )}
                  <button
                    disabled={loading}
                    className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 p-8 rounded-3xl bg-linear-to-br from-zinc-900 to-black border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="font-bold">Backup do Sistema</h4>
                <p className="text-zinc-500 text-xs italic">Último backup realizado hoje às 12:45</p>
              </div>
            </div>
            <button className="text-amber-500 font-bold text-sm border-b border-amber-500 pb-0.5 hover:text-amber-400 transition-colors">
              Fazer backup manual agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
