import jwt from "jsonwebtoken";
import { AuthUser } from "../../application/common/auth-user";

export class JwtService {
  private static readonly secret = process.env.JWT_SECRET || "secret_key";

  private static readonly expiresIn: jwt.SignOptions["expiresIn"] = "1d";

  static sign(payload: AuthUser): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  static verify(token: string): AuthUser {
    return jwt.verify(token, this.secret) as AuthUser;
  }
}
