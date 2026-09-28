import { DomainError } from "./DomainError.js";

export class UnauthorizedError extends DomainError {
  readonly name = "UnauthorizedError";

  constructor(message: string) {
    super(message);
  }
}
