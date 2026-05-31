"use client";

import Head from 'next/head';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <main className="page-shell stack-6">
      <Head>
        <title>Error — NexDrop</title>
      </Head>
      <header className="glass-nav card nav-shell landing-banner">
        <Link href="/" className="flex items-center gap-3">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="font-semibold tracking-tight text-white">NexDrop</span>
        </Link>
        <div className="nav-links text-sm">
          <Link href="/login" className="text-white">Sign in</Link>
          <Link href="/register" className="text-white">Create account</Link>
        </div>
      </header>

      <section className="landing-hero stack-6">
        <div className="hero-copy stack-6 max-w-3xl">
          <span className="eyebrow border-white/10 bg-white/10 text-white">Something went wrong</span>
          <div className="stack-4">
            <h1 className="title-lg max-w-[14ch] text-white">An unexpected error occurred.</h1>
            <p className="supporting max-w-xl text-base leading-7">Try refreshing the page or return to the homepage. If the problem persists, contact support.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/">Home</Link>
            <Link className="btn btn-secondary" href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
