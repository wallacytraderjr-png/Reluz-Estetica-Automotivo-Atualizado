import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tighter">
              RELUZ <span className="text-amber-500">ESTÉTICA</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Excelência em estética automotiva premium. O cuidado que seu veículo merece com tecnologia e paixão por detalhes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-zinc-400 hover:text-amber-500 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-amber-500 transition-colors">
                <Facebook size={20} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-500">Navegação</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/servicos" className="hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="/produtos" className="hover:text-white transition-colors">Produtos</Link></li>
              <li><Link href="/galeria" className="hover:text-white transition-colors">Galeria</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-500">Serviços</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Vitrificação 9H</li>
              <li>Polimento Técnico</li>
              <li>Higienização Detalhada</li>
              <li>Lavagem de Motor</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-500">Contato</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-500 flex-shrink-0" />
                <span>Rua Siriri, nº 90, Centro, Aracaju – SE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500 flex-shrink-0" />
                <span>(79) 98859-4996</span>
              </li>
              <li>
                <a 
                  href="https://wa.me/5579988594996" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-amber-500 hover:text-amber-400 transition-colors font-medium"
                >
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Reluz Estética Automotiva. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/termos" className="hover:text-white">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
