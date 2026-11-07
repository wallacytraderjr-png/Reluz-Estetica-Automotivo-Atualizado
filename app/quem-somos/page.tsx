'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { title: 'Qualidade Extrema', text: 'Não aceitamos menos que a perfeição em cada centímetro do seu veículo.', icon: Award },
    { title: 'Confiança', text: 'Transparência total em nossos processos e nos produtos utilizados.', icon: ShieldCheck },
    { title: 'Inovação', text: 'Sempre atualizados com as melhores técnicas e tecnologias mundiais.', icon: Sparkles },
    { title: 'Paixão', text: 'Amamos o que fazemos, e isso transparece no brilho de cada carro.', icon: Heart },
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-4 text-sm">Nossa História</h2>
            <h1 className="text-5xl font-bold tracking-tighter mb-8 italic">O Brilho que Aracaju <br /> <span className="text-amber-500">conhece e confia.</span></h1>
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                A <strong>Reluz Estética Automotiva</strong> nasceu de um sonho compartilhado por entusiastas do mundo motor. O que começou como um hobby de fim de semana transformou-se, com muito estudo e dedicação, no principal centro de estética premium de Aracaju.
              </p>
              <p>
                Localizada na Rua Siriri, no centro da capital sergipana, nossa oficina foi projetada para oferecer uma experiência única. Acreditamos que um carro não é apenas um meio de transporte, mas um patrimônio que carrega histórias e merece o máximo de cuidado.
              </p>
              <p>
                Hoje, a Reluz é sinônimo de excelência em polimento, vitrificação e detalhamento, servindo clientes exigentes que buscam a valorização e a proteção real de seus veículos.
              </p>
            </div>
          </motion.div>
          <div className="relative">
             <div className="aspect-square relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/assets/aistudio/loja_6d7bc3b4.jpg"
                  alt="Equipe Reluz"
                  fill
                  className="object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 rounded-full flex flex-col items-center justify-center text-black z-10 shadow-2xl">
                <span className="text-3xl font-black italic">Reflexo</span>
                <span className="text-xs uppercase font-bold tracking-widest">Perfeito</span>
             </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="p-12 rounded-3xl bg-zinc-900 border border-white/5 space-y-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold">Nossa Missão</h3>
            <p className="text-zinc-500 leading-relaxed">
              Proporcionar o mais alto nível de estética e proteção automotiva, utilizando tecnologia de ponta para elevar a autoestima dos nossos clientes e preservar o valor de seus veículos.
            </p>
          </div>
          <div className="p-12 rounded-3xl bg-zinc-900 border border-white/5 space-y-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Eye size={24} />
            </div>
            <h3 className="text-2xl font-bold">Nossa Visão</h3>
            <p className="text-zinc-500 leading-relaxed">
              Ser reconhecida como a maior autoridade em detalhamento automotivo do Nordeste, expandindo nossos horizontes através da inovação constante e da formação de novos profissionais.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-2 text-sm">DNA Reluz</h2>
            <h3 className="text-4xl font-bold">Nossos Valores</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-zinc-950 border border-white/5 hover:border-amber-500/30 transition-all text-center group"
              >
                <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 group-hover:text-amber-500 group-hover:scale-110 transition-all mx-auto mb-6">
                  <v.icon size={28} />
                </div>
                <h4 className="font-bold mb-3">{v.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
