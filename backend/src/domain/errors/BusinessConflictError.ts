import { DomainError } from "./DomainError.js";

export class BusinessConflictError extends DomainError {
  readonly name = "BusinessConflictError";

  constructor(message: string) {
    super(message);
  }
}
