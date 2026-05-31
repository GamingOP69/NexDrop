import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell landing-shell stack-8 pt-5">
      <header className="glass-nav card nav-shell landing-banner">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark" aria-hidden="true">N</span>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-white">NexDrop</div>
              <div className="meta text-xs">MediaFire-style cloud storage for teams</div>
            </div>
          </Link>
        </div>
        <nav className="nav-links text-sm" aria-label="Public navigation">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Create account</Link>
        </nav>
      </header>

      <section className="landing-hero stack-7 text-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
          <span className="eyebrow border-white/10 bg-white/10 text-white">File storage and sharing made simple</span>
          <div className="stack-4 items-center">
            <h1 className="title-xl max-w-[11ch] text-white">File storage and sharing made simple.</h1>
            <p className="supporting max-w-3xl text-lg leading-8">
              A MediaFire-inspired landing page with a single strong call to action, a blue hero panel, and the exact high-contrast, desktop-first feel from the screenshots.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link className="btn btn-primary" href="/register">Upload files now</Link>
            <Link className="btn btn-secondary" href="/login">Sign in</Link>
            <Link className="btn btn-outline" href="/dashboard">Open dashboard</Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="info-card">
            <div className="stat-number">10GB</div>
            <p className="detail mt-1 text-sm">Starter storage for new accounts</p>
          </div>
          <div className="info-card">
            <div className="stat-number">1 click</div>
            <p className="detail mt-1 text-sm">Share links from the dashboard</p>
          </div>
          <div className="info-card">
            <div className="stat-number">24/7</div>
            <p className="detail mt-1 text-sm">Access across phone and desktop</p>
          </div>
        </div>

        <div className="landing-banner card mx-auto w-full max-w-5xl p-5 text-left">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(255,255,255,0.7)]">MediaFire-style workspace</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Upload first. Share first. No clutter.</h2>
              <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.76)]">Dense file rows, visible storage pressure, and large buttons that make the core workflow obvious at a glance.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/register">Create account</Link>
              <Link className="btn btn-secondary" href="/dashboard">Explore files</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card stack-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Trust center</span>
            <h2 className="title-lg mt-3">Policy and compliance pages are available.</h2>
          </div>
          <p className="supporting max-w-2xl text-sm leading-6">The public site now exposes the legal and compliance routes users expect before signing in.</p>
        </div>
        <div className="section-grid">
          <Link href="/legal/privacy" className="feature-card block">
            <span className="pill">Privacy Policy</span>
            <p className="detail mt-3 text-sm leading-6">How account data, uploads, and cookies are handled.</p>
          </Link>
          <Link href="/legal/terms" className="feature-card block">
            <span className="pill">Terms of Use</span>
            <p className="detail mt-3 text-sm leading-6">Usage rules, account responsibilities, and service limits.</p>
          </Link>
          <Link href="/legal/ip-infringement" className="feature-card block">
            <span className="pill">IP Infringement</span>
            <p className="detail mt-3 text-sm leading-6">How copyright or trademark complaints are reported.</p>
          </Link>
          <Link href="/legal/data-compliance" className="feature-card block">
            <span className="pill">Data Compliance</span>
            <p className="detail mt-3 text-sm leading-6">Retention, deletion, access, and operational controls.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
