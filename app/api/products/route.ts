import { NextRequest, NextResponse } from 'next/server';
import { getOdooClient } from '@/lib/odoo/client';
import { withAuth } from '@/lib/middleware/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products
 *     description: Retrieve a list of products from Odoo product.template model
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of products to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of products to skip
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    const odooClient = getOdooClient();

    // Build domain for search
    const domain: any[] = [];
    if (search) {
      domain.push(['name', 'ilike', search]);
    }

    // Fetch products from Odoo
    const products = await odooClient.searchRead(
      'product.template',
      domain,
      ['id', 'name', 'list_price', 'standard_price', 'type', 'categ_id', 'description_sale'],
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(withAuth(handleGET));
