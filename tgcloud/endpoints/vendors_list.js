// tgcloud/endpoints/vendors_list.js
// List registered dining spots for a campus (paginated).
// Call as: Telegram.WebApp.Serverless.call('vendors_list', ...)
import { db, EndpointError } from 'sdk';
import { eq, and, asc } from 'sdk/db';
import { vendors, campuses } from '../schema.js';

function parsePagination(input) {
  let page = Number(input.page);
  let limit = Number(input.limit);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  page = Math.floor(page);
  limit = Math.min(50, Math.floor(limit));
  return { page, limit, offset: (page - 1) * limit };
}

function serializeVendor(row) {
  return {
    id: row.id,
    campusId: row.campusId,
    name: row.name,
    locationName: row.locationName,
    category: row.category,
  };
}

export default async function (input = {}) {
  if (typeof input.campusId !== 'string' || !input.campusId.trim()) {
    throw new EndpointError('campusId is required and must be a string.', {
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

  const { page, limit, offset } = parsePagination(input);
  const where = and(eq(vendors.campusId, campusId), eq(vendors.isActive, true));

  const total = await db.$count(vendors, where);
  const rows = await db
    .select()
    .from(vendors)
    .where(where)
    .orderBy(asc(vendors.name))
    .limit(limit)
    .offset(offset)
    .all();

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    results: rows.map(serializeVendor),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}
