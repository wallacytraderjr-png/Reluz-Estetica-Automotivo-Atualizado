'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Car, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Wrench
} from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    vehicleModel: '',
    vehicleBrand: '',
    plate: '',
    color: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.filter((s: any) => s.active));
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (submitted) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-zinc-900 p-12 rounded-3xl border border-white/5 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold">Agendamento Realizado!</h1>
          <p className="text-zinc-500">
            Recebemos sua solicitação para o dia <span className="text-white font-bold">{formData.date}</span> às <span className="text-white font-bold">{formData.time}</span>.
          </p>
          <p className="text-zinc-500 text-sm">
            Entraremos em contato via WhatsApp para confirmar seu horário.
          </p>
          <div className="pt-6">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl transition-all"
            >
              Voltar para o Início
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-2 text-sm">Praticidade</h2>
          <h1 className="text-4xl font-bold tracking-tighter">Agendamento Online</h1>
          <p className="text-zinc-500 mt-2">Escolha o melhor horário para cuidar do seu veículo.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-10"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${
                step >= s ? 'bg-amber-500 border-amber-500 text-black' : 'bg-black border-zinc-800 text-zinc-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <User size={20} className="text-amber-500" />
                    Seus Dados e Veículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome Completo</label>
                      <input 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">WhatsApp</label>
                      <input 
                        required
                        placeholder="(00) 00000-0000"
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Marca do Veículo</label>
                      <input 
                        required
                        placeholder="Ex: Toyota"
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.vehicleBrand}
                        onChange={e => setFormData({...formData, vehicleBrand: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Modelo</label>
                      <input 
                        required
                        placeholder="Ex: Corolla"
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.vehicleModel}
                        onChange={e => setFormData({...formData, vehicleModel: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Placa</label>
                      <input 
                        required
                        placeholder="ABC-1234"
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.plate}
                        onChange={e => setFormData({...formData, plate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Cor</label>
                      <input 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="pt-6">
                    <button 
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.customerName || !formData.phone || !formData.vehicleModel}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      Próximo Passo
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Wrench size={20} className="text-amber-500" />
                    Serviço e Preferências
                  </h3>
                  <div className="space-y-4">
                     <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block">Escolha o Serviço</label>
                     <div className="grid grid-cols-1 gap-3">
                        {services.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setFormData({...formData, serviceId: s.id})}
                            className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                              formData.serviceId === s.id 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                              : 'bg-black border-white/5 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            <span className="font-bold">{s.name}</span>
                            <span className="text-xs">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)}</span>
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Observações (Opcional)</label>
                    <textarea 
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-amber-500 outline-hidden"
                      rows={3}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all">Voltar</button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!formData.serviceId}
                      className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      Próximo Passo
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon size={20} className="text-amber-500" />
                    Data e Horário
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block">Selecione a Data</label>
                        <div className="grid grid-cols-3 gap-2">
                           {[...Array(6)].map((_, i) => {
                             const date = addDays(startOfToday(), i + 1);
                             const formatted = format(date, 'yyyy-MM-dd');
                             return (
                               <button
                                 key={formatted}
                                 type="button"
                                 onClick={() => setFormData({...formData, date: formatted})}
                                 className={`p-3 rounded-xl border flex flex-col items-center transition-all ${
                                   formData.date === formatted 
                                   ? 'bg-amber-500 border-amber-500 text-black' 
                                   : 'bg-black border-white/5 text-zinc-400'
                                 }`}
                               >
                                 <span className="text-[10px] uppercase font-bold">{format(date, 'EEE', {locale: ptBR})}</span>
                                 <span className="text-lg font-bold">{format(date, 'dd')}</span>
                               </button>
                             );
                           })}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block">Horários Disponíveis</label>
                        <div className="grid grid-cols-3 gap-2">
                           {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                             <button
                               key={time}
                               type="button"
                               onClick={() => setFormData({...formData, time})}
                               className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                                 formData.time === time 
                                 ? 'bg-amber-500 border-amber-500 text-black' 
                                 : 'bg-black border-white/5 text-zinc-400'
                               }`}
                             >
                               {time}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-4">
                    <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                    <p className="text-[10px] text-amber-500/80 leading-relaxed uppercase tracking-wider font-medium">
                      O agendamento está sujeito a confirmação via WhatsApp. Nossa equipe entrará em contato em até 1 hora.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all">Voltar</button>
                    <button 
                      type="submit" 
                      disabled={!formData.date || !formData.time || loading}
                      className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                    >
                      {loading ? 'Processando...' : 'Finalizar Agendamento'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
