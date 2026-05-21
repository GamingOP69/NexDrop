import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdmin();
    const [users, files, shares] = await Promise.all([
      prisma.user.count(),
      prisma.file.count(),
      prisma.shareLink.count()
    ]);
    return NextResponse.json({ users, files, shares });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
