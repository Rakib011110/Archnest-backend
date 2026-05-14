import { Model, Types } from 'mongoose';
import { TInquiryStatus } from './inquiry.constant';

export interface TInquiry {
  _id?: Types.ObjectId;
  projectType: string;
  market?: string;
  budgetRange?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  attachments: string[];
  status: TInquiryStatus;
  internalNotes?: string;    // Markdown
  assignedTo?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInquiryModel extends Model<TInquiry> {}
