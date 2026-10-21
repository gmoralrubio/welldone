import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
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

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
