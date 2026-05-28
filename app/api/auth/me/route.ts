import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { currentUser } from '@/lib/auth';
import { logServerError } from '@/lib/logger';

export const runtime = 'nodejs';

function normalizeUser(user: any) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isVerified: Boolean(user.isVerified),
    bootstrap: Boolean(user.bootstrap),
    storageUsed: typeof user.storageUsed === 'bigint' ? user.storageUsed.toString() : user.storageUsed,
    storageLimit: typeof user.storageLimit === 'bigint' ? user.storageLimit.toString() : user.storageLimit
  };
}

export async function GET(req: NextRequest) {
  const requestId = randomUUID();

  try {
    const user = await currentUser();
    return NextResponse.json({ user: normalizeUser(user) }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    logServerError('auth.me.failed', error, { requestId });
    return NextResponse.json({ user: null }, { headers: { 'x-request-id': requestId } });
  }
}
