import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell stack-10 pt-5">
      <header className="glass-nav card nav-shell">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark">N</span>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">NexDrop</div>
              <div className="meta text-xs">Classic cloud storage for teams</div>
            </div>
          </Link>
        </div>
        <nav className="nav-links text-sm" aria-label="Public navigation">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Create account</Link>
        </nav>
      </header>

      <section className="hero-shell">
        <div className="hero-copy stack-6">
          <span className="eyebrow">MediaFire-style cloud workspace</span>
          <div className="stack-4">
            <h1 className="title-xl max-w-[11ch]">Fast file sharing, cleaner than ever.</h1>
            <p className="supporting max-w-2xl text-lg leading-8">
              NexDrop gives you a cleaner upload-first workspace with prominent sharing, strong file previews, and a polished interface that feels closer to a modern file host.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/register">Create account</Link>
            <Link className="btn btn-secondary" href="/login">Sign in</Link>
            <Link className="btn btn-ghost" href="/dashboard">Open dashboard</Link>
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
        </div>

        <div className="hero-panel stack-6">
          <div className="section-card stack-4">
            <span className="pill">Instant file actions</span>
            <div className="section-grid">
              <div className="feature-card">
                <p className="title-sm font-semibold">Upload</p>
                <p className="detail mt-2 text-sm leading-6">Chunked uploads with visible progress and quota checks.</p>
              </div>
              <div className="feature-card">
                <p className="title-sm font-semibold">Preview</p>
                <p className="detail mt-2 text-sm leading-6">Open images and videos in a clean, focused modal.</p>
              </div>
              <div className="feature-card">
                <p className="title-sm font-semibold">Share</p>
                <p className="detail mt-2 text-sm leading-6">Generate a share link in one click and copy it instantly.</p>
              </div>
              <div className="feature-card">
                <p className="title-sm font-semibold">Manage</p>
                <p className="detail mt-2 text-sm leading-6">See recent uploads, sizes, and actions at a glance.</p>
              </div>
            </div>
          </div>
          <div className="section-grid">
            <div className="feature-card">
              <span className="pill">Fast</span>
              <p className="detail mt-3 text-sm leading-6">Chunked uploads, instant share links, and responsive feedback.</p>
            </div>
            <div className="feature-card">
              <span className="pill">Accessible</span>
              <p className="detail mt-3 text-sm leading-6">Better contrast, focus states, and keyboard-friendly navigation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-shell">
        <div className="section-card stack-5">
          <span className="eyebrow">Simple workflow</span>
          <div className="stack-4">
            <h2 className="title-lg max-w-[12ch]">Upload, preview, share, done.</h2>
            <p className="supporting text-base leading-7">The layout is now centered on the three things users do most: add files, find files, and ship links quickly.</p>
          </div>
          <div className="section-grid">
            <div className="feature-card">
              <p className="title-sm font-semibold">1. Upload</p>
              <p className="detail mt-2 text-sm leading-6">Add files from any device with progress feedback and quota awareness.</p>
            </div>
            <div className="feature-card">
              <p className="title-sm font-semibold">2. Organize</p>
              <p className="detail mt-2 text-sm leading-6">Keep track of files, preview items, and manage access in one place.</p>
            </div>
            <div className="feature-card">
              <p className="title-sm font-semibold">3. Share</p>
              <p className="detail mt-2 text-sm leading-6">Create clean links for downloads, clients, and team handoffs.</p>
            </div>
          </div>
        </div>
        <div className="section-card stack-5">
          <span className="eyebrow">Responsive by default</span>
          <div className="stack-4">
            <h2 className="title-lg max-w-[12ch]">Built to look steady on every screen.</h2>
            <p className="supporting text-base leading-7">Cards, spacing, and action groups collapse cleanly on mobile while staying wide and readable on desktop.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="info-card">
              <p className="title-sm font-semibold">Mobile</p>
              <p className="detail mt-2 text-sm leading-6">Stacks content, stretches buttons, and keeps key actions easy to tap.</p>
            </div>
            <div className="info-card">
              <p className="title-sm font-semibold">Desktop</p>
              <p className="detail mt-2 text-sm leading-6">Uses the wider viewport for clearer hierarchy and calmer scanning.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-shell">
        <div className="section-card stack-5">
          <span className="eyebrow">How it works</span>
          <div className="section-grid">
            <div className="feature-card">
              <span className="pill">01</span>
              <p className="title-sm mt-3 font-semibold">Upload in the dashboard</p>
              <p className="detail mt-2 text-sm leading-6">Drag and drop files, monitor progress, and stay within quota limits.</p>
            </div>
            <div className="feature-card">
              <span className="pill">02</span>
              <p className="title-sm mt-3 font-semibold">Create a share link</p>
              <p className="detail mt-2 text-sm leading-6">Publish a clean link for colleagues, clients, or public downloads.</p>
            </div>
            <div className="feature-card">
              <span className="pill">03</span>
              <p className="title-sm mt-3 font-semibold">Track everything</p>
              <p className="detail mt-2 text-sm leading-6">Manage files, shares, and admin tools from one familiar place.</p>
            </div>
          </div>
        </div>
        <div className="section-card stack-5">
          <span className="eyebrow">Designed for teams</span>
          <div className="stack-4">
            <h2 className="title-lg max-w-[13ch]">Classic layout, modern behavior.</h2>
            <p className="supporting text-base leading-7">
              The interface keeps the familiar structure people expect from file apps, but it adds cleaner spacing, stronger hierarchy, and a more premium visual style.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/register">Start free</Link>
            <Link className="btn btn-secondary" href="/dashboard">See dashboard</Link>
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
