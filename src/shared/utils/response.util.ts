// ============================================================================
// RESPONSE UTILITIES
// ============================================================================

import { Response } from 'express';
import { ApiResponse } from '../types/common.types';
import { PaginationMeta } from '../types/pagination.types';

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errorDetails?: any
): Response => {
  const response = {
    success: false,
    statusCode,
    message,
    error: errorDetails
      ? {
          code: `ERR_${statusCode}`,
          details: errorDetails,
        }
      : undefined,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Data fetched successfully',
  statusCode = 200
): Response => {
  const response: ApiResponse<T[]> = {
    success: true,
    statusCode,
    message,
    data,
    pagination,
  };
  return res.status(statusCode).json(response);
};
