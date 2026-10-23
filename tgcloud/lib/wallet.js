import { toUnixSeconds } from './time.js';

export const TXN_TYPES = new Set([
  'deposit',
  'withdrawal',
  'purchased',
  'earned',
  'reward',
  'transfer',
  'refund',
  'reserved',
]);

export function serializeTransaction(row) {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    amount: row.amount,
    orderId: row.orderId ?? null,
    reference: row.reference ?? null,
    status: row.status,
    createdAt: toUnixSeconds(row.createdAt),
  };
}
