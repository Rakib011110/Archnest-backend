import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.services';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.createBooking(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Booking submitted', data: result });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getAllBookings(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Bookings retrieved', data: result.data, meta: result.meta });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getBookingById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Booking retrieved', data: result });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.updateBooking(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Booking updated', data: result });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.deleteBooking(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Booking deleted', data: result });
});

// Slots
const getAllSlots = catchAsync(async (_req: Request, res: Response) => {
  const result = await BookingServices.getAllSlots();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Slots retrieved', data: result });
});

const createSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.createSlot(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Slot created', data: result });
});

const updateSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.updateSlot(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Slot updated', data: result });
});

const deleteSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.deleteSlot(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Slot deleted', data: result });
});

export const BookingController = {
  createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking,
  getAllSlots, createSlot, updateSlot, deleteSlot,
};
