export interface SecurityService {
  hash(value: string): Promise<string>;
  comparePassword(password1: string, password2: string): Promise<boolean>;
  generateJWT(authorId: number): Promise<string>;
  verifyJWT(token: string): { iat: number; authorId: number } | null;
}

// Value es para generalizar,
// pero es la password en este caso.
