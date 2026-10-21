// tgcloud/endpoints/campuses_list.js
// List / search active university campus branches.
// Call as: Telegram.WebApp.Serverless.call('campuses_list', ...)
import { db } from 'sdk';
import { eq, and, or, like, asc } from 'sdk/db';
import { campuses } from '../schema.js';

function serializeCampus(row) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    univCode: row.univCode,
    univName: row.univName,
  };
}

export default async function (input = {}) {
  const query =
    typeof input.query === 'string' && input.query.trim()
      ? input.query.trim()
      : null;

  let rows;

  if (query) {
    const pattern = `%${query}%`;
    rows = await db
      .select()
      .from(campuses)
      .where(
        and(
          eq(campuses.isActive, true),
          or(
            like(campuses.name, pattern),
            like(campuses.title, pattern),
            like(campuses.univCode, pattern),
            like(campuses.univName, pattern)
          )
        )
      )
      .orderBy(asc(campuses.univName), asc(campuses.name))
      .all();
  } else {
    rows = await db
      .select()
      .from(campuses)
      .where(eq(campuses.isActive, true))
      .orderBy(asc(campuses.univName), asc(campuses.name))
      .all();
  }

  const results = rows.map(serializeCampus);
  return { results, total: results.length };
}
