// tgcloud/endpoints/offers_cancel.js
// Withdraw a pending offer before acceptance.
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { offers } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { toUnixSeconds } from '../lib/time.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);

  if (typeof input.offerId !== 'string' || !input.offerId.trim()) {
    throw new EndpointError('offerId is required.', { code: 'INVALID_OFFER_ID' });
  }

  const offerId = input.offerId.trim();
  const offer = await db.select().from(offers).where(eq(offers.id, offerId)).get();
  if (!offer) {
    throw new EndpointError('Offer not found.', { code: 'OFFER_NOT_FOUND', offerId });
  }
  if (offer.fulfillerId !== user.id) {
    throw new EndpointError('Only the offer owner can cancel this bid.', {
      code: 'FORBIDDEN',
    });
  }
  if (offer.status !== 'pending') {
    throw new EndpointError('Only pending offers can be withdrawn.', {
      code: 'INVALID_STATUS',
      status: offer.status,
    });
  }

  const [updated] = await db
    .update(offers)
    .set({
      status: 'cancelled',
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(offers.id, offerId))
    .returning();

  return {
    result: {
      id: updated.id,
      status: updated.status,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
