import httpStatus from 'http-status';
import { TNewsletterSubscriber } from './newsletter.interface';
import { Newsletter } from './newsletter.model';
import AppError from '../../error/AppError';

const subscribe = async (email: string): Promise<TNewsletterSubscriber> => {
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isActive) throw new AppError(httpStatus.CONFLICT, 'Already subscribed');
    // Re-subscribe
    existing.isActive = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await existing.save();
    return existing;
  }
  return Newsletter.create({ email });
};

const unsubscribe = async (email: string): Promise<TNewsletterSubscriber> => {
  const r = await Newsletter.findOneAndUpdate(
    { email },
    { isActive: false, unsubscribedAt: new Date() },
    { new: true }
  );
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Email not found');
  return r;
};

const getAll = async (query: any) => {
  const { isActive, page = 1, limit = 50, sortBy = 'subscribedAt', sortOrder = 'desc' } = query;
  const filter: Record<string, any> = {};
  if (isActive !== undefined) filter.isActive = isActive;
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Newsletter.find(filter).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Newsletter.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const remove = async (id: string): Promise<TNewsletterSubscriber> => {
  const r = await Newsletter.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Subscriber not found');
  return r;
};

export const NewsletterServices = { subscribe, unsubscribe, getAll, remove };
