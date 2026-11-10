'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  Upload, 
  Filter,
  Loader2,
  FileImage
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryItem {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [newItem, setNewItem] = useState({ category: 'Lavagens', imageUrl: '', description: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Lavagens', 'Polimentos', 'Vitrificações', 'Antes e Depois', 'Nossa Loja'];

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    try {
      const response = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erro ao buscar galeria:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewItem(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      alert('Por favor, forneça uma URL ou envie uma foto.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao publicar imagem.');
      }

      await fetchGallery();
      setIsModalOpen(false);
      setNewItem({ category: 'Lavagens', imageUrl: '', description: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      console.error('Erro ao salvar item da galeria:', error);
      alert(error.message || 'Erro ao salvar a foto na galeria.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta foto da galeria?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao excluir imagem.');
      }

      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      alert(error.message || 'Erro ao remover imagem da galeria.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = filterCategory === 'Todas'
    ? items
    : items.filter(i => i.category === filterCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gestão da Galeria</h1>
          <p className="text-zinc-500">Mantenha seu portfólio atualizado para os clientes da Reluz.</p>
        </div>
        <button
          onClick={() => {
            setNewItem({ category: 'Lavagens', imageUrl: '', description: '' });
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
        >
          <Plus size={20} />
          Adicionar Foto
        </button>
      </div>

      {/* Categorias Filtro */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter size={14} /> Filtro:
        </span>
        {['Todas', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-zinc-500 text-sm mt-4">Carregando galeria...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/40">
            <ImageIcon size={48} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 font-medium">Nenhuma foto encontrada nesta categoria.</p>
            <p className="text-zinc-600 text-xs mt-1">Clique no botão "Adicionar Foto" para cadastrar.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-md"
            >
              <img
                src={item.imageUrl}
                alt={item.description || 'Foto da galeria'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-2.5 bg-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer backdrop-blur-md"
                    title="Remover foto"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1">
                    {item.category}
                  </span>
                  <p className="text-xs text-white line-clamp-2 font-medium">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Adicionar Foto */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Nova Foto para a Galeria</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={submitting}
                  className="text-zinc-500 hover:text-white p-2 cursor-pointer transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="space-y-4">
                  {/* Categoria */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                      Categoria
                    </label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Upload do Arquivo OU URL */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                      Imagem (Upload de Arquivo ou URL)
                    </label>

                    {/* Botão de arquivo */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="gallery-file-upload"
                      />
                      <label
                        htmlFor="gallery-file-upload"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold cursor-pointer border border-white/10 transition-colors"
                      >
                        <FileImage size={16} className="text-amber-500" />
                        Escolher foto do dispositivo
                      </label>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-white/10"></div>
                      <span className="shrink mx-3 text-[10px] uppercase font-bold text-zinc-500">ou colar link</span>
                      <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <input
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={newItem.imageUrl}
                      onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    />
                  </div>

                  {/* Preview da Imagem */}
                  {newItem.imageUrl && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                        Pré-visualização
                      </label>
                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black border border-white/10">
                        <img
                          src={newItem.imageUrl}
                          alt="Pré-visualização"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Descrição */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">
                      Descrição do Trabalho
                    </label>
                    <input
                      required
                      placeholder="Ex: Polimento Técnico em BMW M3"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-colors"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Publicar Foto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
