'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Phone, 
  Car 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Client {
  id: string;
  name: string;
  phone: string;
  address?: string; // <--- 1. Campo de endereço adicionado aqui na interface
  vehicleBrand?: string;
  vehicleModel?: string;
  plate?: string;
  color?: string;
  createdAt?: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    if (!currentClient || !currentClient.name) {
      alert('Por favor, preencha o nome do cliente.');
      return;
    }

    const method = currentClient.id ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/customers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentClient),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchClients();
      } else {
        alert('Erro ao salvar cliente no servidor.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const res = await fetch(`/api/admin/customers?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchClients();
      } else {
        alert('Erro ao excluir cliente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  const openModal = (client: Client | null = null) => {
    setCurrentClient(client || {
      name: '',
      phone: '',
      address: '',
      vehicleBrand: '',
      vehicleModel: '',
      plate: '',
      color: ''
    });
    setIsModalOpen(true);
  };

  const filteredClients = clients.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery) ||
    (c.plate || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gestão de Clientes</h1>
          <p className="text-zinc-500">Cadastro e histórico de clientes da Reluz.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          placeholder="Pesquisar por nome, placa ou telefone..."
          className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-amber-500 outline-none text-white"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            Nenhum cliente encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  <th className="p-6">Cliente</th>
                  <th className="p-6">Veículo Principal</th>
                  <th className="p-6">Contato</th>
                  <th className="p-6">Cadastro</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-bold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold border border-amber-500/20">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span>{client.name}</span>
                        <span className="block text-xs text-zinc-500 font-normal">ID: {client.id}</span>
                      </div>
                    </td>
                    <td className="p-6 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-amber-500" />
                        <span>{client.vehicleBrand || ''} {client.vehicleModel || 'Veículo não informado'}</span>
                      </div>
                      <span className="text-xs text-zinc-500 uppercase">{client.plate} {client.color ? `- ${client.color}` : ''}</span>
                    </td>
                    <td className="p-6 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-amber-500" />
                        {client.phone || 'Não informado'}
                      </div>
                    </td>
                    <td className="p-6 text-zinc-500 text-xs">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : 'N/I'}
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <button 
                        onClick={() => openModal(client)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-500 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Editar Cliente"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Excluir Cliente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      <AnimatePresence>
        {isModalOpen && currentClient && (
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
                <h2 className="text-xl font-bold">{currentClient.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nome Completo</label>
                    <input
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.name || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">WhatsApp / Telefone</label>
                    <input
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.phone || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                    />
                  </div>
                  {/* --- 2. Input de Endereço adicionado no Modal --- */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Endereço Completo</label>
                    <input
                      placeholder="Ex: Rua A, nº 123 - Bairro"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.address || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Marca do Veículo</label>
                    <input
                      placeholder="Ex: Toyota"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.vehicleBrand || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, vehicleBrand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Modelo</label>
                    <input
                      placeholder="Ex: Corolla"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.vehicleModel || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, vehicleModel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Placa</label>
                    <input
                      placeholder="ABC-1234"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.plate || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, plate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Cor</label>
                    <input
                      placeholder="Ex: Prata"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      value={currentClient.color || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Save size={20} />
                    Salvar Cliente
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}