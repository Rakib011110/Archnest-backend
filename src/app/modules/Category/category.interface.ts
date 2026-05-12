import { Model } from 'mongoose';

export interface TCategory {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface ICategoryModel extends Model<TCategory> {}
