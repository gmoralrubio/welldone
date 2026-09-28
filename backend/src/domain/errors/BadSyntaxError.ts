import { DomainError } from "./DomainError.js";

export class BadSyntaxError extends DomainError {
  readonly name = "BadSyntaxError";

  constructor(message: string) {
    super(message);
  }
}
