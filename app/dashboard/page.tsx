import { Navbar } from '@/components/navbar';
import { UploadZone } from '@/components/upload-zone';
import { DashboardFiles } from '@/components/dashboard-files';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
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
      <div className="page-shell landing-shell pb-10">
        <div className="dashboard-shell gap-3">
          <DashboardSidebar user={user as any} />
          <main className="dashboard-main stack-4">
            <section className="landing-banner card p-3 sm:p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="stack-3 max-w-3xl">
                  <span className="eyebrow">My Files</span>
                  <h1 className="title-lg max-w-[14ch]">Store, manage, and share files from one place.</h1>
                  <p className="supporting max-w-2xl text-base leading-7">A dense MediaFire-style file manager with quick actions, search, upload progress, and storage awareness.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 xl:w-[34rem]">
                  <div className="info-card">
                    <div className="stat-number">{utils.humanSize(user.storageUsed)}</div>
                    <p className="detail mt-1 text-sm">Used storage</p>
                  </div>
                  <div className="info-card">
                    <div className="stat-number">{files.length}</div>
                    <p className="detail mt-1 text-sm">Visible files</p>
                  </div>
                  <div className="info-card">
                    <div className="stat-number">{storagePercent}%</div>
                    <p className="detail mt-1 text-sm">Storage full</p>
                  </div>
                </div>
              </div>
            </section>

            <UploadZone />

            <section className="section-card stack-4 p-0 overflow-hidden">
              <div className="flex flex-wrap items-end justify-between gap-2 px-4 pt-3 sm:px-5">
                <div>
                  <span className="eyebrow">Recent files</span>
                  <h2 className="title-md mt-2">Latest uploads</h2>
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

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-[color:var(--muted)]">Showing {files.length} of {total} files</div>
              <div className="flex gap-2">
                {page > 1 ? <a className="btn btn-secondary btn-sm" href={`?page=${page - 1}&perPage=${perPage}`}>Previous</a> : null}
                {page * perPage < total ? <a className="btn btn-secondary btn-sm" href={`?page=${page + 1}&perPage=${perPage}`}>Next</a> : null}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
