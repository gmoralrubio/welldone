import { BadSyntaxError } from '../../errors/BadSyntaxError';

export function validatePassword(password: string): void {
  const validPasswordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/;

  if (!validPasswordRegEx.test(password)) {
    throw new BadSyntaxError('Invalid password syntax, password is not strong enough');
  }
}
