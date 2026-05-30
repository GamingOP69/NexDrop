import { Navbar } from '@/components/navbar';
import { UploadZone } from '@/components/upload-zone';
import { DashboardFiles } from '@/components/dashboard-files';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth';
import utils from '@/lib/utils.js';
import { redirect } from 'next/navigation';
import { BOOTSTRAP_ADMIN_SUBJECT } from '@/lib/admin-bootstrap';

type Props = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) redirect('/login');

  // If this session is the bootstrap admin (env-based), send them to the
  // admin UI instead of attempting to load a per-user dashboard from the DB.
  if (user.id === BOOTSTRAP_ADMIN_SUBJECT) {
    redirect('/admin');
  }

  const resolvedSearchParams = (await searchParams) ?? {};

  const page = Math.max(1, Number(resolvedSearchParams.page || '1'));
  const perPage = Math.min(100, Math.max(5, Number(resolvedSearchParams.perPage || '20')));

  const where = { userId: user.id };
  const total = await prisma.file.count({ where });
  const files = await prisma.file.findMany({
    where,
    include: { shareLink: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * perPage,
    take: perPage
  });

  const storageUsed = Number(user.storageUsed);
  const storageLimit = Number(user.storageLimit);
  const storagePercent = storageLimit > 0 ? Math.min(100, Math.round((storageUsed / storageLimit) * 100)) : 0;

  return (
    <>
      <Navbar />
      <main className="page-shell stack-8 pb-12">
        <section className="hero-shell">
          <div className="hero-copy stack-6">
            <span className="eyebrow">File library</span>
            <div className="stack-4">
              <h1 className="title-lg max-w-[12ch]">Your files, shares, and storage at a glance.</h1>
              <p className="supporting max-w-2xl text-base leading-7">
                Keep track of uploads, storage usage, and sharing actions from a dashboard that is easier to scan on every screen.
              </p>
            </div>
            <div className="section-card stack-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="title-sm font-semibold">Storage used</p>
                  <p className="detail mt-1 text-sm">{utils.humanSize(user.storageUsed)} of {utils.humanSize(user.storageLimit)}</p>
                </div>
                <div className="pill">{storagePercent}% full</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--surface)_90%,white)]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_oklab,var(--accent)_70%,black))]" style={{ width: `${storagePercent}%` }} />
              </div>
            </div>
          </div>
          <div className="hero-panel stack-4">
            <div className="section-grid">
              <div className="feature-card">
                <span className="pill">Files</span>
                <p className="detail mt-3 text-sm leading-6">Browse recent uploads and actions from the updated file grid.</p>
              </div>
              <div className="feature-card">
                <span className="pill">Shares</span>
                <p className="detail mt-3 text-sm leading-6">Create or open share links with fewer clicks.</p>
              </div>
              <div className="feature-card">
                <span className="pill">Preview</span>
                <p className="detail mt-3 text-sm leading-6">Open images and videos in a focused viewer.</p>
              </div>
              <div className="feature-card">
                <span className="pill">Upload</span>
                <p className="detail mt-3 text-sm leading-6">Chunked uploads now show progress while they run.</p>
              </div>
            </div>
          </div>
        </section>

        <UploadZone />

        <section className="stack-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="eyebrow">Recent files</span>
              <h2 className="title-md mt-3">Latest uploads</h2>
            </div>
            <p className="meta text-sm">Page {page} of {Math.max(1, Math.ceil(total / perPage))}</p>
          </div>
          <DashboardFiles
            files={files.map((file: any) => ({
              id: file.id,
              originalName: file.originalName,
              mimeType: file.mimeType,
              size: utils.humanSize(file.size),
              createdAt: file.createdAt.toISOString(),
              shareToken: file.shareLink?.token ?? null
            }))}
          />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-[color:var(--muted)]">Showing {files.length} of {total} files</div>
          <div className="flex gap-2">
            {page > 1 ? <a className="btn btn-secondary btn-sm" href={`?page=${page - 1}&perPage=${perPage}`}>Previous</a> : null}
            {page * perPage < total ? <a className="btn btn-secondary btn-sm" href={`?page=${page + 1}&perPage=${perPage}`}>Next</a> : null}
          </div>
        </div>
      </main>
    </>
  );
}
