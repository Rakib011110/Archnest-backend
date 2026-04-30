import { Schema, model } from 'mongoose';
import { ITestimonialModel, TTestimonial } from './testimonial.interface';

const testimonialSchema = new Schema<TTestimonial, ITestimonialModel>(
  {
    clientName: { type: String, required: true, trim: true },
    clientPhoto: { type: String },
    companyName: { type: String },
    country: { type: String, required: true },
    countryCode: { type: String, required: true, uppercase: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ isActive: 1, order: 1 });

export const Testimonial = model<TTestimonial, ITestimonialModel>('Testimonial', testimonialSchema);
