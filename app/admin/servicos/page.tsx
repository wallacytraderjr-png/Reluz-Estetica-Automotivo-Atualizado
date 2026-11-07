'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

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
    const response = await fetch('/api/services');
    const data = await response.json();
    setServices(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;

    const method = currentService.id ? 'PUT' : 'POST';
    const response = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentService),
    });

    if (response.ok) {
      setIsModalOpen(false);
      fetchServices();
    }
  };

  const toggleActive = async (service: Service) => {
    const response = await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...service, active: !service.active }),
    });
    if (response.ok) fetchServices();
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
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
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
               {s.imageUrl && <Image src={s.imageUrl} alt={s.name} fill className="object-cover" />}
               <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => openModal(s)}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-amber-500 transition-all border border-white/10"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => toggleActive(s)}
                    className={`p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 transition-all ${s.active ? 'text-green-500' : 'text-red-500'}`}
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
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome do Serviço</label>
                    <input
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden"
                      value={currentService.name}
                      onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Descrição</label>
                    <textarea
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden"
                      value={currentService.description}
                      onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Preço (R$)</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden text-amber-500 font-bold"
                        value={currentService.price}
                        onChange={(e) => setCurrentService({ ...currentService, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">URL da Imagem</label>
                      <input
                        type="url"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-hidden"
                        value={currentService.imageUrl}
                        onChange={(e) => setCurrentService({ ...currentService, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Save size={20} />
                    Salvar Serviço
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
