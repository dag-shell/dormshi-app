// tgcloud/endpoints/orders_my.js
// List the caller's placed orders (paginated).
// Call as: Telegram.WebApp.Serverless.call('orders_my', ...)
import { db } from 'sdk';
import { eq, and, desc } from 'sdk/db';
import { orders } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { parsePagination, paginationMeta } from '../lib/pagination.js';
import { serializeMyOrder } from '../lib/orders.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);
  const { page, limit, offset } = parsePagination(input);

  const status =
    typeof input.status === 'string' && input.status.trim()
      ? input.status.trim()
      : null;

  const where = status
    ? and(eq(orders.userId, user.id), eq(orders.status, status))
    : eq(orders.userId, user.id);

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
    results: rows.map(serializeMyOrder),
    pagination: paginationMeta(page, limit, total),
  };
}
