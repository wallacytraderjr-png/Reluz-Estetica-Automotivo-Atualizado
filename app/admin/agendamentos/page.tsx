'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Car, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  plate?: string;
  color?: string;
  serviceId?: string;
  date: string;
  time: string;
  notes?: string;
  status: string; // 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado'
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('TODOS'); // TODOS, PENDENTES, CONFIRMADOS, CONCLUIDOS, CANCELADOS

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
    setLoading(false);
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        alert('Erro ao atualizar status do agendamento.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'TODOS') return true;
    if (activeTab === 'PENDENTES') return app.status === 'Pendente';
    if (activeTab === 'CONFIRMADOS') return app.status === 'Confirmado';
    if (activeTab === 'CONCLUIDOS') return app.status === 'Concluído';
    if (activeTab === 'CANCELADOS') return app.status === 'Cancelado';
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Gerenciamento de Agendamentos</h1>
        <p className="text-zinc-500">Visualize e gerencie as solicitações dos clientes em tempo real.</p>
      </div>

      {/* Abas de Filtro */}
      <div className="flex flex-wrap gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/5 max-w-fit">
        {['TODOS', 'PENDENTES', 'CONFIRMADOS', 'CONCLUIDOS', 'CANCELADOS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-16 text-center text-zinc-500">
            Nenhum agendamento encontrado nesta categoria.
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const statusColor = 
              app.status === 'Confirmado' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              app.status === 'Concluído' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
              app.status === 'Cancelado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              'bg-amber-500/10 text-amber-500 border-amber-500/20';

            return (
              <div 
                key={app.id} 
                className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl hover:border-white/10 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold border border-amber-500/20">
                      {(app.clientName || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-white">{app.clientName}</h3>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase border ${statusColor}`}>
                          {app.status || 'Pendente'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">ID: {app.id} {app.serviceId ? `• Serviço: ${app.serviceId}` : ''}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-300 pt-2">
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Calendar size={15} className="text-amber-500" />
                      <span>{app.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Clock size={15} className="text-amber-500" />
                      <span>{app.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Car size={15} className="text-amber-500" />
                      <span>{app.vehicleBrand || ''} {app.vehicleModel || ''} {app.plate ? `(${app.plate})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Phone size={15} className="text-amber-500" />
                      <span>{app.phone || 'Não informado'}</span>
                    </div>
                  </div>
                  {app.notes && (
                    <p className="text-xs text-zinc-400 bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <strong>Obs:</strong> {app.notes}
                    </p>
                  )}
                </div>

                {/* Botões de Ação baseados no status */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {app.status === 'Pendente' && (
                    <>
                      <button
                        onClick={() => updateStatus(app.id, 'Confirmado')}
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'Cancelado')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    </>
                  )}

                  {app.status === 'Confirmado' && (
                    <>
                      <button
                        onClick={() => updateStatus(app.id, 'Concluído')}
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        Concluir Serviço
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'Cancelado')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    </>
                  )}

                  {app.status === 'Concluído' && (
                    <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Serviço Concluído & Faturado
                    </span>
                  )}

                  {app.status === 'Cancelado' && (
                    <span className="text-xs text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 flex items-center gap-1.5">
                      <XCircle size={14} /> Cancelado
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}