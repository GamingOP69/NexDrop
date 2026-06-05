import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('JWT_ACCESS_SECRET', 'test-access-secret-12345678901234567890');
vi.stubEnv('JWT_REFRESH_SECRET', 'test-refresh-secret-12345678901234567890');

// Mock prisma and hashToken for both relative and aliased imports
vi.mock('../lib/prisma', () => ({
  prisma: {
    session: {
      deleteMany: vi.fn()
    }
  }
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    session: {
      deleteMany: vi.fn()
    }
  }
}));

vi.mock('../lib/auth', async () => {
  const actual = await vi.importActual('../lib/auth');
  return {
    ...actual,
    hashToken: vi.fn(async () => 'deadbeef')
  };
});
vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual('../lib/auth');
  return {
    ...actual,
    hashToken: vi.fn(async () => 'deadbeef')
  };
});

vi.mock('../lib/logger', () => ({ logServerError: vi.fn(), logServer: vi.fn() }));
vi.mock('@/lib/logger', () => ({ logServerError: vi.fn(), logServer: vi.fn() }));

import { prisma } from '@/lib/prisma';
import { POST } from '../app/api/auth/logout/route';

describe('logout route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes session when refresh cookie present', async () => {
    const req = { cookies: { get: (name: string) => ({ value: 'refresh-token' }) } } as any;
    const res: any = await POST(req);

    expect(prisma.session.deleteMany).toHaveBeenCalledWith({ where: { tokenHash: 'deadbeef' } });
    expect(res.headers.get('x-request-id')).toBeTruthy();
  });

  it('returns ok even when prisma.deleteMany throws', async () => {
    (prisma.session.deleteMany as any).mockImplementationOnce(() => { throw new Error('db down'); });
    const req = { cookies: { get: (name: string) => ({ value: 'refresh-token' }) } } as any;
    const res: any = await POST(req);
    expect(res.headers.get('x-request-id')).toBeTruthy();
  });
});
