import z, { ZodError } from 'zod';
import dotenv from 'dotenv';
import { ConfigurationError } from '@domain/errors/ConfigurationError';

// Validation schema
const environmentVariablesValidator = z
  .object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(['local', 'staging', 'production', 'test']),
    PORT: z.coerce.number(),
    FRONTEND_URL: z.url(),
    MAILDEV_HOST: z.string().optional(),
    MAILDEV_PORT: z.string().optional(),
    SMTP_HOST: z.string().min(1).optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_SECURE: z.enum(['true', 'false']).optional(),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_PASS: z.string().min(1).optional(),
    MAIL_FROM: z.string().min(1).optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;

    const required = [
      ['SMTP_HOST', env.SMTP_HOST],
      ['SMTP_PORT', env.SMTP_PORT],
      ['SMTP_SECURE', env.SMTP_SECURE],
      ['SMTP_USER', env.SMTP_USER],
      ['SMTP_PASS', env.SMTP_PASS],
      ['MAIL_FROM', env.MAIL_FROM],
    ] as const;

    for (const [name, value] of required) {
      if (value === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: [name],
          message: `${name} is required in production`,
        });
      }
    }
  });

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

class EnvironmentService {
  private environmentVariables: EnvironmentVariables | null = null;

  load() {
    if (this.environmentVariables) return;

    dotenv.config({ quiet: true });

    try {
      this.environmentVariables = environmentVariablesValidator.parse(process.env);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error('Error loading environment variables: ' + JSON.stringify(error));
      } else {
        throw new Error(`Unknown error: ${error}`);
      }
    }
  }

  get(): EnvironmentVariables {
    if (!this.environmentVariables) {
      throw new ConfigurationError(
        'Environment variables not loaded. Call .load() first'
      );
    }
    return this.environmentVariables;
  }
}

export const environmentService = new EnvironmentService();
