import { DomainError } from "./DomainError.js";

export class ForbiddenOperationError extends DomainError {
  readonly name = "ForbiddenOperationError";

  constructor(message: string) {
    super(message);
  }
}
