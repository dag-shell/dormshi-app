import { db, EndpointError } from 'sdk';
import { eq } from 'sdk/db';
import { users } from '../schema.js';

/** Resolve the caller's users row from verified Telegram init data. */
export async function requireUser(ctx) {
  const tgUser = ctx?.initData?.user;
  if (!tgUser?.id) {
    throw new EndpointError('Missing verified Telegram user.', { code: 'UNAUTHORIZED' });
  }

  const user = await db.select().from(users).where(eq(users.tgId, tgUser.id)).get();
  if (!user) {
    throw new EndpointError('User profile not found. Call users_me first.', {
      code: 'USER_NOT_FOUND',
    });
  }

  return user;
}
