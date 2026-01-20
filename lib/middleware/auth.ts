import { NextRequest, NextResponse } from 'next/server';

export interface AuthConfig {
  bearerToken?: string;
  apiKey?: string;
}

/**
 * Middleware to validate Bearer token or X-API-Key authentication
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
