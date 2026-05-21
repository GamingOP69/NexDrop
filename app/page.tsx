import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-10">
      <div className="card p-8 md:p-12">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            NexDrop • single-package full-stack app
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Upload, share, and manage files in one app.
          </h1>
          <p className="max-w-2xl text-slate-300">
            Frontend, API routes, auth, storage, share links, and admin tools all live in the same Next.js project.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="btn btn-primary" href="/register">Create account</Link>
            <Link className="btn btn-ghost" href="/login">Login</Link>
            <Link className="btn btn-ghost" href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
