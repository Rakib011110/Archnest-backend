import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.services';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.featuredImage = `/uploads/blog/${req.file.filename}`;
  req.body.author = req.user?._id;
  const result = await BlogServices.createBlog(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Blog post created', data: result });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogs(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Blog posts retrieved', data: result.data, meta: result.meta });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getBlogBySlug(req.params.slug);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Blog post retrieved', data: result });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getBlogById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Blog post retrieved', data: result });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.featuredImage = `/uploads/blog/${req.file.filename}`;
  const result = await BlogServices.updateBlog(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Blog post updated', data: result });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.deleteBlog(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Blog post deleted', data: result });
});

export const BlogController = { createBlog, getAllBlogs, getBlogBySlug, getBlogById, updateBlog, deleteBlog };
