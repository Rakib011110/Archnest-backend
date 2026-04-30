import { Schema, model } from 'mongoose';
import { IBlogModel, TBlog } from './blog.interface';
import { BLOG_STATUS } from './blog.constant';

const blogSchema = new Schema<TBlog, IBlogModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    featuredImage: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    viewCount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(BLOG_STATUS), default: BLOG_STATUS.DRAFT },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

export const Blog = model<TBlog, IBlogModel>('Blog', blogSchema);
