import { DomainError } from "./DomainError.js";

export class ValidationError extends DomainError {
  readonly name = "ValidationError";

  constructor(message: string) {
    super(message);
  }
}
