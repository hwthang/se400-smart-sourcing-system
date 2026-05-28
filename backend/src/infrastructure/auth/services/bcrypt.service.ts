import bcrypt from "bcrypt";

export class BcryptService {
  private static readonly saltRounds = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
