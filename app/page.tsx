'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronRight, Star, Shield, Droplets, Sparkles, MapPin, MessageCircle } from 'lucide-react';

const services = [
  {
    title: 'Vitrificação',
    description: 'Proteção máxima para a pintura do seu veículo.',
    icon: Shield,
    image: '/assets/aistudio/vitrifica__o_4e7d1c3c.jpg'
  },
  {
    title: 'Polimento Técnico',
    description: 'Correção de riscos e brilho incomparável.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Lavagem Detalhada',
    description: 'Cuidado minucioso em cada detalhe.',
    icon: Droplets,
    image: '/assets/aistudio/lavagem_detalhada_99eea18b.jpg'
  }
];

const testimonials = [
  { name: 'Ricardo Santos', text: 'Melhor estética de Aracaju. Atendimento impecável e resultado surpreendente.', rating: 5 },
  { name: 'Fernanda Lima', text: 'Meu carro saiu da Reluz parecendo novo. O polimento técnico é fantástico!', rating: 5 },
  { name: 'João Victor', text: 'Profissionalismo e transparência. Recomendo a vitrificação!', rating: 5 }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
            alt="Carro de luxo com vitrificação"
            fill
            className="object-cover opacity-40 grayscale-[20%]"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
              Reluz Estética Automotiva
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              Seu carro merece <br />
              <span className="text-amber-500">brilhar como nunca!</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              O mais alto padrão em detalhamento automotivo de Aracaju. Transformamos o cuidado em arte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agendamento"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 group"
              >
                Agendar um Serviço
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/servicos"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full transition-all"
              >
                Conhecer Serviços
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating details scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-linear-to-b from-amber-500/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* Services Highlights */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">Excelência</h2>
            <h3 className="text-4xl font-bold">Nossos Serviços Premium</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="p-8">
                  <service.icon className="text-amber-500 mb-4" size={32} />
                  <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                  <p className="text-zinc-400 text-sm mb-6">{service.description}</p>
                  <Link href="/servicos" className="text-amber-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Saiba mais <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <Image
                  src="/assets/aistudio/loja_6d7bc3b4.jpg"
                  alt="Oficina Reluz"
                  width={800}
                  height={600}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/20 blur-3xl -z-0"></div>
            </div>
            <div>
              <h2 className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-4">A Reluz</h2>
              <h3 className="text-4xl font-bold mb-6">Paixão por detalhes e perfeição</h3>
              <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
                Nascida da paixão por automóveis, a Reluz Estética Automotiva é referência em Aracaju por seu compromisso com a qualidade extrema. Utilizamos os melhores produtos do mercado e técnicas avançadas para garantir que cada veículo saia de nossa loja com o brilho de um showroom.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h5 className="text-white font-bold mb-1">+500</h5>
                  <p className="text-zinc-500 text-sm">Carros Atendidos</p>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-1">100%</h5>
                  <p className="text-zinc-500 text-sm">Satisfação</p>
                </div>
              </div>
              <Link href="/quem-somos" className="inline-block border-b-2 border-amber-500 pb-1 text-amber-500 font-bold hover:text-amber-400 transition-colors">
                Conheça nossa história
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">Clientes</h2>
            <h3 className="text-4xl font-bold">Quem confia na Reluz</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div key={index} className="p-8 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic mb-6">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    {t.name[0]}
                  </div>
                  <span className="font-semibold">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
            alt="Fundo"
            fill
            className="object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 italic tracking-tighter">
            Pronto para ver seu <span className="text-amber-500">carro como novo?</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-12">
            Agende agora seu horário e garanta o melhor tratamento estético da região.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
                href="https://wa.me/5579988594996"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                WhatsApp
              </Link>
              <Link
                href="/agendamento"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-10 rounded-full transition-all"
              >
                Agendar Online
              </Link>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="flex items-center gap-3 text-amber-500">
                  <MapPin size={24} />
                  <span className="uppercase tracking-widest font-semibold">Localização</span>
                </div>
                <h3 className="text-4xl font-bold">Venha nos visitar</h3>
                <p className="text-zinc-400 text-lg">
                  Estamos localizados no coração de Aracaju, prontos para receber você e seu veículo.
                </p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-4">
                  <p className="text-white font-medium">Rua Siriri, nº 90, Centro, Aracaju – Sergipe.</p>
                  <div className="h-px bg-white/5"></div>
                  <p className="text-zinc-500 text-sm">Segunda a Sexta: 08:00 às 18:00</p>
                  <p className="text-zinc-500 text-sm">Sábado: 08:00 às 13:00</p>
                </div>
             </div>
             <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
               <Image
                 src="/assets/aistudio/loja_6d7bc3b4.jpg"
                 alt="Loja Reluz"
                 fill
                 className="object-cover opacity-60"
                 referrerPolicy="no-referrer"
               />
               <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                 <MapPin className="text-amber-500 mx-auto mb-4" size={48} />
                 <p className="text-white font-bold">Aracaju - SE</p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
