import { ValidationError } from '../../errors/ValidationError';

export function validateUsername(username: unknown): void {
  if (typeof username !== 'string' || !username.trim()) {
    throw new ValidationError('Username is required');
  }

  if (username.length < 3 || username.length > 20) {
    throw new ValidationError('Username must be between 3 and 20 characters');
  }

  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    throw new ValidationError(
      'Username can only contain letters, numbers, periods (.) and underscores (_)'
    );
  }
}
