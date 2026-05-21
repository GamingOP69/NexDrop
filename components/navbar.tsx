'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="container py-6">
      <div className="card flex items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-bold tracking-tight">NexDrop</Link>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
          <button onClick={logout} className="btn btn-ghost py-2">Logout</button>
        </div>
      </div>
    </div>
  );
}
