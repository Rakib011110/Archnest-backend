import { Schema, model } from 'mongoose';
import { IInquiryModel, TInquiry } from './inquiry.interface';
import { INQUIRY_STATUS } from './inquiry.constant';

const inquirySchema = new Schema<TInquiry, IInquiryModel>(
  {
    projectType: { type: String, required: true },
    market: { type: String },
    budgetRange: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    company: { type: String },
    message: { type: String, required: true },
    attachments: { type: [String], default: [] },
    status: { type: String, enum: Object.values(INQUIRY_STATUS), default: INQUIRY_STATUS.NEW },
    internalNotes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1 });

export const Inquiry = model<TInquiry, IInquiryModel>('Inquiry', inquirySchema);
