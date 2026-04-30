import { Schema, model } from 'mongoose';
import { IProjectModel, TProject } from './project.interface';
import { PROJECT_MARKET, PROJECT_CATEGORY, PROJECT_STATUS } from './project.constant';

// ============================================================================
// PROJECT SCHEMA
// ============================================================================

const projectImageSchema = new Schema(
  {
    url: { type: String, required: true },
    altText: { type: String },
    isBefore: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const projectSchema = new Schema<TProject, IProjectModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clientName: { type: String },
    location: { type: String, required: true },
    country: { type: String, required: true },
    year: { type: Number, required: true },
    market: { type: String, required: true, enum: Object.values(PROJECT_MARKET) },
    category: { type: String, required: true, enum: Object.values(PROJECT_CATEGORY) },
    serviceType: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    area: { type: String },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    images: { type: [projectImageSchema], default: [] },
    videoUrl: { type: String },
    virtualTourUrl: { type: String },
    features: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(PROJECT_STATUS), default: PROJECT_STATUS.DRAFT },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

// Indexes
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ market: 1, category: 1 });
projectSchema.index({ isFeatured: 1, status: 1 });
projectSchema.index({ serviceType: 1 });
projectSchema.index({ status: 1 });

export const Project = model<TProject, IProjectModel>('Project', projectSchema);
