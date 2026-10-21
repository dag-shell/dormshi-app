// tgcloud/endpoints/orders_confirm.js
// Requester confirms delivery, releases escrow, and rates courier.
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { orders, users, transactions, userReviews } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

const CONFIRMABLE = new Set(['delivered', 'on_the_way']);

export default async function (input = {}, ctx) {
  const customer = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required.', { code: 'INVALID_ORDER_ID' });
  }

  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new EndpointError('rating must be an integer between 1 and 5.', {
      code: 'INVALID_RATING',
      received: input.rating,
    });
  }

  const orderId = input.orderId.trim();
  const comment =
    typeof input.comment === 'string' && input.comment.trim()
      ? input.comment.trim().slice(0, 500)
      : null;

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }
  if (order.userId !== customer.id) {
    throw new EndpointError('Only the order owner can confirm delivery.', {
      code: 'FORBIDDEN',
    });
  }
  if (!CONFIRMABLE.has(order.status)) {
    throw new EndpointError(
      `Order must be on_the_way or delivered to confirm (got '${order.status}').`,
      { code: 'INVALID_STATUS', status: order.status }
    );
  }
  if (!order.fulfillerId) {
    throw new EndpointError('Order has no assigned courier.', {
      code: 'NO_FULFILLER',
    });
  }

  const itemsPrice = Number(order.agreedItemsPrice) || 0;
  const deliveryFee = Number(order.agreedDeliveryFee) || 0;
  const totalAmount = itemsPrice + deliveryFee;

  if (totalAmount > 0) {
    await db
      .update(users)
      .set({
        escrowBalance: sql`${users.escrowBalance} - ${totalAmount}`,
        ordersCount: sql`${users.ordersCount} + 1`,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(users.id, customer.id));

    await db
      .update(users)
      .set({
        mainBalance: sql`${users.mainBalance} + ${totalAmount}`,
        deliveriesCount: sql`${users.deliveriesCount} + 1`,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(users.id, order.fulfillerId));

    await db.insert(transactions).values({
      id: crypto.randomUUID(),
      userId: customer.id,
      counterpartyId: order.fulfillerId,
      orderId,
      type: 'purchased',
      amount: totalAmount,
      reference: `purchased:${orderId}`,
      status: 'completed',
    });

    await db.insert(transactions).values({
      id: crypto.randomUUID(),
      userId: order.fulfillerId,
      counterpartyId: customer.id,
      orderId,
      type: 'earned',
      amount: totalAmount,
      reference: `earned:${orderId}`,
      status: 'completed',
    });
  } else {
    await db
      .update(users)
      .set({
        ordersCount: sql`${users.ordersCount} + 1`,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(users.id, customer.id));

    await db
      .update(users)
      .set({
        deliveriesCount: sql`${users.deliveriesCount} + 1`,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(users.id, order.fulfillerId));
  }

  const reviewId = crypto.randomUUID();
  await db.insert(userReviews).values({
    id: reviewId,
    orderId,
    reviewerId: customer.id,
    revieweeId: order.fulfillerId,
    rating,
    comment,
  });

  // Recalculate cached courier rating from all reviews.
  const reviewRows = await db
    .select({ rating: userReviews.rating })
    .from(userReviews)
    .where(eq(userReviews.revieweeId, order.fulfillerId))
    .all();
  const avg =
    reviewRows.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviewRows.length, 1);

  await db
    .update(users)
    .set({
      rating: avg,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(users.id, order.fulfillerId));

  const [updated] = await db
    .update(orders)
    .set({
      status: 'completed',
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(orders.id, orderId))
    .returning();

  return {
    result: {
      id: updated.id,
      status: updated.status,
      reviewId,
      rating,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
