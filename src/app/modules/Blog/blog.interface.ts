import { Model, Types } from 'mongoose';
import { TBlogStatus } from './blog.constant';

export interface TBlog {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  featuredImage: string;
  category: string;
  content: string;         // Markdown
  excerpt: string;
  author: Types.ObjectId;
  tags: string[];
  viewCount: number;
  status: TBlogStatus;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogModel extends Model<TBlog> {}
