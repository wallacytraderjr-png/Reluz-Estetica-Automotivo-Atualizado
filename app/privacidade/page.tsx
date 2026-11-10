'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={14} />
            Privacidade e Proteção de Dados
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Política de <span className="text-amber-500">Privacidade</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Na <strong>Reluz Estética Automotiva</strong>, valorizamos a confiança que você deposita em nossa equipe. 
            Esta política descreve de forma clara como tratamos, armazenamos e protegemos suas informações, 
            em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
          </p>
          <p className="text-xs text-zinc-500">
            Última atualização: Novembro de 2026 • Aracaju, Sergipe
          </p>
        </motion.div>

        {/* Conteúdo dos Termos */}
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
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold">1. Dados Pessoais que Coletamos</h2>
            </div>
            <p>
              Para prestar serviços de estética automotiva de alto padrão e processar pedidos em nossa loja, coletamos apenas os dados estritamente necessários:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 ml-2">
              <li><strong>Dados de Identificação:</strong> Nome completo, CPF (para emissão de nota fiscal/garantia).</li>
              <li><strong>Dados de Contato:</strong> Número de WhatsApp/telefone e endereço de e-mail.</li>
              <li><strong>Dados do Veículo:</strong> Marca, modelo, ano, cor e placa do veículo (utilizados exclusivamente na ordem de serviço e histórico de manutenção).</li>
              <li><strong>Endereço de Entrega:</strong> Caso adquira produtos em nossa loja online para envio.</li>
            </ul>
          </section>

          {/* Seção 2 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold">2. Como Utilizamos os Seus Dados</h2>
            </div>
            <p>As informações coletadas são utilizadas com as seguintes finalidades:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Agendamento e execução de serviços (vitrificação, polimento, lavagens).',
                'Comunicação de status do veículo via WhatsApp e confirmação de horários.',
                'Emissão de certificados de garantia (ex: vitrificação cerâmica 9H).',
                'Emissão de notas fiscais e cumprimento de obrigações legais.',
                'Processamento de pagamentos com segurança.',
                'Suporte técnico e esclarecimento de dúvidas sobre cuidados pós-serviço.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                  <CheckCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção 3 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold">3. Segurança e Sigilo dos Dados</h2>
            </div>
            <p>
              A Reluz adota medidas técnicas e administrativas rigorosas para proteger seus dados contra acessos não autorizados, perdas ou alterações:
            </p>
            <p className="text-zinc-400">
              <strong>Não comercializamos nem compartilhamos</strong> suas informações com terceiros para fins de marketing. O acesso às suas informações é restrito aos funcionários autorizados que necessitam delas para executar o atendimento ao seu veículo.
            </p>
          </section>

          {/* Seção 4 */}
          <section className="bg-zinc-900/60 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white">4. Seus Direitos como Titular</h2>
            <p>
              De acordo com a LGPD, você tem o direito de solicitar a qualquer momento:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 ml-2">
              <li>Confirmação da existência de tratamento de seus dados pessoais.</li>
              <li>Acesso aos dados arquivados em nosso sistema de agendamento e vendas.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Eliminação ou revogação de consentimento para mensagens de contato.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-amber-500/20 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-amber-500" />
              5. Canal de Contato do Encarregado de Dados
            </h2>
            <p className="text-zinc-300">
              Para exercer seus direitos de privacidade ou tirar qualquer dúvida sobre esta política, entre em contato direto conosco:
            </p>
            <div className="space-y-1.5 text-xs sm:text-sm text-zinc-400 bg-black/60 p-4 rounded-2xl border border-white/5">
              <p><strong>Reluz Estética Automotiva</strong></p>
              <p>Endereço: Rua Siriri, nº 90, Centro, Aracaju – SE</p>
              <p>WhatsApp / Telefone: (79) 98859-4996</p>
              <p>E-mail: contato@reluzestetica.com.br</p>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/5579988594996?text=Olá,%20gostaria%20de%20falar%20sobre%20a%20política%20de%20privacidade%20da%20Reluz."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <MessageCircle size={16} />
                Falar com a Reluz no WhatsApp
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
