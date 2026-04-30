import { z } from 'zod';

// ============================================================================
// SERVICE VALIDATION SCHEMAS
// ============================================================================

const subServiceSchema = z.object({
  title: z.string().min(1, 'Sub-service title is required'),
  slug: z.string().min(1, 'Sub-service slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

const benefitSchema = z.object({
  icon: z.string().optional(),
  title: z.string().min(1, 'Benefit title is required'),
  description: z.string().min(1, 'Benefit description is required'),
});

export const createServiceValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    shortDescription: z.string().min(1, 'Short description is required').max(500),
    detailedDescription: z.string().min(1, 'Detailed description is required'),
    serviceNumber: z.number().int().positive(),
    heroImage: z.string().optional(), // Set after upload
    thumbnailImage: z.string().optional(),
    subServices: z.array(subServiceSchema).optional(),
    benefits: z.array(benefitSchema).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateServiceValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    shortDescription: z.string().min(1).max(500).optional(),
    detailedDescription: z.string().optional(),
    serviceNumber: z.number().int().positive().optional(),
    heroImage: z.string().optional(),
    thumbnailImage: z.string().optional(),
    subServices: z.array(subServiceSchema).optional(),
    benefits: z.array(benefitSchema).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidation,
  updateServiceValidation,
};
