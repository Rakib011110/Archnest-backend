import { z } from 'zod';

export const createBookingValidation = z.object({
  body: z.object({
    clientName: z.string().min(1).max(100),
    clientEmail: z.string().email(),
    clientPhone: z.string().optional(),
    date: z.string().min(1),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    timezone: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateBookingValidation = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
    notes: z.string().optional(),
  }),
});

export const createBookingSlotValidation = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    slotDuration: z.number().int().min(15).max(120).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const BookingValidation = { createBookingValidation, updateBookingValidation, createBookingSlotValidation };
