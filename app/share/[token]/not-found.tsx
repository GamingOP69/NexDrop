import Link from 'next/link';

export const metadata = {
  title: 'Share not found — NexDrop'
};

export default function ShareTokenNotFound() {
  return (
    <main className="page-shell stack-6">
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
        <div className="hero-copy stack-5">
          <span className="eyebrow border-white/10 bg-white/10 text-white">Shared file</span>
          <div className="stack-4">
            <h1 className="title-lg max-w-[14ch] text-white">That share link could not be found.</h1>
            <p className="supporting max-w-xl text-base leading-7">The file may have been removed or the link may be stale. Go back to the homepage or sign in to find another copy.</p>
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
