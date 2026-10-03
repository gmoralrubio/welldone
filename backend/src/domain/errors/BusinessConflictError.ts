import { DomainError } from "./DomainError.js";

export class BusinessConflictError extends DomainError {
  readonly name = "BusinessConflictError";
  readonly field?: "email" | "username";

  constructor(message: string, field?: "email" | "username") {
    super(message);
    this.field = field;
  }
}
