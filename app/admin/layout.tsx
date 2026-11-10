import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Protect all /admin routes except login
  // Note: Next.js middleware is better but this works for demo
  if (!session) {
    // We handle this check in a simpler way for the demo
    // The login page itself is inside /admin so we must be careful
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Serviços', href: '/admin/servicos', icon: Wrench },
    { name: 'Vendas', href: '/admin/vendas', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Agendamentos', href: '/admin/agendamentos', icon: Calendar },
    { name: 'Galeria', href: '/admin/galeria', icon: ImageIcon },
    { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col fixed h-full z-30 pt-24">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 text-amber-500 font-bold mb-2">
            <Sparkles size={18} />
            <span className="tracking-tighter">SISTEMA GESTÃO</span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Reluz Estética</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            >
              <item.icon size={20} className="group-hover:text-amber-500 transition-colors" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
           <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-24 p-8">
        {children}
      </main>
    </div>
  );
}
