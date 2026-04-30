import { z } from 'zod';

export const createInquiryValidation = z.object({
  body: z.object({
    projectType: z.string().min(1),
    market: z.string().min(1),
    budgetRange: z.enum(['UNDER_1K', '1K_5K', '5K_10K', '10K_25K', '25K_PLUS']),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(1),
  }),
});

export const updateInquiryValidation = z.object({
  body: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED']).optional(),
    internalNotes: z.string().optional(),
    assignedTo: z.string().optional(),
  }),
});

export const InquiryValidation = { createInquiryValidation, updateInquiryValidation };
