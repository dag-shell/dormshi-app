// tgcloud/endpoints/orders_feed.js
// List campus delivery requests (paginated).
// Call as: Telegram.WebApp.Serverless.call('orders_feed', ...)
import { db, EndpointError } from 'sdk';
import { eq, and, desc } from 'sdk/db';
import { orders } from '../schema.js';
import { parsePagination, paginationMeta } from '../lib/pagination.js';
import { serializeFeedOrder } from '../lib/orders.js';

export default async function (input = {}) {
  if (typeof input.campusId !== 'string' || !input.campusId.trim()) {
    throw new EndpointError('campusId is required and must be a string.', {
      code: 'INVALID_CAMPUS_ID',
    });
  }

  const campusId = input.campusId.trim();
  const status =
    typeof input.status === 'string' && input.status.trim()
      ? input.status.trim()
      : 'open';

  const { page, limit, offset } = parsePagination(input);
  const where = and(eq(orders.campusId, campusId), eq(orders.status, status));

  const total = await db.$count(orders, where);
  const rows = await db
    .select()
    .from(orders)
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return {
    results: rows.map(serializeFeedOrder),
    pagination: paginationMeta(page, limit, total),
  };
}
