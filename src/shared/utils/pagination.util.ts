// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

import { PaginationOptions, PaginationMeta } from '../types/pagination.types';

/**
 * Calculate pagination meta from options and total count
 */
export const calculatePagination = (
  options: PaginationOptions,
  total: number
): PaginationMeta => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
  };
};

/**
 * Calculate skip value for database queries
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Parse pagination options from query
 */
export const parsePaginationOptions = (query: any): PaginationOptions => {
  return {
    page: query.page ? parseInt(query.page) : 1,
    limit: query.limit ? parseInt(query.limit) : 10,
    sort: query.sort || '-createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
};
