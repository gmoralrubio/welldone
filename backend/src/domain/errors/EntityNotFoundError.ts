import { DomainError } from "./DomainError.js";

export class EntityNotFoundError extends DomainError {
  readonly name = "EntityNotFoundError";

  constructor(entity: string, data: number | string) {
    super(`Entity ${entity} not found with data ${data}`);
  }
}
