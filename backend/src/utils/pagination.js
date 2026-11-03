/**
 * Pagination helper utilities for EventNest API
 */

/**
 * Parses and sanitizes pagination query parameters with safe defaults.
 * Supports:
 *  - Page number: `page`, `pageNumber`
 *  - Page size: `limit`, `pageSize`, `size`
 *
 * @param {Object} query - Express request query object (req.query)
 * @param {number} [defaultLimit=10] - Default page size if not provided or invalid
 * @param {number} [maxLimit=100] - Maximum allowed page size to prevent excessive memory/load
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePaginationParams = (query = {}, defaultLimit = 10, maxLimit = 100) => {
  let rawPage = query.page ?? query.pageNumber;
  let rawLimit = query.limit ?? query.pageSize ?? query.size;

  if (Array.isArray(rawPage)) {
    rawPage = rawPage[0];
  }
  if (Array.isArray(rawLimit)) {
    rawLimit = rawLimit[0];
  }

  let page = parseInt(rawPage, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(rawLimit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Generates pagination metadata object.
 *
 * @param {number} totalRecords - Total count of matching records in database
 * @param {number} page - Current page number
 * @param {number} limit - Current page size
 * @returns {{
 *   currentPage: number,
 *   pageSize: number,
 *   totalRecords: number,
 *   totalPages: number,
 *   hasNextPage: boolean,
 *   hasPrevPage: boolean,
 *   page: number,
 *   limit: number,
 *   total: number
 * }}
 */
const getPaginationMetadata = (totalRecords, page, limit) => {
  const total = Number(totalRecords) || 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const currentPage = page;
  const pageSize = limit;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1 && totalPages > 0;

  return {
    currentPage,
    pageSize,
    totalRecords: total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    page: currentPage,
    limit: pageSize,
    total,
  };
};

module.exports = {
  parsePaginationParams,
  getPaginationMetadata,
};
