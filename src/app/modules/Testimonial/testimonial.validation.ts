import { z } from 'zod';

export const createTestimonialValidation = z.object({
  body: z.object({
    clientName: z.string().min(1).max(100),
    companyName: z.string().optional(),
    country: z.string().min(1),
    countryCode: z.string().length(2),
    quote: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    project: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateTestimonialValidation = z.object({
  body: z.object({
    clientName: z.string().min(1).max(100).optional(),
    clientPhoto: z.string().optional(),
    companyName: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().length(2).optional(),
    quote: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    project: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const TestimonialValidation = { createTestimonialValidation, updateTestimonialValidation };
