import { BadSyntaxError } from '../../errors/BadSyntaxError';

export function validateEmail(email: string): void {
  const validEmailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!validEmailRegEx.test(email)) {
    throw new BadSyntaxError('Invalid email syntax');
  }
}
