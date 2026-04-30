import httpStatus from 'http-status';
import { TGalleryItem } from './gallery.interface';
import { Gallery } from './gallery.model';
import AppError from '../../error/AppError';

const createItem = async (payload: Partial<TGalleryItem>): Promise<TGalleryItem> => {
  return Gallery.create(payload);
};

const getAllItems = async (query: any) => {
  const { type, isActive, project, category, page = 1, limit = 20, sortBy = 'order', sortOrder = 'asc' } = query;
  const filter: Record<string, any> = {};
  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive;
  if (project) filter.project = project;
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Gallery.find(filter).populate('project', 'title slug').sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Gallery.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getItemById = async (id: string): Promise<TGalleryItem> => {
  const result = await Gallery.findById(id).populate('project', 'title slug');
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Gallery item not found');
  return result;
};

const updateItem = async (id: string, payload: Partial<TGalleryItem>): Promise<TGalleryItem> => {
  const result = await Gallery.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Gallery item not found');
  return result;
};

const deleteItem = async (id: string): Promise<TGalleryItem> => {
  const result = await Gallery.findByIdAndDelete(id);
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Gallery item not found');
  return result;
};

export const GalleryServices = { createItem, getAllItems, getItemById, updateItem, deleteItem };
