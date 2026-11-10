'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group w-full text-left"
    >
      <LogOut size={20} />
      <span className="text-sm font-medium">Sair</span>
    </button>
  );
}
