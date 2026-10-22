import { LoginAttemptSecurityService } from '@domain/user/services/LoginAttemptSecurityService';

interface LoginAttemptRecord {
  attempts: number;
  expiresAt: number;
}

export class InMemoryLoginAttemptSecurityService implements LoginAttemptSecurityService {
  private static readonly attempts = new Map<number, LoginAttemptRecord>();

  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000;

  isBlocked(userId: number): boolean {
    const record = InMemoryLoginAttemptSecurityService.attempts.get(userId);

    if (!record) {
      return false;
    }

    if (Date.now() >= record.expiresAt) {
      InMemoryLoginAttemptSecurityService.attempts.delete(userId);
      return false;
    }

    return record.attempts >= this.maxAttempts;
  }

  registerFailure(userId: number): void {
    const now = Date.now();
    const record = InMemoryLoginAttemptSecurityService.attempts.get(userId);

    if (!record || now >= record.expiresAt) {
      InMemoryLoginAttemptSecurityService.attempts.set(userId, {
        attempts: 1,
        expiresAt: now + this.windowMs,
      });

      return;
    }

    record.attempts += 1;
  }

  resetFailures(userId: number): void {
    InMemoryLoginAttemptSecurityService.attempts.delete(userId);
  }
}
