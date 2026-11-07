'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, subDays, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  vehicle: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));
  const [filter, setFilter] = useState('Todos');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/appointments');
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch('/api/admin/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) fetchAppointments();
  };

  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = safeAppointments
    .filter(a => a.date === selectedDate)
    .filter(a => filter === 'Todos' || a.status === filter);

  const statuses = ['Todos', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Agenda de Serviços</h1>
          <p className="text-zinc-500">Gerencie os horários e atendimentos da Reluz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Date Selector */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-6 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-amber-500">Calendário</h3>
            <div className="flex gap-1">
               <button onClick={() => setSelectedDate(format(subDays(new Date(selectedDate + 'T00:00:00'), 1), 'yyyy-MM-dd'))} className="cursor-pointer p-1 hover:bg-white/5 rounded text-white">
                <ChevronLeft size={16} />
               </button>
               <button onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + 'T00:00:00'), 1), 'yyyy-MM-dd'))} className="cursor-pointer p-1 hover:bg-white/5 rounded text-white">
                <ChevronRight size={16} />
               </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const date = addDays(startOfToday(), i);
              const formatted = format(date, 'yyyy-MM-dd');
              const isSelected = selectedDate === formatted;
              return (
                <button
                  key={formatted}
                  onClick={() => setSelectedDate(formatted)}
                  className={`cursor-pointer w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected 
                    ? 'bg-amber-500 border-amber-500 text-black font-bold' 
                    : 'bg-black border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-[10px] uppercase">{format(date, 'EEEE', { locale: ptBR })}</p>
                    <p className="text-sm">{format(date, "dd 'de' MMMM", { locale: ptBR })}</p>
                  </div>
                  {isSelected && <CalendarIcon size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === s 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-900 text-zinc-500 border border-white/5'
                }`}
              >
                {s === 'PENDING' ? 'Pendentes' : s === 'CONFIRMED' ? 'Confirmados' : s === 'COMPLETED' ? 'Concluídos' : s === 'CANCELLED' ? 'Cancelados' : 'Todos'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div></div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-32 text-center bg-zinc-900 rounded-3xl border border-white/5 border-dashed">
                <CalendarIcon className="mx-auto text-zinc-800 mb-4" size={48} />
                <p className="text-zinc-500">Nenhum agendamento para este dia.</p>
              </div>
            ) : (
              filteredAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  <div className="w-16 h-16 bg-black rounded-2xl flex flex-col items-center justify-center border border-white/5 flex-shrink-0">
                    <Clock size={20} className="text-amber-500 mb-1" />
                    <span className="text-sm font-bold text-white">{app.time}</span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-white">{app.customerName}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                        app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        app.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500' :
                        app.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium">
                      {app.serviceName} - <span className="text-zinc-500">{app.vehicle}</span>
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <a href={`tel:${app.phone}`} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                        <Phone size={14} /> {app.phone}
                      </a>
                      <a 
                        href={`https://wa.me/55${app.phone ? app.phone.replace(/\D/g, '') : ''}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    {app.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(app.id, 'CONFIRMED')}
                        className="cursor-pointer flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} /> <span className="md:hidden lg:inline text-xs font-bold">Confirmar</span>
                      </button>
                    )}
                    {app.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => updateStatus(app.id, 'COMPLETED')}
                        className="cursor-pointer flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} /> <span className="md:hidden lg:inline text-xs font-bold">Concluir</span>
                      </button>
                    )}
                    {(app.status === 'PENDING' || app.status === 'CONFIRMED') && (
                      <button 
                         onClick={() => updateStatus(app.id, 'CANCELLED')}
                        className="cursor-pointer flex-1 md:flex-none border border-red-500/30 text-red-500 hover:bg-red-500/5 p-3 rounded-xl transition-all flex items-center justify-center"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}