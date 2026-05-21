'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Login failed');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="container py-10">
      <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-sm text-slate-300">New here? <Link className="underline" href="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
