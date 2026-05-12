import httpStatus from 'http-status';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { generateSlug } from '../../utils/slug.utils';
import AppError from '../../error/AppError';

const createCategory = async (payload: Partial<TCategory>): Promise<TCategory> => {
  if (payload.name && !payload.slug) {
    payload.slug = generateSlug(payload.name);
  }

  const existing = await Category.findOne({ slug: payload.slug });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'A category with this slug already exists');
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async () => {
  const result = await Category.find().sort({ order: 1, name: 1 });
  return result;
};

const getCategoryById = async (id: string): Promise<TCategory> => {
  const result = await Category.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

const updateCategory = async (id: string, payload: Partial<TCategory>): Promise<TCategory> => {
  if (payload.name) {
    payload.slug = generateSlug(payload.name);
    const existing = await Category.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existing) {
      throw new AppError(httpStatus.CONFLICT, 'A category with this slug already exists');
    }
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

const deleteCategory = async (id: string): Promise<TCategory> => {
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
