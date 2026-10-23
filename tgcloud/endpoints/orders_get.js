// tgcloud/endpoints/orders_get.js
// Full order details + courier offers.
// Call as: Telegram.WebApp.Serverless.call('orders_get', ...)
import { db, EndpointError } from 'sdk';
import { eq, desc, inArray } from 'sdk/db';
import { orders, offers, users } from '../schema.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}) {
  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required and must be a string.', {
      code: 'INVALID_ORDER_ID',
    });
  }

  const orderId = input.orderId.trim();
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }

  const owner = await db.select().from(users).where(eq(users.id, order.userId)).get();

  const offerRows = await db
    .select()
    .from(offers)
    .where(eq(offers.orderId, orderId))
    .orderBy(desc(offers.createdAt))
    .all();

  const fulfillerIds = [...new Set(offerRows.map((o) => o.fulfillerId).filter(Boolean))];
  const fulfillers =
    fulfillerIds.length > 0
      ? await db.select().from(users).where(inArray(users.id, fulfillerIds)).all()
      : [];
  const nameById = Object.fromEntries(fulfillers.map((u) => [u.id, u.name]));

  return {
    result: {
      order: {
        id: order.id,
        userId: order.userId,
        userName: owner?.name ?? null,
        campusId: order.campusId,
        pickupLocation: order.pickupLocation,
        destination: order.destination,
        instructions: order.instructions ?? null,
        items: order.items,
        status: order.status,
        agreedItemsPrice: order.agreedItemsPrice ?? null,
        agreedDeliveryFee: order.agreedDeliveryFee ?? null,
        agreedEtaMinutes: order.agreedEtaMinutes ?? null,
        fulfillerId: order.fulfillerId ?? null,
        createdAt: toUnixSeconds(order.createdAt),
      },
      offers: offerRows.map((o) => ({
        id: o.id,
        orderId: o.orderId,
        fulfillerId: o.fulfillerId,
        fulfillerName: nameById[o.fulfillerId] ?? null,
        itemsPrice: o.itemsPrice,
        deliveryFee: o.deliveryFee,
        totalAmount: o.itemsPrice + o.deliveryFee,
        etaMinutes: o.etaMinutes,
        note: o.note ?? null,
        items: o.items,
        status: o.status,
        createdAt: toUnixSeconds(o.createdAt),
      })),
    },
  };
}
