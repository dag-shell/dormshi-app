// tgcloud/endpoints/users_update.js
// Update profile details (phone, name, or campus branch).
// Call as: Telegram.WebApp.Serverless.call('users_update', ...)
import { db, EndpointError } from 'sdk';
import { eq, sql } from 'sdk/db';
import { users, campuses } from '../schema.js';

function toUnixSeconds(value) {
  if (value == null) return null;
  if (value instanceof Date) return Math.floor(value.getTime() / 1000);
  if (typeof value === 'number') return value;
  return null;
}

export default async function (input, ctx) {
  const tgUser = ctx.initData.user;

  const hasPhone = Object.prototype.hasOwnProperty.call(input, 'phone');
  const hasName = Object.prototype.hasOwnProperty.call(input, 'name');
  const hasCampusId = Object.prototype.hasOwnProperty.call(input, 'campusId');

  if (!hasPhone && !hasName && !hasCampusId) {
    throw new EndpointError('Provide at least one of phone, name, or campusId.', {
      code: 'INVALID_INPUT',
    });
  }

  const patch = {
    updatedAt: sql`(unixepoch())`,
  };

  if (hasPhone) {
    if (typeof input.phone !== 'string' || !input.phone.trim()) {
      throw new EndpointError('phone must be a non-empty string.', {
        code: 'INVALID_PHONE',
      });
    }
    patch.phone = input.phone.trim();
  }

  if (hasName) {
    if (typeof input.name !== 'string' || !input.name.trim()) {
      throw new EndpointError('name must be a non-empty string.', {
        code: 'INVALID_NAME',
      });
    }
    patch.name = input.name.trim();
  }

  if (hasCampusId) {
    if (typeof input.campusId !== 'string' || !input.campusId.trim()) {
      throw new EndpointError('campusId must be a non-empty string.', {
        code: 'INVALID_CAMPUS_ID',
      });
    }

    const campusId = input.campusId.trim();
    const campus = await db
      .select()
      .from(campuses)
      .where(eq(campuses.id, campusId))
      .get();

    if (!campus || !campus.isActive) {
      throw new EndpointError('Campus not found or inactive.', {
        code: 'CAMPUS_NOT_FOUND',
        campusId,
      });
    }

    patch.campusId = campusId;
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.tgId, tgUser.id))
    .get();

  if (!existing) {
    throw new EndpointError('User profile not found. Call users.me first.', {
      code: 'USER_NOT_FOUND',
    });
  }

  const [updated] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, existing.id))
    .returning();

  return {
    result: {
      id: updated.id,
      phone: updated.phone ?? null,
      campusId: updated.campusId,
      updatedAt: toUnixSeconds(updated.updatedAt),
    },
  };
}
