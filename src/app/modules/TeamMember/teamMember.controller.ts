import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeamMemberServices } from './teamMember.services';

const create = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.photo = `/uploads/team/${req.file.filename}`;
  const result = await TeamMemberServices.create(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Team member created', data: result });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamMemberServices.getAll(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Team members retrieved', data: result.data, meta: result.meta });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamMemberServices.getById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Team member retrieved', data: result });
});

const update = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.photo = `/uploads/team/${req.file.filename}`;
  const result = await TeamMemberServices.update(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Team member updated', data: result });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamMemberServices.remove(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Team member deleted', data: result });
});

export const TeamMemberController = { create, getAll, getById, update, remove };
