import { toUnixSeconds } from './time.js';

export function serializeFeedOrder(row) {
  return {
    id: row.id,
    userId: row.userId,
    campusId: row.campusId,
    pickupLocation: row.pickupLocation,
    destination: row.destination,
    items: row.items,
    status: row.status,
    createdAt: toUnixSeconds(row.createdAt),
  };
}

export function serializeMyOrder(row) {
  return {
    id: row.id,
    userId: row.userId,
    campusId: row.campusId,
    pickupLocation: row.pickupLocation,
    destination: row.destination,
    items: row.items,
    status: row.status,
    agreedItemsPrice: row.agreedItemsPrice ?? null,
    agreedDeliveryFee: row.agreedDeliveryFee ?? null,
    acceptedOfferId: row.acceptedOfferId ?? null,
    fulfillerId: row.fulfillerId ?? null,
    createdAt: toUnixSeconds(row.createdAt),
  };
}

export function serializeCreatedOrder(row) {
  return {
    id: row.id,
    userId: row.userId,
    campusId: row.campusId,
    vendorId: row.vendorId ?? null,
    pickupLocation: row.pickupLocation,
    destination: row.destination,
    instructions: row.instructions ?? null,
    items: row.items,
    status: row.status,
    createdAt: toUnixSeconds(row.createdAt),
  };
}
