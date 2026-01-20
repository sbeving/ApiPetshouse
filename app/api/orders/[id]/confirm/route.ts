import { NextRequest, NextResponse } from 'next/server';
import { getOdooClient } from '@/lib/odoo/client';
import { withAuth } from '@/lib/middleware/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';

/**
 * @swagger
 * /api/orders/{id}/confirm:
 *   post:
 *     summary: Confirm order
 *     description: Confirm a sales order in Odoo (changes state to 'sale')
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order confirmed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
async function handlePOST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
          message: 'Order ID must be a valid integer',
        },
        { status: 400 }
      );
    }

    const odooClient = getOdooClient();

    // Check if order exists
    const orders = await odooClient.searchRead(
      'sale.order',
      [['id', '=', orderId]],
      ['id', 'name', 'state'],
      1
    );

    if (orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
          message: `Order with ID ${orderId} does not exist`,
        },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Check if order can be confirmed
    if (order.state === 'sale') {
      return NextResponse.json(
        {
          success: false,
          error: 'Order already confirmed',
          message: `Order ${order.name} is already confirmed`,
        },
        { status: 400 }
      );
    }

    if (order.state === 'cancel') {
      return NextResponse.json(
        {
          success: false,
          error: 'Order is cancelled',
          message: `Cannot confirm cancelled order ${order.name}`,
        },
        { status: 400 }
      );
    }

    // Confirm the order by calling action_confirm
    await odooClient.call('sale.order', 'action_confirm', [[orderId]]);

    // Read the updated order
    const [updatedOrder] = await odooClient.read(
      'sale.order',
      [orderId],
      ['id', 'name', 'partner_id', 'date_order', 'amount_total', 'state']
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order confirmed successfully',
    });
  } catch (error: any) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to confirm order',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(withAuth(handlePOST));
