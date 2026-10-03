import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'El nombre debe tener mínimo tres caracteres.'),

    surname: z.string().trim().min(1, 'Los apellidos son obligatorios.'),

    username: z
      .string()
      .trim()
      .min(3, 'El nombre de usuario debe tener mínimo tres caracteres.')
      .regex(
        /^[a-zA-Z0-9._]+$/,
        'El nombre de usuario solo puede contener letras, números, puntos y guiones bajos.'
      ),

    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es obligatorio.')
      .pipe(
        z.email({
          error: 'Introduce un correo electrónico válido.',
        })
      ),

    password: z
      .string()
      .min(1, 'La contraseña es obligatoria.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/,
        'Debe tener entre 8 y 15 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      ),

    repeatPassword: z.string().min(1, 'Debes repetir la contraseña.'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['repeatPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
