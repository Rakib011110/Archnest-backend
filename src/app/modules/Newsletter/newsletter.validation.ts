import { z } from 'zod';

export const subscribeValidation = z.object({
  body: z.object({ email: z.string().email() }),
});

export const NewsletterValidation = { subscribeValidation };
