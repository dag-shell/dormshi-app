// tgcloud/endpoints/wallet_transactions.js
// List caller's financial audit ledger (paginated).
// Call as: Telegram.WebApp.Serverless.call('wallet_transactions', ...)
import { db, EndpointError } from 'sdk';
import { eq, and, desc } from 'sdk/db';
import { transactions } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { parsePagination, paginationMeta } from '../lib/pagination.js';
import { TXN_TYPES, serializeTransaction } from '../lib/wallet.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);
  const { page, limit, offset } = parsePagination(input);

  let type = null;
  if (input.type != null && input.type !== '') {
    if (typeof input.type !== 'string' || !TXN_TYPES.has(input.type.trim())) {
      throw new EndpointError('Invalid transaction type filter.', {
        code: 'INVALID_TYPE',
        received: input.type,
        allowed: [...TXN_TYPES],
      });
    }
    type = input.type.trim();
  }

  const where = type
    ? and(eq(transactions.userId, user.id), eq(transactions.type, type))
    : eq(transactions.userId, user.id);

  const total = await db.$count(transactions, where);
  const rows = await db
    .select()
    .from(transactions)
    .where(where)
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return {
    results: rows.map(serializeTransaction),
    pagination: paginationMeta(page, limit, total),
  };
}
