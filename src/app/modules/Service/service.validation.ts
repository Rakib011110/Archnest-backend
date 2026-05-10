import { z } from 'zod';

// ============================================================================
// SERVICE VALIDATION SCHEMAS — Industry Standard
// ============================================================================

const subServiceSchema = z.object({
  title:               z.string().min(1, 'Sub-service title is required').trim(),
  slug:                z.string().min(1, 'Sub-service slug is required').trim(),
  description:         z.string().optional(),
  detailedDescription: z.string().optional(),
  image:               z.string().optional(),
  features:            z.array(z.string()).optional().default([]),
  deliverables:        z.array(z.string()).optional().default([]),
  estimatedDuration:   z.string().optional(),
  startingPrice:       z.string().optional(),
  order:               z.number().int().min(0).optional().default(0),
  isActive:            z.boolean().optional().default(true),
});

const benefitSchema = z.object({
  icon:        z.string().optional(),
  title:       z.string().min(1, 'Benefit title is required').trim(),
  description: z.string().min(1, 'Benefit description is required'),
});

const processStepSchema = z.object({
  stepNumber:  z.number().int().positive('Step number must be positive'),
  title:       z.string().min(1, 'Step title is required').trim(),
  description: z.string().min(1, 'Step description is required'),
  icon:        z.string().optional(),
});

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required').trim(),
  answer:   z.string().min(1, 'Answer is required'),
  order:    z.number().int().min(0).optional().default(0),
});

const coreServiceFields = {
  title:               z.string().min(1, 'Title is required').max(200).trim(),
  shortDescription:    z.string().min(1, 'Short description is required').max(500),
  detailedDescription: z.string().min(1, 'Detailed description is required'),
  serviceNumber:       z.number().int().positive(),
  heroImage:           z.string().optional(),
  thumbnailImage:      z.string().optional(),
  subServices:         z.array(subServiceSchema).optional().default([]),
  benefits:            z.array(benefitSchema).optional().default([]),
  processSteps:        z.array(processStepSchema).optional().default([]),
  faqs:                z.array(faqSchema).optional().default([]),
  relatedServices:     z.array(z.string()).optional().default([]),
  isActive:            z.boolean().optional().default(true),
  isFeatured:          z.boolean().optional().default(false),
  order:               z.number().int().min(0).optional().default(0),
  tags:                z.array(z.string()).optional().default([]),
  seoTitle:            z.string().max(70).optional(),
  seoDescription:      z.string().max(160).optional(),
};

export const createServiceValidation = z.object({
  body: z.object(coreServiceFields),
});

export const updateServiceValidation = z.object({
  body: z.object(
    Object.fromEntries(
      Object.entries(coreServiceFields).map(([key, schema]) => [key, schema.optional()])
    )
  ),
});

export const ServiceValidation = {
  createServiceValidation,
  updateServiceValidation,
};
