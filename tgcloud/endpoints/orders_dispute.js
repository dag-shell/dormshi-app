// tgcloud/endpoints/orders_dispute.js
// Customer or courier raises a dispute on an active order.
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { orders } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

const BLOCKED = new Set(['cancelled', 'completed', 'disputed']);

export default async function (input = {}, ctx) {
  const caller = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required.', { code: 'INVALID_ORDER_ID' });
  }
  if (typeof input.reason !== 'string' || !input.reason.trim()) {
    throw new EndpointError('reason is required.', { code: 'INVALID_REASON' });
  }

  const orderId = input.orderId.trim();
  const reason = input.reason.trim();

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }

  const isOwner = order.userId === caller.id;
  const isFulfiller = order.fulfillerId === caller.id;
  if (!isOwner && !isFulfiller) {
    throw new EndpointError('Only the order owner or courier can dispute this order.', {
      code: 'FORBIDDEN',
    });
  }
  if (BLOCKED.has(order.status)) {
    throw new EndpointError(`Order cannot be disputed from status '${order.status}'.`, {
      code: 'INVALID_STATUS',
      status: order.status,
    });
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: 'disputed',
      disputeReason: reason,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(orders.id, orderId))
    .returning();

  return {
    result: {
      id: updated.id,
      status: updated.status,
      disputeReason: updated.disputeReason,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
