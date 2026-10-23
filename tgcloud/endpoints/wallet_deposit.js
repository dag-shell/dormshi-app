// tgcloud/endpoints/wallet_deposit.js
// Credit main_balance from a verified CBE transaction reference.
// Call as: Telegram.WebApp.Serverless.call('wallet_deposit', ...)
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { users, transactions } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { verifyCbeDeposit } from '../lib/cbe.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);

  const { txnId, amount } = await verifyCbeDeposit(input.txnId);

  const existing = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.reference, txnId))
    .get();

  if (existing) {
    throw new EndpointError('This CBE transaction has already been credited.', {
      code: 'ALREADY_CREDITED',
      txnId,
      transactionId: existing.id,
    });
  }

  const transactionId = crypto.randomUUID();

  await db
    .update(users)
    .set({
      mainBalance: sql`${users.mainBalance} + ${amount}`,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(users.id, user.id));

  await db.insert(transactions).values({
    id: transactionId,
    userId: user.id,
    type: 'deposit',
    amount,
    reference: txnId,
    status: 'completed',
  });

  const updated = await db.select().from(users).where(eq(users.id, user.id)).get();
  const txn = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .get();

  return {
    result: {
      transactionId,
      txnId,
      amount,
      mainBalance: updated.mainBalance,
      status: 'completed',
      createdAt: toUnixSeconds(txn.createdAt),
    },
  };
}
