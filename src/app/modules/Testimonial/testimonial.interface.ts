import { Model, Types } from 'mongoose';

export interface TTestimonial {
  _id?: Types.ObjectId;
  clientName: string;
  clientPhoto?: string;
  companyName?: string;
  country: string;
  countryCode: string;
  quote: string;
  rating: number;
  project?: Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITestimonialModel extends Model<TTestimonial> {}
