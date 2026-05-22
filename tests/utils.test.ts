import { describe, it, expect } from 'vitest';
import { safeFileName, humanSize } from '../lib/utils';

describe('utils', () => {
  it('safeFileName replaces unsafe chars and trims length', () => {
    const name = 'a/b\\c?d*e:<>|"'.repeat(10);
    const cleaned = safeFileName(name);
    expect(cleaned).not.toContain('/');
    expect(cleaned).not.toContain('\\');
    expect(cleaned.length).toBeLessThanOrEqual(180);
  });

  it('humanSize formats sizes', () => {
    expect(humanSize(512)).toBe('512 B');
    expect(humanSize(2048)).toMatch(/KB$/);
    expect(humanSize(5 * 1024 * 1024)).toMatch(/MB$/);
  });
});
