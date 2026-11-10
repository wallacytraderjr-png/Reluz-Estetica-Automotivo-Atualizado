'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  X, 
  Save, 
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const handleSaveDirect = async () => {
    if (!currentService || !currentService.name) {
      alert('Por favor, preencha pelo menos o nome do serviço.');
      return;
    }

    const payload = {
      id: currentService.id,
      name: currentService.name,
      description: currentService.description || 'Serviço automotivo profissional.',
      price: Number(currentService.price) || 0,
      imageUrl: currentService.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      active: currentService.active !== false
    };

    const method = payload.id ? 'PUT' : 'POST';

    try {
      const response = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert('Erro ao salvar no servidor.');
      }
    } catch (err) {
      console.error('Erro de rede:', err);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          imageUrl: service.imageUrl,
          active: !service.active 
        }),
      });
      fetchServices();
    } catch (error) {
      console.error('Erro ao alternar estado:', error);
    }
  };

  const openModal = (service: Service | null = null) => {
    setCurrentService(service || {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      active: true
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gerenciamento de Serviços</h1>
          <p className="text-zinc-500">Cadastre e configure os serviços oferecidos.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : services.map((s) => (
          <motion.div
            key={s.id}
            layout
            className={`p-6 rounded-3xl border ${s.active ? 'bg-zinc-900 border-white/5' : 'bg-zinc-950 border-white/5 opacity-60'} space-y-4 group`}
          >
            <div className="relative h-40 rounded-2xl overflow-hidden bg-zinc-800">
               {s.imageUrl && (
                 <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
               )}
               <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => openModal(s)}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-amber-500 transition-all border border-white/10 cursor-pointer"
                    title="Editar Serviço"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => toggleActive(s)}
                    className={`p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 transition-all cursor-pointer ${s.active ? 'text-green-500' : 'text-red-500'}`}
                    title={s.active ? 'Desativar Serviço' : 'Ativar Serviço'}
                  >
                    <Power size={16} />
                  </button>
               </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{s.name}</h3>
              <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{s.description}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-xl font-bold text-amber-500">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)}
               </span>
               <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${s.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                 {s.active ? 'Ativo' : 'Inativo'}
               </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && currentService && (
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
              className="relative w-full max-w-xl bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">{currentService.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome do Serviço</label>
                    <input
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
                      value={currentService.name || ''}
                      onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Descrição</label>
                    <textarea
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
                      value={currentService.description || ''}
                      onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-amber-500 font-bold"
                        value={currentService.price || 0}
                        onChange={(e) => setCurrentService({ ...currentService, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">URL da Imagem</label>
                      <input
                        type="text"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
                        value={currentService.imageUrl || ''}
                        onChange={(e) => setCurrentService({ ...currentService, imageUrl: e.target.value })}
                      />
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
                    onClick={handleSaveDirect}
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Save size={20} />
                    Salvar Serviço
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