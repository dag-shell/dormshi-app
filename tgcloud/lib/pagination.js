/** Standard page/limit contract from docs/endpoints.md §2.3 */
export function parsePagination(input = {}) {
  let page = Number(input.page);
  let limit = Number(input.limit);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  page = Math.floor(page);
  limit = Math.min(50, Math.floor(limit));
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(page, limit, total) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
