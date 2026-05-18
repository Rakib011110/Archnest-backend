import { z } from 'zod';

export const updateSiteSettingsValidation = z.object({
  body: z.object({
    siteName: z.string().optional(),
    tagline: z.string().optional(),
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    heroVideoUrl: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    officeAddress: z.string().optional(),
    googleMapsEmbed: z.string().optional(),
    profiles: z.array(z.object({
      platform: z.string(),
      url: z.string(),
      iconUrl: z.string().optional(),
    })).optional(),
    statsProjects: z.number().int().optional(),
    statsCountries: z.number().int().optional(),
    statsYears: z.number().int().optional(),
    statsInternational: z.number().int().optional(),
    trustedByLogos: z.array(z.object({
      name: z.string(),
      logoUrl: z.string(),
    })).optional(),
  }),
});

export const SiteSettingsValidation = { updateSiteSettingsValidation };
