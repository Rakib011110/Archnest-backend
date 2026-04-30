import { z } from 'zod';

export const createBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(300),
    category: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1).max(500),
    tags: z.array(z.string()).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  }),
});

export const updateBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(300).optional(),
    category: z.string().optional(),
    content: z.string().optional(),
    excerpt: z.string().max(500).optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  }),
});

export const BlogValidation = { createBlogValidation, updateBlogValidation };
