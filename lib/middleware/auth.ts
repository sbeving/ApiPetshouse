import { NextRequest, NextResponse } from 'next/server';

export interface AuthConfig {
  bearerToken?: string;
  apiKey?: string;
}

/**
 * Authentication middleware that validates Bearer token or X-API-Key
 * 
 * Supports two authentication methods:
 * 1. Bearer token via Authorization header: `Authorization: Bearer <token>`
 * 2. API key via custom header: `X-API-Key: <key>`
 * 
 * @template T - Additional parameters passed to the handler (e.g., route params)
 * @param handler - The Next.js route handler function to wrap
 * @returns Wrapped handler with authentication check
 * 
 * Authentication credentials are read from environment variables:
 * - API_BEARER_TOKEN: Expected bearer token value
 * - API_KEY: Expected API key value
 * 
 * @example
 * ```ts
 * export const GET = withAuth(handleGET);
 * export const POST = withAuth(handlePOST);
 * ```
 * 
 * @throws Returns 401 Unauthorized if neither authentication method succeeds
 */
export function withAuth<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const bearerToken = process.env.API_BEARER_TOKEN;
    const apiKey = process.env.API_KEY;

    // Check Bearer token
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (bearerToken && token === bearerToken) {
        return handler(req, ...args);
      }
    }

    // Check X-API-Key header
    const xApiKey = req.headers.get('x-api-key');
    if (xApiKey && apiKey && xApiKey === apiKey) {
      return handler(req, ...args);
    }

    // Neither authentication method succeeded
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Valid Bearer token or X-API-Key required',
      },
      { status: 401 }
    );
  };
}
