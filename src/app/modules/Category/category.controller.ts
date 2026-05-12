import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.services';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.deleteCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
