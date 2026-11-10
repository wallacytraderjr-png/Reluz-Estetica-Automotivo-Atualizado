'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FileText, Shield, Clock, AlertTriangle, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Botão Voltar */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para o Início
          </Link>
        </div>

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12 border-b border-white/10 pb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
            <FileText size={14} />
            Condições Gerais de Serviço
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Termos de <span className="text-amber-500">Uso</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Bem-vindo à <strong>Reluz Estética Automotiva</strong>. Ao agendar nossos serviços ou adquirir produtos em nossa plataforma, 
            você concorda com os termos e diretrizes descritos a seguir, que garantem a segurança, a qualidade e a transparência do nosso atendimento.
          </p>
          <p className="text-xs text-zinc-500">
            Vigência: 2026 • Reluz Estética Automotiva • Aracaju - SE
          </p>
        </motion.div>

        {/* Seções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-10 text-zinc-300 leading-relaxed text-sm sm:text-base"
        >
          {/* Seção 1 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-bold">1. Agendamentos e Horários</h2>
            </div>
            <p>
              Os agendamentos realizados pela nossa plataforma web dependem de confirmação da equipe operacional da Reluz via WhatsApp:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
              <li><strong>Tolerância:</strong> Solicitamos pontualidade na entrega do veículo. Há uma tolerância máxima de 15 minutos em relação ao horário agendado.</li>
              <li><strong>Cancelamentos e Reagendamentos:</strong> Devem ser comunicados com no mínimo 24 horas de antecedência pelo nosso WhatsApp para liberação da vaga na oficina.</li>
              <li><strong>Retirada do Veículo:</strong> O veículo deve ser retirado no horário acordado após a conclusão e inspeção final do serviço.</li>
            </ul>
          </section>

          {/* Seção 2 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Shield size={20} />
              </div>
              <h2 className="text-xl font-bold">2. Vistoria Prévia e Check-in</h2>
            </div>
            <p>
              No momento do recebimento do veículo em nossa sede (Rua Siriri, nº 90, Centro), é realizada uma inspeção visual detalhada para registrar o estado da pintura, eventuais riscos pré-existentes, mossas ou avarias de funilaria.
            </p>
            <p className="text-zinc-400">
              Recomendamos aos clientes que não deixem objetos de valor pessoal no interior do veículo durante a realização dos procedimentos de estética e higienização.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <CheckCircle size={20} />
              </div>
              <h2 className="text-xl font-bold">3. Garantia dos Serviços de Estética</h2>
            </div>
            <p>
              A Reluz trabalha exclusivamente com produtos certificados de marcas líderes internacionais:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <h3 className="font-bold text-amber-500 text-sm">Vitrificação Cerâmica (Coating 9H)</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  A garantia da vitrificação cobre perda anormal de repelência ou proteção cerâmica, desde que seguidas as manutenções periódicas recomendadas e utilização de shampoos com pH neutro.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <h3 className="font-bold text-amber-500 text-sm">Polimento Técnico</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Correção de verniz com eliminação de micro-riscos e marcas de redemoinho (hologramas), preservando a espessura segura do verniz original do veículo.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl font-bold">4. Venda de Produtos e Devoluções</h2>
            </div>
            <p>
              Conforme o <strong>Código de Defesa do Consumidor (CDC)</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 ml-2">
              <li>Compras online possuem prazo de até 7 (sete) dias corridos para solicitação de troca ou desistência, desde que os produtos estejam lacrados e em sua embalagem original sem violação.</li>
              <li>Produtos com defeito de fabricação comprovado serão substituídos prontamente por item idêntico.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white">5. Formas de Pagamento Aceitas</h2>
            <p>
              Aceitamos pagamentos via <strong>PIX</strong>, <strong>Cartão de Crédito</strong> (com possibilidade de parcelamento conforme condições vigentes), <strong>Cartão de Débito</strong> e <strong>Dinheiro</strong>. O pagamento dos serviços pode ser realizado na entrega do veículo.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-amber-500/20 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-amber-500" />
              6. Dúvidas ou Atendimento
            </h2>
            <p className="text-zinc-300">
              Caso tenha dúvidas sobre estes termos ou queira solicitar um orçamento personalizado para o seu veículo, fale diretamente com nossa gerência:
            </p>
            <div className="space-y-1 text-xs sm:text-sm text-zinc-400 bg-black/60 p-4 rounded-2xl border border-white/5">
              <p><strong>Reluz Estética Automotiva</strong></p>
              <p>Rua Siriri, nº 90, Centro, Aracaju – SE</p>
              <p>WhatsApp: (79) 98859-4996</p>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/5579988594996?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20os%20serviços%20da%20Reluz."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <MessageCircle size={16} />
                Falar com a Equipe no WhatsApp
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
