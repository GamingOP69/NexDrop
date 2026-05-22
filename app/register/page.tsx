'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Registration failed');
    router.push('/login?registered=1');
  }

  return (
    <main className="container py-10">
      <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <label className="sr-only" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" className="field" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <label className="sr-only" htmlFor="email">Email</label>
        <input id="email" name="email" className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="sr-only" htmlFor="password">Password</label>
        <input id="password" name="password" className="field" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Creating...' : 'Create account'}</button>
        <p className="text-sm text-slate-300">Already have an account? <Link className="underline" href="/login">Login</Link></p>
      </form>
    </main>
  );
}
