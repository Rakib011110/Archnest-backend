import { z } from 'zod';

const createBannerValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().min(1, 'Image URL is required and cannot be empty'),
    altText: z.string().optional(),
    tag: z.string().optional(),
    badge: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    accentColor: z.string().optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const updateBannerValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    altText: z.string().optional(),
    tag: z.string().optional(),
    badge: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    accentColor: z.string().optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const BannerValidation = {
  createBannerValidationSchema,
  updateBannerValidationSchema,
};