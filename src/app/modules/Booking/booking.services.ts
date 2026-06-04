import httpStatus from 'http-status';
import { TBooking, TBookingSlot } from './booking.interface';
import { Booking, BookingSlot } from './booking.model';
import AppError from '../../error/AppError';
import { BOOKING_STATUS } from './booking.constant';
import { sendBookingConfirmationEmail } from '../../utils/bookingEmail';
import { sendBookingEmails } from '../../utils/inquiryEmail';
import { SiteSettings } from '../SiteSettings/siteSettings.model';
import config from '../../../config';

// ── Booking CRUD ──
const createBooking = async (payload: Partial<TBooking>): Promise<TBooking> => {
  const result = await Booking.create(payload);

  // Fire-and-forget: send booking notification emails in background
  (async () => {
    try {
      const settings = await SiteSettings.findOne().lean();
      const adminEmail =
        settings?.notificationEmail ||
        settings?.contactEmail ||
        config.admin_email ||
        '';

      const reference = result._id?.toString().slice(-6).toUpperCase() || 'BOOKING';
      const dateLabel = new Date(result.date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
      const timeLabel = `${result.startTime} – ${result.endTime}`;

      if (result.clientEmail && adminEmail) {
        await sendBookingEmails(result.clientEmail, adminEmail, {
          clientName: result.clientName,
          clientEmail: result.clientEmail,
          clientPhone: result.clientPhone,
          reference,
          dateLabel,
          timeLabel,
          timezone: result.timezone,
          notes: result.notes,
        });
      }
    } catch (err) {
      console.error('❌ Booking email background task failed:', err);
    }
  })();

  return result;
};

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
  const existing = await Booking.findById(id);
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');

  const r = await Booking.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');

  const statusChangedToConfirmed =
    payload.status === BOOKING_STATUS.CONFIRMED && existing.status !== BOOKING_STATUS.CONFIRMED;

  if (statusChangedToConfirmed) {
    const reference = r._id?.toString().slice(-6).toUpperCase() || 'BOOKING';
    const dateLabel = new Date(r.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeLabel = `${r.startTime} - ${r.endTime}`;

    try {
      await sendBookingConfirmationEmail(r.clientEmail, {
        clientName: r.clientName,
        reference,
        dateLabel,
        timeLabel,
        timezone: r.timezone,
        notes: r.notes,
        meetingType: r.meetingType,
        meetingLocation: r.meetingLocation,
      });
    } catch (error) {
      console.error('Failed to send booking confirmation email', error);
    }
  }

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
