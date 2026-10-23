// tgcloud/endpoints/offers_accept.js
// Requester accepts an offer and locks escrow.
import { db, EndpointError } from 'sdk';
import { eq, and, sql } from 'sdk/db';
import { orders, offers, users, transactions } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}, ctx) {
  const customer = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required.', { code: 'INVALID_ORDER_ID' });
  }
  if (typeof input.offerId !== 'string' || !input.offerId.trim()) {
    throw new EndpointError('offerId is required.', { code: 'INVALID_OFFER_ID' });
  }

  const orderId = input.orderId.trim();
  const offerId = input.offerId.trim();

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }
  if (order.userId !== customer.id) {
    throw new EndpointError('Only the order owner can accept an offer.', {
      code: 'FORBIDDEN',
    });
  }
  if (order.status !== 'open') {
    throw new EndpointError('Order must be open to accept an offer.', {
      code: 'INVALID_STATUS',
      status: order.status,
    });
  }

  const offer = await db.select().from(offers).where(eq(offers.id, offerId)).get();
  if (!offer || offer.orderId !== orderId) {
    throw new EndpointError('Offer not found for this order.', {
      code: 'OFFER_NOT_FOUND',
      offerId,
    });
  }
  if (offer.status !== 'pending') {
    throw new EndpointError('Offer is not pending.', {
      code: 'INVALID_STATUS',
      status: offer.status,
    });
  }

  const total = offer.itemsPrice + offer.deliveryFee;
  if (customer.mainBalance < total) {
    throw new EndpointError('Insufficient wallet balance to accept this offer.', {
      code: 'INSUFFICIENT_FUNDS',
      required: total,
      available: customer.mainBalance,
    });
  }

  const txnId = crypto.randomUUID();

  await db
    .update(users)
    .set({
      mainBalance: sql`${users.mainBalance} - ${total}`,
      escrowBalance: sql`${users.escrowBalance} + ${total}`,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(users.id, customer.id));

  await db.insert(transactions).values({
    id: txnId,
    userId: customer.id,
    counterpartyId: offer.fulfillerId,
    orderId,
    type: 'reserved',
    amount: total,
    reference: `reserved:${orderId}:${offerId}`,
    status: 'completed',
  });

  const [updatedOrder] = await db
    .update(orders)
    .set({
      acceptedOfferId: offer.id,
      fulfillerId: offer.fulfillerId,
      agreedItemsPrice: offer.itemsPrice,
      agreedDeliveryFee: offer.deliveryFee,
      agreedEtaMinutes: offer.etaMinutes,
      escrowTxnId: txnId,
      acceptedAt: sql`(unixepoch())`,
      status: 'accepted',
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(orders.id, orderId))
    .returning();

  await db
    .update(offers)
    .set({
      status: 'accepted',
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(offers.id, offerId));

  await db
    .update(offers)
    .set({
      status: 'rejected',
      updatedAt: sql`(unixepoch())`,
    })
    .where(and(eq(offers.orderId, orderId), eq(offers.status, 'pending')));

  return {
    result: {
      id: updatedOrder.id,
      status: updatedOrder.status,
      acceptedOfferId: updatedOrder.acceptedOfferId,
      fulfillerId: updatedOrder.fulfillerId,
      agreedItemsPrice: updatedOrder.agreedItemsPrice,
      agreedDeliveryFee: updatedOrder.agreedDeliveryFee,
      agreedEtaMinutes: updatedOrder.agreedEtaMinutes,
      escrowTxnId: updatedOrder.escrowTxnId,
      acceptedAt: toUnixSeconds(updatedOrder.acceptedAt),
    },
  };
}
