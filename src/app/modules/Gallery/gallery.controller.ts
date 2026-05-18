import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GalleryServices } from './gallery.services';
import AppError from '../../error/AppError';

const createItem = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  
  if (files && files.length > 0) {
    const results = [];
    for (const file of files) {
      const itemData = {
        ...req.body,
        url: `/uploads/gallery/${file.filename}`,
      };
      const result = await GalleryServices.createItem(itemData);
      results.push(result);
    }
    return sendResponse(res, { 
      statusCode: httpStatus.CREATED, 
      success: true, 
      message: `${files.length} Gallery items created`, 
      data: results 
    });
  } 
  
  // For video or virtual tour where no file is uploaded
  if (req.body.type === 'VIDEO' || req.body.type === 'VIRTUAL_TOUR') {
    const result = await GalleryServices.createItem(req.body);
    return sendResponse(res, { 
      statusCode: httpStatus.CREATED, 
      success: true, 
      message: 'Gallery item created', 
      data: result 
    });
  }
  
  throw new AppError(httpStatus.BAD_REQUEST, 'Please upload at least one image file');
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
