import { Schema, model } from 'mongoose';
import { IServiceModel, TService } from './service.interface';

// ============================================================================
// SERVICE SCHEMA — Industry Standard
// ============================================================================

const subServiceSchema = new Schema(
  {
    title:                { type: String, required: true, trim: true },
    slug:                 { type: String, required: true, lowercase: true, trim: true },
    description:          { type: String },
    detailedDescription:  { type: String },
    image:                { type: String },
    features:             { type: [String], default: [] },
    deliverables:         { type: [String], default: [] },
    estimatedDuration:    { type: String },
    startingPrice:        { type: String },
    order:                { type: Number, default: 0 },
    isActive:             { type: Boolean, default: true },
  },
  { _id: true }
);

const benefitSchema = new Schema(
  {
    icon:        { type: String },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { _id: true }
);

const processStepSchema = new Schema(
  {
    stepNumber:  { type: Number, required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon:        { type: String },
  },
  { _id: true }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer:   { type: String, required: true },
    order:    { type: Number, default: 0 },
  },
  { _id: true }
);

const serviceSchema = new Schema<TService, IServiceModel>(
  {
    // ── Core
    title:               { type: String, required: true, trim: true },
    slug:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription:    { type: String, required: true },
    detailedDescription: { type: String, required: true },
    serviceNumber:       { type: Number, required: true },
    // ── Media
    heroImage:           { type: String, required: true },
    thumbnailImage:      { type: String },
    // ── Nested
    subServices:         { type: [subServiceSchema],   default: [] },
    benefits:            { type: [benefitSchema],       default: [] },
    processSteps:        { type: [processStepSchema],   default: [] },
    faqs:                { type: [faqSchema],           default: [] },
    // ── Relations
    relatedServices:     [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    // ── Flags
    isActive:    { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    order:       { type: Number,  default: 0 },
    tags:        { type: [String], default: [] },
    // ── SEO
    seoTitle:       { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

// Indexes
serviceSchema.index({ slug: 1 },                   { unique: true });
serviceSchema.index({ serviceNumber: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ order: 1 });
serviceSchema.index({ tags: 1 });

export const Service = model<TService, IServiceModel>('Service', serviceSchema);
