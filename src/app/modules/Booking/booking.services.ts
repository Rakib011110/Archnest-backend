import httpStatus from 'http-status';
import { TBooking, TBookingSlot } from './booking.interface';
import { Booking, BookingSlot } from './booking.model';
import AppError from '../../error/AppError';

// ── Booking CRUD ──
const createBooking = async (payload: Partial<TBooking>): Promise<TBooking> => Booking.create(payload);

const getAllBookings = async (query: any) => {
  const { status, date, page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = query;
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (date) filter.date = new Date(date);
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Booking.find(filter).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getBookingById = async (id: string): Promise<TBooking> => {
  const r = await Booking.findById(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  return r;
};

const updateBooking = async (id: string, payload: Partial<TBooking>): Promise<TBooking> => {
  const r = await Booking.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  return r;
};

const deleteBooking = async (id: string): Promise<TBooking> => {
  const r = await Booking.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  return r;
};

// ── BookingSlot CRUD ──
const createSlot = async (payload: Partial<TBookingSlot>): Promise<TBookingSlot> => BookingSlot.create(payload);

const getAllSlots = async () => BookingSlot.find().sort({ dayOfWeek: 1, startTime: 1 });

const updateSlot = async (id: string, payload: Partial<TBookingSlot>): Promise<TBookingSlot> => {
  const r = await BookingSlot.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking slot not found');
  return r;
};

const deleteSlot = async (id: string): Promise<TBookingSlot> => {
  const r = await BookingSlot.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking slot not found');
  return r;
};

export const BookingServices = {
  createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking,
  createSlot, getAllSlots, updateSlot, deleteSlot,
};
