import { Navbar } from '@/components/navbar';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  try {
    const user = await requireAdmin();
    const [users, files, shares] = await Promise.all([
      prisma.user.count(),
      prisma.file.count(),
      prisma.shareLink.count()
    ]);

    return (
      <>
        <Navbar />
        <main className="container pb-12">
          <div className="card p-6">
            <h1 className="text-3xl font-bold">Admin</h1>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="card p-4">Users: {users}</div>
              <div className="card p-4">Files: {files}</div>
              <div className="card p-4">Share links: {shares}</div>
            </div>
          </div>
        </main>
      </>
    );
  } catch {
    redirect('/login');
  }
}
