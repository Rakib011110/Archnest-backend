import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InquiryServices } from './inquiry.services';

const create = catchAsync(async (req: Request, res: Response) => {
  // Handle attachment uploads
  if (req.files && Array.isArray(req.files)) {
    req.body.attachments = req.files.map((f: Express.Multer.File) => `/uploads/inquiries/${f.filename}`);
  }
  const result = await InquiryServices.create(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Inquiry submitted successfully', data: result });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.getAll(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Inquiries retrieved', data: result.data, meta: result.meta });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.getById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Inquiry retrieved', data: result });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.update(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Inquiry updated', data: result });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await InquiryServices.remove(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Inquiry deleted', data: result });
});

export const InquiryController = { create, getAll, getById, update, remove };
