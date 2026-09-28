// Error del que extienden el resto de errores de dominio
export abstract class DomainError extends Error {
  abstract readonly name: string;
}
