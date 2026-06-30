import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ServiceServices } from './service.services';

// ============================================================================
// SERVICE CONTROLLER
// ============================================================================

/** Array/object fields the wizard sends as JSON strings (individual-field mode). */
const JSON_FIELDS = [
  'subServices',
  'benefits',
  'processSteps',
  'faqs',
  'tags',
  'relatedServices',
] as const;

/**
 * Normalizes a multipart service request into a plain payload object.
 * Supports both client shapes:
 *   1. A single `data` field holding the whole document as JSON (edit wizard).
 *   2. Individual fields, with array/object fields sent as JSON strings (create wizard).
 * Also attaches uploaded hero/thumbnail image paths.
 */
const buildServicePayload = (req: Request): Record<string, any> => {
  let payload: Record<string, any>;

  if (typeof req.body?.data === 'string') {
    // Envelope style — the whole document arrives as one JSON string
    payload = JSON.parse(req.body.data);
  } else {
    // Individual-field style — parse any stringified JSON fields
    payload = { ...req.body };
    for (const key of JSON_FIELDS) {
      if (typeof payload[key] === 'string') {
        try {
          payload[key] = JSON.parse(payload[key]);
        } catch {
          // Leave as-is; schema validation will surface a clear error.
        }
      }
    }
  }

  // Attach uploaded files. `.fields(...)` exposes them on req.files keyed by
  // fieldname; keep the req.file fallback for any single-upload callers.
  const files = req.files as
    | { [field: string]: Express.Multer.File[] }
    | undefined;
  if (files?.heroImage?.[0]) {
    payload.heroImage = `/uploads/services/${files.heroImage[0].filename}`;
  } else if (req.file) {
    payload.heroImage = `/uploads/services/${req.file.filename}`;
  }
  if (files?.thumbnailImage?.[0]) {
    payload.thumbnailImage = `/uploads/services/${files.thumbnailImage[0].filename}`;
  }

  return payload;
};

const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = buildServicePayload(req);

  const result = await ServiceServices.createService(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getAllServices(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getServiceBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getServiceBySlug(req.params.slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getServiceById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const payload = buildServicePayload(req);

  const result = await ServiceServices.updateService(req.params.id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.deleteService(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getServiceBySlug,
  getServiceById,
  updateService,
  deleteService,
};
