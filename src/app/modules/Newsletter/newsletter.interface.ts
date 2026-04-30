import { Model, Types } from 'mongoose';

export interface TNewsletterSubscriber {
  _id?: Types.ObjectId;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface INewsletterModel extends Model<TNewsletterSubscriber> {}
