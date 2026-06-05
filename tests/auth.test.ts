import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('JWT_ACCESS_SECRET', 'test-access-secret-12345678901234567890');
vi.stubEnv('JWT_REFRESH_SECRET', 'test-refresh-secret-12345678901234567890');

// Mock prisma to observe session deletion
vi.mock('../lib/prisma', () => {
  return {
    prisma: {
      session: {
        deleteMany: vi.fn()
      }
    }
  };
});

import { prisma } from '../lib/prisma';
import { revokeAllUserSessions } from '../lib/auth';

describe('auth sessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('revokeAllUserSessions calls prisma.session.deleteMany with userId', async () => {
    await revokeAllUserSessions('user-123');
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
  });
});
