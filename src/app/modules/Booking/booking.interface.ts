import { Model, Types } from 'mongoose';
import { TBookingStatus } from './booking.constant';

export interface TBooking {
  _id?: Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  notes?: string;
  status: TBookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TBookingSlot {
  _id?: Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  blockedDates: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookingModel extends Model<TBooking> {}
export interface IBookingSlotModel extends Model<TBookingSlot> {}
