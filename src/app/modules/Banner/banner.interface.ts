import { Model } from 'mongoose';

export type TBanner = {
  _id?: string;
  title?: string;
  description?: string;
  /** Background image. Optional — a banner may be video-only. */
  imageUrl?: string;
  /** Background video. Optional — a banner may be image-only. */
  videoUrl?: string;
  altText?: string;
  tag?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  accentColor?: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IBannerModel extends Model<TBanner> {
  // Add any static methods here if needed
}