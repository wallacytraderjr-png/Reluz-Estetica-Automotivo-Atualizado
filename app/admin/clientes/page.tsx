'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Eye, 
  Car, 
  Phone, 
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleModel: string;
  vehicleBrand: string;
  plate: string;
  color: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newColor, setNewColor] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          phone: newPhone,
          address: newAddress,
          vehicleBrand: newBrand,
          vehicleModel: newModel,
          plate: newPlate,
          color: newColor
        })
      });

      if (response.ok) {
        setIsNewCustomerModalOpen(false);
        setNewName('');
        setNewPhone('');
        setNewAddress('');
        setNewBrand('');
        setNewModel('');
        setNewPlate('');
        setNewColor('');
        fetchCustomers();
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.plate.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gestão de Clientes</h1>
          <p className="text-zinc-500">Cadastro e histórico de clientes da Reluz.</p>
        </div>
        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por nome, placa ou telefone..."
              className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold bg-black/20">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Veículo Principal</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Cadastro</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">
                    Nenhum cliente cadastrado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20">
                          {c.name ? c.name[0] : 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{c.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-zinc-500" />
                        <div>
                          <p className="text-sm font-medium">{c.vehicleBrand} {c.vehicleModel}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase">{c.plate} - {c.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-2"><Phone size={12} className="text-zinc-600" /> {c.phone}</p>
                        {c.address && <p className="text-[10px] text-zinc-500 flex items-center gap-2 truncate max-w-[150px]"><MapPin size={10} /> {c.address}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-xs text-zinc-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedCustomer(c)}
                          className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg transition-all cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Cliente */}
      <AnimatePresence>
        {isNewCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <h2 className="text-xl font-bold">Cadastrar Novo Cliente</h2>
                <button onClick={() => setIsNewCustomerModalOpen(false)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      required
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      placeholder="(79) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Endereço</label>
                  <input 
                    type="text" 
                    value={newAddress} 
                    onChange={(e) => setNewAddress(e.target.value)} 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                    placeholder="Rua, Número, Bairro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Marca do Veículo</label>
                    <input 
                      type="text" 
                      required
                      value={newBrand} 
                      onChange={(e) => setNewBrand(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      placeholder="Ex: Toyota, Honda..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Modelo do Veículo</label>
                    <input 
                      type="text" 
                      required
                      value={newModel} 
                      onChange={(e) => setNewModel(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      placeholder="Ex: Corolla, Civic..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Placa</label>
                    <input 
                      type="text" 
                      required
                      value={newPlate} 
                      onChange={(e) => setNewPlate(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none uppercase text-white"
                      placeholder="ABC-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Cor</label>
                    <input 
                      type="text" 
                      required
                      value={newColor} 
                      onChange={(e) => setNewColor(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white"
                      placeholder="Ex: Preto, Prata..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Salvar Cliente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-2xl border border-amber-500/20">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-zinc-500 text-sm">Cliente desde {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-zinc-500 hover:text-white p-2 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Informações de Contato</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Phone size={16} className="text-zinc-600" />
                        <span className="text-sm">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        <MapPin size={16} className="text-zinc-600" />
                        <span className="text-sm">{selectedCustomer.address || 'Endereço não informado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Veículo</h4>
                    <div className="p-4 bg-black rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-3 text-white">
                        <Car size={18} className="text-amber-500" />
                        <span className="font-bold">{selectedCustomer.vehicleBrand} {selectedCustomer.vehicleModel}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Placa</span>
                        <span className="font-black text-zinc-300 uppercase">{selectedCustomer.plate}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Cor</span>
                        <span className="text-zinc-300">{selectedCustomer.color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Histórico de Atendimentos</h4>
                   <div className="space-y-4">
                      <div className="text-center py-12 border border-white/5 border-dashed rounded-3xl">
                        <Calendar className="mx-auto text-zinc-800 mb-2" size={32} />
                        <p className="text-zinc-500 text-sm italic">Nenhum atendimento registado para este cliente.</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 flex gap-4 bg-black/20">
                <button className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all cursor-pointer">
                  Novo Agendamento
                </button>
                <button className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all cursor-pointer text-white">
                  Registrar Venda
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}