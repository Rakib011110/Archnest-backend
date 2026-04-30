import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestimonialServices } from './testimonial.services';

const create = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.clientPhoto = `/uploads/testimonials/${req.file.filename}`;
  const result = await TestimonialServices.create(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Testimonial created', data: result });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await TestimonialServices.getAll(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonials retrieved', data: result.data, meta: result.meta });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await TestimonialServices.getById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonial retrieved', data: result });
});

const update = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.clientPhoto = `/uploads/testimonials/${req.file.filename}`;
  const result = await TestimonialServices.update(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonial updated', data: result });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await TestimonialServices.remove(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonial deleted', data: result });
});

export const TestimonialController = { create, getAll, getById, update, remove };
