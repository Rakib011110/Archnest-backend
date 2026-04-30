import httpStatus from 'http-status';
import { TInquiry } from './inquiry.interface';
import { Inquiry } from './inquiry.model';
import AppError from '../../error/AppError';
import { INQUIRY_SEARCHABLE_FIELDS } from './inquiry.constant';

const create = async (payload: Partial<TInquiry>): Promise<TInquiry> => Inquiry.create(payload);

const getAll = async (query: any) => {
  const { searchTerm, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  const filter: Record<string, any> = {};
  if (searchTerm) {
    filter.$or = INQUIRY_SEARCHABLE_FIELDS.map((f) => ({ [f]: { $regex: searchTerm, $options: 'i' } }));
  }
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Inquiry.find(filter).populate('assignedTo', 'name email').sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Inquiry.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getById = async (id: string): Promise<TInquiry> => {
  const r = await Inquiry.findById(id).populate('assignedTo', 'name email');
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Inquiry not found');
  return r;
};

const update = async (id: string, payload: Partial<TInquiry>): Promise<TInquiry> => {
  const r = await Inquiry.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Inquiry not found');
  return r;
};

const remove = async (id: string): Promise<TInquiry> => {
  const r = await Inquiry.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Inquiry not found');
  return r;
};

export const InquiryServices = { create, getAll, getById, update, remove };
