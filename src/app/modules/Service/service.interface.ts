import { Model, Types } from 'mongoose';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface TSubService {
  title: string;
  slug: string;
  description?: string;    // Markdown
  image?: string;           // /uploads/services/...
}

export interface TServiceBenefit {
  icon?: string;
  title: string;
  description: string;
}

export interface TService {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;   // Markdown
  serviceNumber: number;
  heroImage: string;
  thumbnailImage?: string;
  subServices: TSubService[];
  benefits: TServiceBenefit[];
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceModel extends Model<TService> {}

export interface TServiceQuery {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
