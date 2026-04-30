// ============================================================================
// BASE CONTROLLER
// ============================================================================

import { Response } from 'express';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.util';
import { PaginationMeta } from '../types/pagination.types';

/**
 * Base Controller Class
 * All controllers should extend this class for consistent response handling
 */
export class BaseController {
  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ): Response {
    return sendSuccess(res, data, message, statusCode);
  }

  /**
   * Send created response (201)
   */
  protected sendCreated<T>(
    res: Response,
    data: T,
    message = 'Created successfully'
  ): Response {
    return sendSuccess(res, data, message, 201);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    message: string,
    statusCode = 500,
    errorDetails?: any
  ): Response {
    return sendError(res, message, statusCode, errorDetails);
  }

  /**
   * Send paginated response
   */
  protected sendPaginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Data fetched successfully'
  ): Response {
    return sendPaginated(res, data, pagination, message);
  }

  /**
   * Send no content response (204)
   */
  protected sendNoContent(res: Response): Response {
    return res.status(204).send();
  }
}
