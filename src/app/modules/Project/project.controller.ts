import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.services';

// ============================================================================
// PROJECT CONTROLLER
// ============================================================================

const createProject = catchAsync(async (req: Request, res: Response) => {
  // Handle hero image from single upload
  if (req.file) {
    req.body.heroImage = `/uploads/projects/${req.file.filename}`;
  }
  // Handle gallery images from multi-upload
  if (req.files && Array.isArray(req.files)) {
    req.body.images = req.files.map((f: Express.Multer.File, i: number) => ({
      url: `/uploads/projects/${f.filename}`,
      altText: '',
      order: i,
    }));
  }

  const result = await ProjectServices.createProject(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getAllProjects(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getProjectBySlug(req.params.slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getProjectById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.heroImage = `/uploads/projects/${req.file.filename}`;
  }

  const result = await ProjectServices.updateProject(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.deleteProject(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
};
