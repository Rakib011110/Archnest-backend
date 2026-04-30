import httpStatus from 'http-status';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import { generateSlug } from '../../utils/slug.utils';
import AppError from '../../error/AppError';
import { BLOG_SEARCHABLE_FIELDS } from './blog.constant';

const createBlog = async (payload: Partial<TBlog>): Promise<TBlog> => {
  if (payload.title && !payload.slug) payload.slug = generateSlug(payload.title);
  const existing = await Blog.findOne({ slug: payload.slug });
  if (existing) throw new AppError(httpStatus.CONFLICT, 'A blog post with this slug already exists');
  if (payload.status === 'PUBLISHED' && !payload.publishedAt) payload.publishedAt = new Date();
  return Blog.create(payload);
};

const getAllBlogs = async (query: any) => {
  const { searchTerm, category, status, tags, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  const filter: Record<string, any> = {};
  if (searchTerm) {
    filter.$or = BLOG_SEARCHABLE_FIELDS.map((f) => ({ [f]: { $regex: searchTerm, $options: 'i' } }));
  }
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Blog.find(filter).populate('author', 'name profilePhoto').sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getBlogBySlug = async (slug: string): Promise<TBlog> => {
  const result = await Blog.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } }, { new: true }).populate('author', 'name profilePhoto');
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  return result;
};

const getBlogById = async (id: string): Promise<TBlog> => {
  const result = await Blog.findById(id).populate('author', 'name profilePhoto');
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  return result;
};

const updateBlog = async (id: string, payload: Partial<TBlog>): Promise<TBlog> => {
  if (payload.title) {
    payload.slug = generateSlug(payload.title);
    const existing = await Blog.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existing) throw new AppError(httpStatus.CONFLICT, 'A blog with this slug already exists');
  }
  if (payload.status === 'PUBLISHED') payload.publishedAt = new Date();
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  return result;
};

const deleteBlog = async (id: string): Promise<TBlog> => {
  const result = await Blog.findByIdAndDelete(id);
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  return result;
};

export const BlogServices = { createBlog, getAllBlogs, getBlogBySlug, getBlogById, updateBlog, deleteBlog };
