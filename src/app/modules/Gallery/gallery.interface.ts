import { Model, Types } from 'mongoose';
import { TGalleryItemType } from './gallery.constant';

export interface TGalleryItem {
  _id?: Types.ObjectId;
  title: string;
  type: TGalleryItemType;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  project?: Types.ObjectId;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGalleryModel extends Model<TGalleryItem> {}
