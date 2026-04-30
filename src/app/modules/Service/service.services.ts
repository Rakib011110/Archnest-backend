import httpStatus from 'http-status';
import { TService, TServiceQuery } from './service.interface';
import { Service } from './service.model';
import { generateSlug } from '../../utils/slug.utils';
import AppError from '../../error/AppError';
import { SERVICE_SEARCHABLE_FIELDS } from './service.constant';

// ============================================================================
// SERVICE BUSINESS LOGIC
// ============================================================================

const createService = async (payload: Partial<TService>): Promise<TService> => {
  // Auto-generate slug from title
  if (payload.title && !payload.slug) {
    payload.slug = generateSlug(payload.title);
  }

  // Check slug uniqueness
  const existing = await Service.findOne({ slug: payload.slug });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'A service with this slug already exists');
  }

  const result = await Service.create(payload);
  return result;
};

const getAllServices = async (query: TServiceQuery) => {
  const {
    searchTerm,
    isActive,
    page = 1,
    limit = 20,
    sortBy = 'serviceNumber',
    sortOrder = 'asc',
  } = query;

  const filter: Record<string, any> = {};

  // Search
  if (searchTerm) {
    filter.$or = SERVICE_SEARCHABLE_FIELDS.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  // Filter
  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Service.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Service.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getServiceBySlug = async (slug: string): Promise<TService> => {
  const result = await Service.findOne({ slug });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
  }
  return result;
};

const getServiceById = async (id: string): Promise<TService> => {
  const result = await Service.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
  }
  return result;
};

const updateService = async (id: string, payload: Partial<TService>): Promise<TService> => {
  // Regenerate slug if title changed
  if (payload.title) {
    payload.slug = generateSlug(payload.title);
    const existing = await Service.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existing) {
      throw new AppError(httpStatus.CONFLICT, 'A service with this slug already exists');
    }
  }

  const result = await Service.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
  }
  return result;
};

const deleteService = async (id: string): Promise<TService> => {
  const result = await Service.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
  }
  return result;
};

export const ServiceServices = {
  createService,
  getAllServices,
  getServiceBySlug,
  getServiceById,
  updateService,
  deleteService,
};
