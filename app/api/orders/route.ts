import { NextRequest, NextResponse } from 'next/server';
import { getOdooClient } from '@/lib/odoo/client';
import { withAuth } from '@/lib/middleware/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List orders
 *     description: Retrieve a list of sales orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create order
 *     description: Create a new sales order in Odoo
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partner_id
 *               - order_lines
 *             properties:
 *               partner_id:
 *                 type: integer
 *                 description: Customer/Partner ID in Odoo
 *               order_lines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                     price_unit:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const odooClient = getOdooClient();

    const orders = await odooClient.searchRead(
      'sale.order',
      [],
      ['id', 'name', 'partner_id', 'date_order', 'amount_total', 'state'],
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    
    if (!body.partner_id || !body.order_lines || !Array.isArray(body.order_lines)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'partner_id and order_lines array are required',
        },
        { status: 400 }
      );
    }

    const odooClient = getOdooClient();

    // Create sale order
    const orderValues: any = {
      partner_id: body.partner_id,
    };

    const orderId = await odooClient.create('sale.order', orderValues);

    // Create order lines
    for (const line of body.order_lines) {
      if (!line.product_id || !line.quantity) {
        // Delete the order if line creation fails
        await odooClient.call('sale.order', 'unlink', [[orderId]]);
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid order line',
            message: 'Each order line must have product_id and quantity',
          },
          { status: 400 }
        );
      }

      const lineValues: any = {
        order_id: orderId,
        product_id: line.product_id,
        product_uom_qty: line.quantity,
      };

      if (line.price_unit !== undefined) {
        lineValues.price_unit = line.price_unit;
      }

      await odooClient.create('sale.order.line', lineValues);
    }

    // Read the created order with details
    const [order] = await odooClient.read(
      'sale.order',
      [orderId],
      ['id', 'name', 'partner_id', 'date_order', 'amount_total', 'state']
    );

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(withAuth(handleGET));
export const POST = withRateLimit(withAuth(handlePOST));
