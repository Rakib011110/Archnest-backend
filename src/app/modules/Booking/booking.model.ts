import { Schema, model } from 'mongoose';
import { IBookingModel, IBookingSlotModel, TBooking, TBookingSlot } from './booking.interface';
import { BOOKING_STATUS } from './booking.constant';

const bookingSchema = new Schema<TBooking, IBookingModel>(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true },
    clientPhone: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, required: true, default: 'Asia/Dhaka' },
    notes: { type: String },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },
  },
  { timestamps: true }
);

bookingSchema.index({ date: 1, startTime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ clientEmail: 1 });

export const Booking = model<TBooking, IBookingModel>('Booking', bookingSchema);

// BookingSlot — admin-managed availability
const bookingSlotSchema = new Schema<TBookingSlot, IBookingSlotModel>(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true, default: 60 },
    isActive: { type: Boolean, default: true },
    blockedDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

export const BookingSlot = model<TBookingSlot, IBookingSlotModel>('BookingSlot', bookingSlotSchema);
