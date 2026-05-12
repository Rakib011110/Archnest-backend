import { Schema, model } from 'mongoose';
import { ICategoryModel, TCategory } from './category.interface';

const categorySchema = new Schema<TCategory, ICategoryModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

export const Category = model<TCategory, ICategoryModel>('Category', categorySchema);
