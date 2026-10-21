// tgcloud/endpoints/orders_update_status.js
// Courier advances delivery progression.
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { orders, orderStatusHistory } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

const ALLOWED = {
  accepted: 'getting_food',
  getting_food: 'picked_up',
  picked_up: 'on_the_way',
  on_the_way: 'delivered',
};

export default async function (input = {}, ctx) {
  const courier = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required.', { code: 'INVALID_ORDER_ID' });
  }
  if (typeof input.status !== 'string' || !input.status.trim()) {
    throw new EndpointError('status is required.', { code: 'INVALID_STATUS' });
  }

  const orderId = input.orderId.trim();
  const nextStatus = input.status.trim();
  const note =
    typeof input.note === 'string' && input.note.trim() ? input.note.trim() : null;

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }
  if (order.fulfillerId !== courier.id) {
    throw new EndpointError('Only the accepted courier can update delivery status.', {
      code: 'FORBIDDEN',
    });
  }

  const expected = ALLOWED[order.status];
  if (!expected || expected !== nextStatus) {
    throw new EndpointError(
      `Invalid transition from '${order.status}' to '${nextStatus}'.`,
      {
        code: 'INVALID_TRANSITION',
        from: order.status,
        to: nextStatus,
        expected: expected ?? null,
      }
    );
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: nextStatus,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(orders.id, orderId))
    .returning();

  await db.insert(orderStatusHistory).values({
    id: crypto.randomUUID(),
    orderId,
    status: nextStatus,
    actorId: courier.id,
    note,
  });

  return {
    result: {
      id: updated.id,
      status: updated.status,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
