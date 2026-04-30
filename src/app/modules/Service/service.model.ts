import { Schema, model } from 'mongoose';
import { IServiceModel, TService } from './service.interface';

// ============================================================================
// SERVICE SCHEMA
// ============================================================================

const subServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  { _id: true }
);

const benefitSchema = new Schema(
  {
    icon: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: true }
);

const serviceSchema = new Schema<TService, IServiceModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    serviceNumber: { type: Number, required: true },
    heroImage: { type: String, required: true },
    thumbnailImage: { type: String },
    subServices: { type: [subServiceSchema], default: [] },
    benefits: { type: [benefitSchema], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ serviceNumber: 1 });
serviceSchema.index({ isActive: 1 });

export const Service = model<TService, IServiceModel>('Service', serviceSchema);
