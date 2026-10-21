// tgcloud/endpoints/offers_my.js
// List caller's courier offers (paginated).
import { db } from 'sdk';
import { eq, and, desc } from 'sdk/db';
import { offers } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { parsePagination, paginationMeta } from '../lib/pagination.js';
import { serializeOffer } from '../lib/offers.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);
  const { page, limit, offset } = parsePagination(input);

  const status =
    typeof input.status === 'string' && input.status.trim()
      ? input.status.trim()
      : null;

  const where = status
    ? and(eq(offers.fulfillerId, user.id), eq(offers.status, status))
    : eq(offers.fulfillerId, user.id);

  const total = await db.$count(offers, where);
  const rows = await db
    .select()
    .from(offers)
    .where(where)
    .orderBy(desc(offers.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return {
    results: rows.map(serializeOffer),
    pagination: paginationMeta(page, limit, total),
  };
}
