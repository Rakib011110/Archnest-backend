import httpStatus from 'http-status';
import { TProject, TProjectQuery } from './project.interface';
import { Project } from './project.model';
import { generateSlug } from '../../utils/slug.utils';
import AppError from '../../error/AppError';
import { PROJECT_SEARCHABLE_FIELDS } from './project.constant';

// ============================================================================
// PROJECT BUSINESS LOGIC
// ============================================================================

const createProject = async (payload: Partial<TProject>): Promise<TProject> => {
  if (payload.title && !payload.slug) {
    payload.slug = generateSlug(payload.title);
  }

  const existing = await Project.findOne({ slug: payload.slug });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'A project with this slug already exists');
  }

  const result = await Project.create(payload);
  return result;
};

const getAllProjects = async (query: TProjectQuery) => {
  const {
    searchTerm, market, category, status, isFeatured, serviceType,
    page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc',
  } = query;

  const filter: Record<string, any> = {};

  if (searchTerm) {
    filter.$or = PROJECT_SEARCHABLE_FIELDS.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }
  if (market) filter.market = market;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured;
  if (serviceType) filter.serviceType = serviceType;

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Project.find(filter).populate('serviceType', 'title slug').sort(sortObj).skip(skip).limit(Number(limit)),
    Project.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
  };
};

const getProjectBySlug = async (slug: string): Promise<TProject> => {
  const result = await Project.findOne({ slug }).populate('serviceType', 'title slug');
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  return result;
};

const getProjectById = async (id: string): Promise<TProject> => {
  const result = await Project.findById(id).populate('serviceType', 'title slug');
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  return result;
};

const updateProject = async (id: string, payload: Partial<TProject>): Promise<TProject> => {
  if (payload.title) {
    payload.slug = generateSlug(payload.title);
    const existing = await Project.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existing) throw new AppError(httpStatus.CONFLICT, 'A project with this slug already exists');
  }

  const result = await Project.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  return result;
};

const deleteProject = async (id: string): Promise<TProject> => {
  const result = await Project.findByIdAndDelete(id);
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  return result;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
};
