// tgcloud/endpoints/wallet_transfer.js
// Peer-to-peer main_balance transfer by recipient Telegram ID.
// Call as: Telegram.WebApp.Serverless.call('wallet_transfer', ...)
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { users, transactions } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}, ctx) {
  const sender = await requireUser(ctx);

  const recipientTgId = Number(input.recipientTgId);
  if (!Number.isFinite(recipientTgId) || !Number.isInteger(recipientTgId) || recipientTgId <= 0) {
    throw new EndpointError('recipientTgId must be a positive integer Telegram user id.', {
      code: 'INVALID_RECIPIENT',
      received: input.recipientTgId,
    });
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new EndpointError('amount must be a number greater than 0.', {
      code: 'INVALID_AMOUNT',
      received: input.amount,
    });
  }

  if (sender.tgId === recipientTgId) {
    throw new EndpointError('Cannot transfer to yourself.', {
      code: 'INVALID_RECIPIENT',
    });
  }

  if (sender.mainBalance < amount) {
    throw new EndpointError('Insufficient wallet balance for this transfer.', {
      code: 'INSUFFICIENT_FUNDS',
      required: amount,
      available: sender.mainBalance,
    });
  }

  const recipient = await db
    .select()
    .from(users)
    .where(eq(users.tgId, recipientTgId))
    .get();

  if (!recipient) {
    throw new EndpointError('Recipient not found. They must open the Mini App once.', {
      code: 'RECIPIENT_NOT_FOUND',
      recipientTgId,
    });
  }

  const transferRef = `transfer:${crypto.randomUUID()}`;
  const senderTxnId = crypto.randomUUID();
  const recipientTxnId = crypto.randomUUID();

  await db
    .update(users)
    .set({
      mainBalance: sql`${users.mainBalance} - ${amount}`,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(users.id, sender.id));

  await db
    .update(users)
    .set({
      mainBalance: sql`${users.mainBalance} + ${amount}`,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(users.id, recipient.id));

  await db.insert(transactions).values([
    {
      id: senderTxnId,
      userId: sender.id,
      counterpartyId: recipient.id,
      type: 'transfer',
      amount,
      reference: `${transferRef}:out`,
      status: 'completed',
    },
    {
      id: recipientTxnId,
      userId: recipient.id,
      counterpartyId: sender.id,
      type: 'transfer',
      amount,
      reference: `${transferRef}:in`,
      status: 'completed',
    },
  ]);

  const updatedSender = await db.select().from(users).where(eq(users.id, sender.id)).get();
  const senderTxn = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, senderTxnId))
    .get();

  return {
    result: {
      transactionId: senderTxnId,
      recipientTxnId,
      recipientTgId,
      amount,
      mainBalance: updatedSender.mainBalance,
      status: 'completed',
      createdAt: toUnixSeconds(senderTxn.createdAt),
    },
  };
}
