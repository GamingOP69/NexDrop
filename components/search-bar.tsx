'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const timeout = useRef<number | null>(null);

  function scheduleSearch(val: string) {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => doSearch(val), 300);
  }

  async function doSearch(val: string) {
    if (!val.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/files/search?q=${encodeURIComponent(val)}&perPage=6`);
      const data = await res.json();
      if (res.ok) setResults(data.files || []);
      else setResults([]);
    } catch (err) {
      setResults([]);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">Search files</label>
      <input
        id="search"
        aria-label="Search files"
        placeholder="Search files..."
        className="field"
        value={q}
        onChange={(e) => { setQ(e.target.value); scheduleSearch(e.target.value); }}
      />
      {results && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border rounded shadow-lg z-50">
          {loading ? <div className="p-3 text-sm">Searching…</div> : null}
          {results.length === 0 ? <div className="p-3 text-sm text-slate-400">No results</div> : null}
          {results.map((r) => (
            <Link key={r.id} href={`/dashboard`} className="block p-2 hover:bg-slate-700 border-b">
              <div className="text-sm">{r.originalName}</div>
              <div className="text-xs text-slate-400">{r.size} • {new Date(r.createdAt).toLocaleDateString()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
