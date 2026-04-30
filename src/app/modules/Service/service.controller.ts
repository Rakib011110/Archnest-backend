import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ServiceServices } from './service.services';

// ============================================================================
// SERVICE CONTROLLER
// ============================================================================

const createService = catchAsync(async (req: Request, res: Response) => {
  // Attach uploaded image path if present
  if (req.file) {
    req.body.heroImage = `/uploads/services/${req.file.filename}`;
  }

  const result = await ServiceServices.createService(req.body);
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
  if (req.file) {
    req.body.heroImage = `/uploads/services/${req.file.filename}`;
  }

  const result = await ServiceServices.updateService(req.params.id, req.body);
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
