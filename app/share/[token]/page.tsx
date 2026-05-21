import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SharePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const share = await prisma.shareLink.findUnique({
    where: { token },
    include: { file: true }
  });

  if (!share) notFound();

  if (share.expiresAt && share.expiresAt < new Date()) {
    return <main className="container py-10"><div className="card p-6">This link has expired.</div></main>;
  }

  return (
    <main className="container py-10">
      <div className="card space-y-4 p-6">
        <h1 className="text-2xl font-bold">{share.file.originalName}</h1>
        <p className="text-slate-300">{share.file.mimeType}</p>
        <Link className="btn btn-primary" href={`/api/shares/${share.token}/download`}>Download</Link>
      </div>
    </main>
  );
}
