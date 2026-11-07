import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Reluz Estética Automotiva | Estética Premium em Aracaju',
  description: 'Seu carro merece brilhar como nunca! Especialistas em vitrificação, polimento e lavagem detalhada em Aracaju-SE.',
  openGraph: {
    title: 'Reluz Estética Automotiva',
    description: 'Estética automotiva premium em Aracaju. Serviços de alta qualidade e loja de produtos exclusivos.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reluz Estética Automotiva',
    description: 'Estética automotiva premium em Aracaju.',
  },
};

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-black text-white antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
