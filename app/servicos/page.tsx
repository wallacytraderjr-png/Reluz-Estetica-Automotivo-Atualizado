'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, Clock } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  duration?: string;
  active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (Array.isArray(data)) {
          setServices(data.filter((s: Service) => s.active !== false));
        }
      } catch (e) {
        console.error('Erro ao buscar serviços:', e);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Nossos Serviços
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Tratamento de Elite para o seu Veículo
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            Conheça os nossos serviços especializados em estética automotiva, desenvolvidos com produtos de alta performance e tecnologia de ponta.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Nenhum serviço disponível no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-zinc-800">
                    {service.imageUrl && (
                      <img 
                        src={service.imageUrl} 
                        alt={service.name || 'Serviço de Estética Automotiva'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
                    
                    {service.duration && (
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                        <Clock size={14} className="text-amber-500" />
                        {service.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight group-hover:text-amber-500 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-zinc-400 text-xs md:text-sm line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Investimento</span>
                    <span className="text-2xl font-black text-amber-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                    </span>
                  </div>
                  
                  <Link
                    href={`/agendamento?service=${encodeURIComponent(service.name)}`}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold p-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
                  >
                    <Calendar size={18} />
                    <span className="text-xs uppercase tracking-wider hidden sm:inline">Agendar</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}