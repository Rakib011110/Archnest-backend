import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsletterServices } from './newsletter.services';

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServices.subscribe(req.body.email);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Subscribed successfully', data: result });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServices.unsubscribe(req.body.email);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Unsubscribed successfully', data: result });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServices.getAll(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Subscribers retrieved', data: result.data, meta: result.meta });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServices.remove(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Subscriber removed', data: result });
});

export const NewsletterController = { subscribe, unsubscribe, getAll, remove };
