// ============================================================================
// CATCH ASYNC UTILITY
// ============================================================================

import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wrapper for async route handlers to catch errors
 * Usage: catchAsync(async (req, res, next) => { ... })
 */
export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error): void => {
      console.error('Error in async handler:', error);
      next(error);
    });
  };
};
