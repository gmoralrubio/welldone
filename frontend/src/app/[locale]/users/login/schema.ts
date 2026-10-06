import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'identifierRequired'),
  password: z.string().min(1, 'passwordRequired'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
