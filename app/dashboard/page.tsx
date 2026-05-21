import { Navbar } from '@/components/navbar';
import { UploadZone } from '@/components/upload-zone';
import { FileGrid } from '@/components/file-grid';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth';
import { humanSize } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/login');

  const files = await prisma.file.findMany({
    where: { userId: user.id },
    include: { shareLink: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Navbar />
      <main className="container pb-12 space-y-6">
        <div className="card p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-300">
            Storage used: {humanSize(user.storageUsed)} / {humanSize(user.storageLimit)}
          </p>
        </div>

        <UploadZone />

        <FileGrid
          files={files.map((file) => ({
            id: file.id,
            originalName: file.originalName,
            mimeType: file.mimeType,
            size: humanSize(file.size),
            createdAt: file.createdAt.toISOString(),
            shareToken: file.shareLink?.token ?? null
          }))}
        />
      </main>
    </>
  );
}
