'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Filter } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['Todos', 'Lavagens', 'Polimentos', 'Vitrificações', 'Antes e Depois'];

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filteredItems = category === 'Todos' 
    ? items 
    : items.filter(i => i.category === category);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-amber-500 font-medium tracking-[0.3em] uppercase mb-2 text-sm">Portfólio</h2>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Galeria de Resultados</h1>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
            Confira alguns dos trabalhos realizados pela Reluz Estética Automotiva. Qualidade que você pode ver.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                category === cat 
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                : 'bg-zinc-900 text-zinc-500 border border-white/5 hover:border-amber-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative h-80 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <p className="text-white font-medium text-sm">{item.description}</p>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
                      <Maximize2 size={16} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.description}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-black via-black/40 to-transparent">
                   <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">{selectedImage.category}</p>
                   <h3 className="text-2xl font-bold text-white">{selectedImage.description}</h3>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 transition-all text-white"
                >
                  <X size={24} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
