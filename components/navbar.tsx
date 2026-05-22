'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { SearchBar } from './search-bar';

export function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="container py-6">
      <nav role="navigation" aria-label="Main navigation" className="card flex items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-bold tracking-tight">NexDrop</Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-56">
            <SearchBar />
          </div>
          <Link href="/dashboard" aria-label="Dashboard">Dashboard</Link>
          <Link href="/admin" aria-label="Admin">Admin</Link>
          <ThemeToggle />
          <button onClick={logout} className="btn btn-ghost py-2" aria-label="Logout">Logout</button>
        </div>
      </nav>
    </div>
  );
}
