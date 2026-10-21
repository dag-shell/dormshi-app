// tgcloud/endpoints/users_me.js
// Profile bootstrap — auto-registers the Telegram caller on first launch.
// Call as: Telegram.WebApp.Serverless.call('users_me', ...)
import { db, EndpointError } from 'sdk';
import { eq, asc } from 'sdk/db';
import { users, campuses } from '../schema.js';

function telegramDisplayName(tgUser) {
  const parts = [tgUser.first_name, tgUser.last_name]
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);
  if (parts.length) return parts.join(' ');
  if (tgUser.username) return String(tgUser.username);
  return 'Student';
}

function serializeProfile(row) {
  return {
    id: row.id,
    tgId: row.tgId,
    name: row.name,
    phone: row.phone ?? null,
    campusId: row.campusId,
    isAmbassador: Boolean(row.isAmbassador),
    mainBalance: row.mainBalance,
    rewardBalance: row.rewardBalance,
    escrowBalance: row.escrowBalance,
    rating: row.rating,
    deliveriesCount: row.deliveriesCount,
    ordersCount: row.ordersCount,
  };
}

export default async function (input, ctx) {
  const tgUser = ctx.initData.user;
  const tgId = tgUser.id;

  let user = await db.select().from(users).where(eq(users.tgId, tgId)).get();

  if (!user) {
    // campus_id is NOT NULL — assign the first active campus until onboarding
    // updates it via users.update.
    const defaultCampus = await db
      .select({ id: campuses.id })
      .from(campuses)
      .where(eq(campuses.isActive, true))
      .orderBy(asc(campuses.name))
      .limit(1)
      .get();

    if (!defaultCampus) {
      throw new EndpointError('No active campus available for registration.', {
        code: 'NO_ACTIVE_CAMPUS',
      });
    }

    await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        tgId,
        name: telegramDisplayName(tgUser),
        campusId: defaultCampus.id,
      })
      .onConflictDoNothing({ target: users.tgId });

    user = await db.select().from(users).where(eq(users.tgId, tgId)).get();
  }

  if (!user) {
    throw new EndpointError('Failed to load user profile.', {
      code: 'USER_BOOTSTRAP_FAILED',
    });
  }

  return { result: serializeProfile(user) };
}
