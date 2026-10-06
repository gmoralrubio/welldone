import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'El email o nombre de usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
