// tgcloud/endpoints/orders_cancel.js
// Cancel an order; refund escrow hold if present.
// Call as: Telegram.WebApp.Serverless.call('orders_cancel', ...)
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { orders, users, transactions } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

const TERMINAL = new Set(['cancelled', 'completed']);

export default async function (input = {}, ctx) {
  const caller = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required and must be a string.', {
      code: 'INVALID_ORDER_ID',
    });
  }

  const orderId = input.orderId.trim();
  const reason =
    typeof input.reason === 'string' && input.reason.trim()
      ? input.reason.trim()
      : null;

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }

  const isOwner = order.userId === caller.id;
  const isFulfiller = order.fulfillerId === caller.id;
  if (!isOwner && !isFulfiller) {
    throw new EndpointError('Only the order owner or fulfiller can cancel this order.', {
      code: 'FORBIDDEN',
      orderId,
    });
  }

  if (TERMINAL.has(order.status)) {
    throw new EndpointError(`Order cannot be cancelled from status '${order.status}'.`, {
      code: 'INVALID_STATUS',
      status: order.status,
    });
  }

  // Refund escrow hold to the order owner's main balance when locked.
  if (order.escrowTxnId) {
    const itemsPrice = Number(order.agreedItemsPrice) || 0;
    const deliveryFee = Number(order.agreedDeliveryFee) || 0;
    const totalAmount = itemsPrice + deliveryFee;

    if (totalAmount > 0) {
      await db
        .update(users)
        .set({
          escrowBalance: sql`${users.escrowBalance} - ${totalAmount}`,
          mainBalance: sql`${users.mainBalance} + ${totalAmount}`,
          updatedAt: sql`(unixepoch())`,
        })
        .where(eq(users.id, order.userId));

      await db.insert(transactions).values({
        id: crypto.randomUUID(),
        userId: order.userId,
        counterpartyId: order.fulfillerId ?? null,
        orderId: order.id,
        type: 'refund',
        amount: totalAmount,
        reference: `refund:${order.id}:${order.escrowTxnId}`,
        status: 'completed',
      });
    }
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: 'cancelled',
      cancelReason: reason,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(orders.id, orderId))
    .returning();

  return {
    result: {
      id: updated.id,
      status: updated.status,
      cancelReason: updated.cancelReason ?? null,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
