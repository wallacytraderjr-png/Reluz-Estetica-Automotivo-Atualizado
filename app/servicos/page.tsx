'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
          const activeServices = data.filter((s: Service) => s.active !== false);
          setServices(activeServices.length > 0 ? activeServices : data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-2 text-sm">Tratamentos</h2>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Nossos Serviços</h1>
          <p className="text-zinc-500 mt-4 max-w-2xl">
            Oferecemos o que há de mais moderno em estética automotiva, utilizando produtos de marcas renomadas e técnicas precisas.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.imageUrl || '/assets/estudio/lavagem_detalhada.jpg'}
                    alt={service.name || 'Serviço de Estética Automotiva'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-500 border border-amber-500/30">
                    Premium
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-amber-500 transition-colors">{service.name}</h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-1">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span>Produtos Certificados</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock size={14} className="text-amber-500" />
                      <span>Tempo estimado sob consulta</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <ShieldCheck size={14} className="text-blue-500" />
                      <span>Garantia Reluz</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">A partir de</span>
                      <span className="text-xl font-bold text-amber-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price || 0)}
                      </span>
                    </div>
                    <Link
                      href={`/agendamento?service=${service.id}`}
                      className="bg-white/5 hover:bg-amber-500 hover:text-black p-3 rounded-xl transition-all"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <section className="mt-32 p-12 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h4 className="text-2xl font-bold mb-4">Por que escolher a Reluz?</h4>
              <p className="text-zinc-500 text-sm">
                Nossa metodologia de trabalho foca no detalhe extremo, garantindo não apenas a estética, mas a conservação real do seu patrimônio.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">Qualidade Garantida</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Trabalhamos com as melhores marcas mundiais como Vonixx, Koch Chemie e Menzerna.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">Pontualidade</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Respeitamos seu tempo com agendamentos precisos e entregas no prazo combinado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}