import { z } from 'zod';

export const createTeamMemberValidation = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    role: z.string().min(1),
    bio: z.string().optional(),
    linkedIn: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateTeamMemberValidation = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    role: z.string().optional(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    linkedIn: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const TeamMemberValidation = { createTeamMemberValidation, updateTeamMemberValidation };
