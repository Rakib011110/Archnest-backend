import { Schema, model } from 'mongoose';
import { IGalleryModel, TGalleryItem } from './gallery.interface';
import { GALLERY_ITEM_TYPE } from './gallery.constant';

const gallerySchema = new Schema<TGalleryItem, IGalleryModel>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: Object.values(GALLERY_ITEM_TYPE) },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    altText: { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    category: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

gallerySchema.index({ type: 1, isActive: 1 });
gallerySchema.index({ project: 1 });
gallerySchema.index({ order: 1 });

export const Gallery = model<TGalleryItem, IGalleryModel>('Gallery', gallerySchema);
