import { toUnixSeconds } from './time.js';

export function serializeOffer(row) {
  return {
    id: row.id,
    orderId: row.orderId,
    fulfillerId: row.fulfillerId,
    itemsPrice: row.itemsPrice,
    deliveryFee: row.deliveryFee,
    etaMinutes: row.etaMinutes,
    note: row.note ?? null,
    items: row.items,
    status: row.status,
    createdAt: toUnixSeconds(row.createdAt),
    updatedAt: toUnixSeconds(row.updatedAt),
  };
}

export function serializeOfferCreate(row) {
  return {
    id: row.id,
    orderId: row.orderId,
    fulfillerId: row.fulfillerId,
    itemsPrice: row.itemsPrice,
    deliveryFee: row.deliveryFee,
    etaMinutes: row.etaMinutes,
    note: row.note ?? null,
    items: row.items,
    status: row.status,
    createdAt: toUnixSeconds(row.createdAt),
  };
}
