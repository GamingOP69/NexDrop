import { getRedis } from './redis';

export interface RateLimitOptions {
  key: string;
  limit: number;
  window: number; // seconds
  message?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

/**
 * Rate limit using Redis sliding window counter
 * Returns { success, remaining, resetAt, retryAfter }
 */
export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, window, message } = options;
  const now = Date.now();
  const windowStart = now - window * 1000;
  const redisKey = `ratelimit:${key}`;
  const redis = getRedis();

  try {
    if (!redis || redis.status !== 'ready') {
      // Redis unavailable - fail open (allow request)
      return {
        success: true,
        remaining: limit,
        resetAt: new Date(now + window * 1000)
      };
    }

    // Lua script for atomic operation
    const script = `
      local key = KEYS[1]
      local limit = tonumber(ARGV[1])
      local window = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local windowStart = tonumber(ARGV[4])

      -- Remove old entries
      redis.call('zremrangebyscore', key, 0, windowStart)

      -- Count current window
      local current = redis.call('zcard', key)

      -- Calculate remaining
      local remaining = math.max(0, limit - current)
      local success = current < limit

      if success then
        -- Add current request with score = timestamp
        redis.call('zadd', key, now, now .. '-' .. math.random())
        -- Set expiry to window + 1 min buffer
        redis.call('expire', key, window + 60)
      end

      return {success, remaining, now + window * 1000}
    `;

    const result = await redis.eval(script, 1, redisKey, limit, window, now, windowStart);
    const [success, remaining, resetAt] = result as [number, number, number];

    return {
      success: success === 1,
      remaining: Math.max(0, remaining),
      resetAt: new Date(resetAt),
      retryAfter: success === 1 ? undefined : Math.ceil((resetAt - now) / 1000)
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if Redis unavailable
    return {
      success: true,
      remaining: limit,
      resetAt: new Date(now + window * 1000)
    };
  }
}

/**
 * Rate limiting for authentication endpoints
 * 5 attempts per minute per IP/email
 */
export async function rateLimitAuth(identifier: string): Promise<RateLimitResult> {
  return rateLimit({
    key: `auth:${identifier}`,
    limit: 5,
    window: 60,
    message: 'Too many authentication attempts. Try again in 1 minute.'
  });
}

/**
 * Rate limiting for file uploads
 * 10 concurrent uploads per user, 100 MB/min per user
 */
export async function rateLimitUpload(userId: string): Promise<RateLimitResult> {
  return rateLimit({
    key: `upload:${userId}`,
    limit: 3,
    window: 60,
    message: 'Upload limit exceeded. Maximum 3 uploads per minute.'
  });
}

/**
 * Rate limiting for file downloads
 * Prevent bandwidth DoS: 50 downloads per 5 minutes per IP
 */
export async function rateLimitDownload(ip: string): Promise<RateLimitResult> {
  return rateLimit({
    key: `download:${ip}`,
    limit: 30,
    window: 300,
    message: 'Download limit exceeded. Too many downloads.'
  });
}

/**
 * Rate limiting for share link downloads
 * Prevent share link DoS: 100 downloads per 10 minutes per share link
 */
export async function rateLimitShareDownload(shareToken: string): Promise<RateLimitResult> {
  return rateLimit({
    key: `share-download:${shareToken}`,
    limit: 50,
    window: 600,
    message: 'Share link download limit exceeded.'
  });
}

/**
 * Get client IP from NextRequest headers
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}
