import httpStatus from 'http-status';
import { TTestimonial } from './testimonial.interface';
import { Testimonial } from './testimonial.model';
import AppError from '../../error/AppError';

const create = async (payload: Partial<TTestimonial>): Promise<TTestimonial> => Testimonial.create(payload);

const getAll = async (query: any) => {
  const { isActive, country, page = 1, limit = 20, sortBy = 'order', sortOrder = 'asc' } = query;
  const filter: Record<string, any> = {};
  if (isActive !== undefined) filter.isActive = isActive;
  if (country) filter.country = country;
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Testimonial.find(filter).populate('project', 'title slug').sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Testimonial.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getById = async (id: string): Promise<TTestimonial> => {
  const r = await Testimonial.findById(id).populate('project', 'title slug');
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found');
  return r;
};

const update = async (id: string, payload: Partial<TTestimonial>): Promise<TTestimonial> => {
  const r = await Testimonial.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found');
  return r;
};

const remove = async (id: string): Promise<TTestimonial> => {
  const r = await Testimonial.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found');
  return r;
};

export const TestimonialServices = { create, getAll, getById, update, remove };
