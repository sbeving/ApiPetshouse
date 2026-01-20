import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or similar
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    maxRequests?: number;
    windowMs?: number;
  }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const maxRequests = options?.maxRequests || 
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    const windowMs = options?.windowMs || 
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');

    // Use IP or a combination of IP and path as key
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const key = `${clientIp}:${req.nextUrl.pathname}`;

    const now = Date.now();
    const record = store[key];

    // Clean up old records periodically
    if (Math.random() < 0.01) {
      Object.keys(store).forEach(k => {
        if (store[k].resetTime < now) {
          delete store[k];
        }
      });
    }

    if (!record || record.resetTime < now) {
      // Create new record
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else if (record.count < maxRequests) {
      // Increment counter
      record.count++;
    } else {
      // Rate limit exceeded
      const resetIn = Math.ceil((record.resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
          retryAfter: resetIn,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString(),
          }
        }
      );
    }

    const response = await handler(req);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', 
      (maxRequests - store[key].count).toString());
    response.headers.set('X-RateLimit-Reset', 
      store[key].resetTime.toString());

    return response;
  };
}
