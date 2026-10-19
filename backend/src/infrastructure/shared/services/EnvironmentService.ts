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
    REDIS_URL: z.url(),
    MAILDEV_HOST: z.string().optional(),
    MAILDEV_PORT: z.string().optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_FROM_EMAIL: z.email().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;

    if (!env.RESEND_API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['RESEND_API_KEY'],
        message: 'RESEND_API_KEY is required in production',
      });
    }

    if (!env.RESEND_FROM_EMAIL) {
      ctx.addIssue({
        code: 'custom',
        path: ['RESEND_FROM_EMAIL'],
        message: 'RESEND_FROM_EMAIL is required in production',
      });
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
