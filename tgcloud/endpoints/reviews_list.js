// tgcloud/endpoints/reviews_list.js
// List ratings and reviews received by a courier (paginated).
// Call as: Telegram.WebApp.Serverless.call('reviews_list', ...)
import { db, EndpointError } from 'sdk';
import { eq, desc, inArray } from 'sdk/db';
import { userReviews, users } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { parsePagination, paginationMeta } from '../lib/pagination.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}, ctx) {
  await requireUser(ctx);

  if (typeof input.userId !== 'string' || !input.userId.trim()) {
    throw new EndpointError('userId is required and must be a string.', {
      code: 'INVALID_USER_ID',
    });
  }

  const userId = input.userId.trim();
  const { page, limit, offset } = parsePagination(input);
  const where = eq(userReviews.revieweeId, userId);

  const total = await db.$count(userReviews, where);
  const rows = await db
    .select()
    .from(userReviews)
    .where(where)
    .orderBy(desc(userReviews.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  const reviewerIds = [...new Set(rows.map((r) => r.reviewerId))];
  const nameById = new Map();
  if (reviewerIds.length > 0) {
    const reviewers = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(inArray(users.id, reviewerIds))
      .all();
    for (const r of reviewers) nameById.set(r.id, r.name);
  }

  return {
    results: rows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      reviewerId: row.reviewerId,
      reviewerName: nameById.get(row.reviewerId) ?? 'Unknown',
      rating: row.rating,
      comment: row.comment ?? null,
      createdAt: toUnixSeconds(row.createdAt),
    })),
    pagination: paginationMeta(page, limit, total),
  };
}
