'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from './search-bar';
import { Upload, ArrowUpDown, Filter, List, Grid2X2 } from 'lucide-react';

export function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="page-shell pb-0 pt-3">
      <nav role="navigation" aria-label="Main navigation" className="dashboard-topbar glass-nav card nav-shell">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark" aria-hidden="true">N</span>
            <span className="font-semibold tracking-tight text-white">NexDrop</span>
          </Link>
          <span className="pill hidden sm:inline-flex border-white/10 bg-white/10 text-white">Cloud workspace</span>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end">
          <div className="topbar-actions">
            <Link href="/dashboard" className="topbar-action inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em]">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload
            </Link>
            <button type="button" className="topbar-action inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em]">
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
              Sort
            </button>
            <button type="button" className="topbar-action inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em]">
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filter
            </button>
            <button type="button" className="topbar-action inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em]" aria-label="List view">
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" className="topbar-action inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em]" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="w-full md:w-72 lg:w-80">
            <SearchBar />
          </div>
          <div className="nav-links text-sm">
            <Link href="/dashboard" aria-label="Dashboard" className="text-white">Dashboard</Link>
            <Link href="/admin" aria-label="Admin" className="text-white">Admin</Link>
            <button onClick={logout} className="btn btn-ghost btn-sm" aria-label="Logout" type="button">Logout</button>
          </div>
        </div>
      </nav>
    </div>
  );
}
