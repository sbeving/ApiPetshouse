import { NextRequest, NextResponse } from 'next/server';
import { getOdooClient } from '@/lib/odoo/client';
import { withAuth } from '@/lib/middleware/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Search and list pet products
 *     description: |-
 *       Search for pet products including food, toys, accessories, and supplies. 
 *       Returns product details with prices, categories, stock levels, and descriptions.
 *       Use the 'search' parameter to find specific products by name (e.g., "dog food", "cat toy").
 *     operationId: search_products
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
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of products to return (default 10, max 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of products to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter products by name (e.g. "dog food", "cat toy", "leash")
 *         example: dog food
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category name
 *         example: Pet Food
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const odooClient = getOdooClient();

    // Build domain for search
    const domain: any[] = [];
    if (search) {
      domain.push(['name', 'ilike', search]);
    }
    if (category) {
      domain.push(['categ_id.name', 'ilike', category]);
    }

    // Fetch products from Odoo with comprehensive fields
    const products = await odooClient.searchRead(
      'product.template',
      domain,
      [
        'id', 'name', 'display_name', 'list_price', 'standard_price', 
        'currency_id', 'type', 'categ_id', 'description_sale', 'description',
        'default_code', 'barcode', 'active', 'sale_ok', 'purchase_ok',
        'qty_available', 'virtual_available', 'uom_id', 'uom_po_id',
        'product_variant_ids', 'product_variant_count', 'attribute_line_ids'
      ],
      limit,
      offset
    );

    // Format response for better GPT consumption
    const formattedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      display_name: p.display_name,
      price: p.list_price,
      cost: p.standard_price,
      currency: p.currency_id ? p.currency_id[1] : 'USD',
      category: p.categ_id ? p.categ_id[1] : 'Uncategorized',
      category_id: p.categ_id ? p.categ_id[0] : null,
      description: p.description_sale || p.description || '',
      type: p.type,
      sku: p.default_code || '',
      barcode: p.barcode || '',
      available: p.sale_ok,
      stock_quantity: p.qty_available || 0,
      forecasted_quantity: p.virtual_available || 0,
      unit_of_measure: p.uom_id ? p.uom_id[1] : 'Unit',
      has_variants: (p.product_variant_count || 0) > 1,
      variant_count: p.product_variant_count || 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length,
      limit,
      offset,
      has_more: formattedProducts.length === limit,
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
