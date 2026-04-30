import { z } from 'zod';

export const createGalleryValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    type: z.enum(['PHOTO', 'VIDEO', 'VIRTUAL_TOUR']),
    url: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    altText: z.string().optional(),
    project: z.string().optional(),
    category: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateGalleryValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    type: z.enum(['PHOTO', 'VIDEO', 'VIRTUAL_TOUR']).optional(),
    url: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    altText: z.string().optional(),
    project: z.string().optional(),
    category: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const GalleryValidation = { createGalleryValidation, updateGalleryValidation };
