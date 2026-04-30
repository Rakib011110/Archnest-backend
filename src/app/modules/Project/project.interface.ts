import { Model, Types } from 'mongoose';
import { TProjectMarket, TProjectCategory, TProjectStatus } from './project.constant';

// ============================================================================
// PROJECT INTERFACES
// ============================================================================

export interface TProjectImage {
  url: string;
  altText?: string;
  isBefore?: boolean;
  order: number;
}

export interface TProject {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  clientName?: string;
  location: string;
  country: string;
  year: number;
  market: TProjectMarket;
  category: TProjectCategory;
  serviceType: Types.ObjectId;
  area?: string;
  description: string;           // Markdown
  heroImage: string;
  images: TProjectImage[];
  videoUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  isFeatured: boolean;
  status: TProjectStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectModel extends Model<TProject> {}

export interface TProjectQuery {
  searchTerm?: string;
  market?: TProjectMarket;
  category?: TProjectCategory;
  status?: TProjectStatus;
  isFeatured?: boolean;
  serviceType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
