/**
 * Protección frente a ataques por fuerza bruta en el inicio de sesión.
 * Controla los intentos fallidos por cuenta de usuario.
 */

export interface LoginAttemptSecurityService {
  isBlocked(userId: number): boolean;
  registerFailure(userId: number): void;
  resetFailures(userId: number): void;
}
