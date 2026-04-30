import { z } from 'zod';

// ============================================================================
// PROJECT VALIDATION SCHEMAS
// ============================================================================

const projectImageSchema = z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
  isBefore: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const createProjectValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(300),
    clientName: z.string().optional(),
    location: z.string().min(1),
    country: z.string().min(1),
    year: z.number().int().min(1900).max(2100),
    market: z.enum(['INTERNATIONAL', 'LOCAL']),
    category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INSTITUTIONAL', 'LANDSCAPE']),
    serviceType: z.string().min(1, 'Service type is required'),
    area: z.string().optional(),
    description: z.string().min(1),
    heroImage: z.string().optional(),
    images: z.array(projectImageSchema).optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    virtualTourUrl: z.string().url().optional().or(z.literal('')),
    features: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  }),
});

export const updateProjectValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(300).optional(),
    clientName: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    year: z.number().int().min(1900).max(2100).optional(),
    market: z.enum(['INTERNATIONAL', 'LOCAL']).optional(),
    category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INSTITUTIONAL', 'LANDSCAPE']).optional(),
    serviceType: z.string().optional(),
    area: z.string().optional(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    images: z.array(projectImageSchema).optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    virtualTourUrl: z.string().url().optional().or(z.literal('')),
    features: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  }),
});

export const ProjectValidation = {
  createProjectValidation,
  updateProjectValidation,
};
