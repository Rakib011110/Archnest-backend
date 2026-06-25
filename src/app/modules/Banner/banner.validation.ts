import { z } from 'zod';

const createBannerValidationSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      altText: z.string().optional(),
      tag: z.string().optional(),
      badge: z.string().optional(),
      buttonText: z.string().optional(),
      buttonLink: z.string().optional(),
      accentColor: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    })
    .refine((data) => Boolean(data.imageUrl || data.videoUrl), {
      message: 'A banner must have at least an image or a video',
      path: ['imageUrl'],
    }),
});

const updateBannerValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
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
