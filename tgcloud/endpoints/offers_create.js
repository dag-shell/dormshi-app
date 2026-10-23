// tgcloud/endpoints/offers_create.js
// Courier submits a price/ETA quote on an open order.
import { db, EndpointError } from 'sdk';
import { eq } from 'sdk/db';
import { orders, offers } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { serializeOfferCreate } from '../lib/offers.js';

export default async function (input = {}, ctx) {
  const courier = await requireUser(ctx);

  if (typeof input.orderId !== 'string' || !input.orderId.trim()) {
    throw new EndpointError('orderId is required.', { code: 'INVALID_ORDER_ID' });
  }

  const orderId = input.orderId.trim();
  const itemsPrice = Number(input.itemsPrice);
  const deliveryFee = Number(input.deliveryFee);
  const etaMinutes = Number(input.etaMinutes);

  if (!Number.isFinite(itemsPrice) || itemsPrice <= 0) {
    throw new EndpointError('itemsPrice must be greater than 0.', {
      code: 'INVALID_ITEMS_PRICE',
    });
  }
  if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
    throw new EndpointError('deliveryFee must be >= 0.', {
      code: 'INVALID_DELIVERY_FEE',
    });
  }
  if (!Number.isFinite(etaMinutes) || etaMinutes < 1) {
    throw new EndpointError('etaMinutes must be >= 1.', {
      code: 'INVALID_ETA',
    });
  }
  if (!Array.isArray(input.items) || input.items.length < 1) {
    throw new EndpointError('items must be a non-empty array.', {
      code: 'INVALID_ITEMS',
    });
  }

  const items = input.items.map((item, index) => {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) {
      throw new EndpointError(`items[${index}].name is required.`, {
        code: 'INVALID_ITEMS',
        index,
      });
    }
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new EndpointError(`items[${index}].quantity must be >= 1.`, {
        code: 'INVALID_ITEMS',
        index,
      });
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new EndpointError(`items[${index}].unitPrice must be >= 0.`, {
        code: 'INVALID_ITEMS',
        index,
      });
    }
    return {
      name: item.name.trim(),
      quantity: Math.floor(quantity),
      unitPrice,
    };
  });

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) {
    throw new EndpointError('Order not found.', { code: 'ORDER_NOT_FOUND', orderId });
  }
  if (order.status !== 'open') {
    throw new EndpointError('Offers can only be placed on open orders.', {
      code: 'INVALID_STATUS',
      status: order.status,
    });
  }
  if (order.userId === courier.id) {
    throw new EndpointError('You cannot bid on your own order.', {
      code: 'CANNOT_BID_OWN_ORDER',
    });
  }

  const note =
    typeof input.note === 'string' && input.note.trim() ? input.note.trim() : null;

  const [created] = await db
    .insert(offers)
    .values({
      id: crypto.randomUUID(),
      orderId,
      fulfillerId: courier.id,
      itemsPrice,
      deliveryFee,
      etaMinutes: Math.floor(etaMinutes),
      note,
      items,
      status: 'pending',
    })
    .returning();

  return { result: serializeOfferCreate(created) };
}
