import { Schema, model } from 'mongoose';
import { INewsletterModel, TNewsletterSubscriber } from './newsletter.interface';

const newsletterSchema = new Schema<TNewsletterSubscriber, INewsletterModel>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

newsletterSchema.index({ email: 1 }, { unique: true });

export const Newsletter = model<TNewsletterSubscriber, INewsletterModel>('Newsletter', newsletterSchema);
