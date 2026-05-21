import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { humanSize } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await prisma.file.findMany({
    where: { userId: user.id },
    include: { shareLink: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({
    files: files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      mimeType: f.mimeType,
      size: humanSize(f.size),
      createdAt: f.createdAt,
      shareToken: f.shareLink?.token || null
    }))
  });
}
