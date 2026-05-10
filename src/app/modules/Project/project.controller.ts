import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.services';

// ============================================================================
// PROJECT CONTROLLER
// ============================================================================

const createProject = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  // Handle hero image
  if (files?.heroImage?.[0]) {
    req.body.heroImage = `/uploads/projects/${files.heroImage[0].filename}`;
  }

  // Handle gallery images
  if (files?.galleryImages?.length) {
    // If frontend sends metadata as JSON string (e.g. order, isBefore)
    let imagesMeta: any[] = [];
    if (req.body.images && typeof req.body.images === 'string') {
      try {
        imagesMeta = JSON.parse(req.body.images);
      } catch (e) {
        imagesMeta = [];
      }
    } else if (Array.isArray(req.body.images)) {
      imagesMeta = req.body.images;
    }

    req.body.images = files.galleryImages.map((f: Express.Multer.File, i: number) => {
      const meta = imagesMeta[i] || {};
      return {
        url: `/uploads/projects/${f.filename}`,
        altText: meta.altText || '',
        isBefore: meta.isBefore || false,
        order: meta.order ?? i,
      };
    });
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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  // Handle hero image
  if (files?.heroImage?.[0]) {
    req.body.heroImage = `/uploads/projects/${files.heroImage[0].filename}`;
  }

  // Handle gallery images
  let existingImages: any[] = [];
  if (req.body.images && typeof req.body.images === 'string') {
    try {
      existingImages = JSON.parse(req.body.images);
    } catch (e) {
      existingImages = [];
    }
  } else if (Array.isArray(req.body.images)) {
    existingImages = req.body.images;
  }

  if (files?.galleryImages?.length) {
    // New uploaded images
    const newImages = files.galleryImages.map((f: Express.Multer.File, i: number) => {
      // Find matching meta if frontend sent placeholder objects for new files
      // We assume new files are appended to existingImages or mapped appropriately
      // For simplicity, just append new files at the end
      return {
        url: `/uploads/projects/${f.filename}`,
        altText: '',
        isBefore: false,
        order: existingImages.length + i,
      };
    });
    req.body.images = [...existingImages, ...newImages];
  } else if (req.body.images !== undefined) {
    // Only metadata/ordering of existing images was updated
    req.body.images = existingImages;
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
