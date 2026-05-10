import { Model, Types } from 'mongoose';

// ============================================================================
// SERVICE INTERFACES — Industry Standard
// ============================================================================

export interface TSubService {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  detailedDescription?: string;   // Full Markdown content for detail page
  image?: string;
  features?: string[];            // Bullet-point feature list
  deliverables?: string[];        // What client receives
  estimatedDuration?: string;     // e.g. "4–6 weeks"
  startingPrice?: string;         // e.g. "Starting from $2,000"
  order?: number;                 // Display ordering
  isActive?: boolean;
}

export interface TServiceBenefit {
  _id?: Types.ObjectId;
  icon?: string;
  title: string;
  description: string;
}

export interface TProcessStep {
  _id?: Types.ObjectId;
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface TServiceFaq {
  _id?: Types.ObjectId;
  question: string;
  answer: string;
  order?: number;
}

export interface TService {
  _id?: Types.ObjectId;
  // ── Core
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  serviceNumber: number;
  // ── Media
  heroImage: string;
  thumbnailImage?: string;
  // ── Nested Content
  subServices: TSubService[];
  benefits: TServiceBenefit[];
  processSteps: TProcessStep[];
  faqs: TServiceFaq[];
  // ── Relations
  relatedServices?: Types.ObjectId[];
  // ── Flags
  isActive: boolean;
  isFeatured: boolean;
  order?: number;
  tags?: string[];
  // ── SEO
  seoTitle?: string;
  seoDescription?: string;
  // ── Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceModel extends Model<TService> {}

export interface TServiceQuery {
  searchTerm?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
