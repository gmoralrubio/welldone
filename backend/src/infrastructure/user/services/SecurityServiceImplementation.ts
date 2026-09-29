import bcrypt from "bcrypt";
import { SecurityService } from "../../../domain/user/services/SecurityService";
import jwt from "jsonwebtoken";
import { environmentService } from "@infrastructure/shared/services/EnvironmentService";

export class SecurityServiceImplementation implements SecurityService {
  private readonly SECRET_KEY: string;

  constructor() {
    this.SECRET_KEY = environmentService.get().JWT_SECRET;
  }

  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    // Genera un string aleatorio,
    // el 10 es el coste computacional de la librería para generar ese hash
    // los valores van de 8 a 14 siendo 8 el menos seguro y más rápido, 10 es el estándar
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
  }
  // ¿Cómo funciona el compare de bcrypt?
  // Del hashed password saca el salt de ese momento
  // y se lo aplica a la plain password, si salen iguales son la misma.

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateJWT(authorId: number): Promise<string> {
    const token = jwt.sign({ authorId }, this.SECRET_KEY);
    // Las opciones por defecto son 24 horas
    return token;
  }

  verifyJWT(token: string): { iat: number; authorId: number } | null {
    // Devuelve el token decodificado para que el controlador
    // pueda usar el authorId
    try {
      const decodedToken = jwt.verify(token, this.SECRET_KEY);
      return decodedToken as { iat: number; authorId: number };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }
}
