import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'nameMin'),

    surname: z.string().trim().min(1, 'surnameRequired'),

    username: z
      .string()
      .trim()
      .min(3, 'usernameMin')
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

    password: z
      .string()
      .min(1, 'passwordRequired')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/,
        'passwordPattern'
      ),

    repeatPassword: z.string().min(1, 'repeatPasswordRequired'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'passwordsMismatch',
    path: ['repeatPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
