import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().trim().min(3, 'nameMin'),

  surname: z.string().trim().min(1, 'surnameRequired'),

  username: z
    .string()
    .trim()
    .min(3, 'usernameMin')
    .max(20, 'usernameMax')
    .regex(/^[a-zA-Z0-9._]+$/, 'usernamePattern'),

  email: z
    .string()
    .trim()
    .min(1, 'emailRequired')
    .pipe(
      z.email({
        error: 'emailInvalid',
      })
    ),
});

export type AccountFormData = z.infer<typeof accountSchema>;
