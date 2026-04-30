import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GalleryServices } from './gallery.services';

const createItem = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.url = `/uploads/gallery/${req.file.filename}`;
  const result = await GalleryServices.createItem(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Gallery item created', data: result });
});

const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryServices.getAllItems(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Gallery items retrieved', data: result.data, meta: result.meta });
});

const getItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryServices.getItemById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Gallery item retrieved', data: result });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.url = `/uploads/gallery/${req.file.filename}`;
  const result = await GalleryServices.updateItem(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Gallery item updated', data: result });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryServices.deleteItem(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Gallery item deleted', data: result });
});

export const GalleryController = { createItem, getAllItems, getItemById, updateItem, deleteItem };
