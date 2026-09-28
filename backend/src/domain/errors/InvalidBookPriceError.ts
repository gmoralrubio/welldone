import { DomainError } from "./DomainError.js";

export class InvalidBookPriceError extends DomainError {
  readonly name = "InvalidBookPriceError";

  constructor() {
    super("Book price cannot be less than zero");
  }
}
