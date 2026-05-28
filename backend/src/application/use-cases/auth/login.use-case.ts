import { BcryptService } from "../../../infrastructure/auth/services/bcrypt.service";
import { JwtService } from "../../../infrastructure/auth/services/jwt.service";
import { AppError } from "../../../presentation/errors/app.error";
import { UserRepository } from "../../repositories/user.repo";

export class LoginUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: { identifier: string; password: string }) {
    const { identifier, password } = data;

    // =========================================================
    // 1. FIND USER BY EMAIL
    //    Attempt to locate user by email first
    // =========================================================
    let user = await this.userRepo.findByEmail(identifier);

    // =========================================================
    // 2. IF NOT FOUND BY EMAIL -> TRY USERNAME
    //    identifier can be either email or username
    // =========================================================
    if (!user) {
      user = await this.userRepo.findByUsername(identifier);
    }

    // =========================================================
    // 3. USER NOT FOUND -> INVALID CREDENTIALS
    //    Do NOT leak whether email or username exists
    // =========================================================
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    let isPasswordValid: boolean;

    try {
      // =========================================================
      // 4. VERIFY PASSWORD
      //    Compare plain password with hashed password
      // =========================================================
      isPasswordValid = await BcryptService.compare(
        password,
        (user as any)._hashedPassword, // or use getter if available
      );
    } catch (err) {
      // =========================================================
      // 5. HANDLE DOMAIN / SERVICE ERROR
      //    Wrap any unexpected bcrypt errors into AppError
      // =========================================================
      if (err instanceof Error) {
        throw new AppError(err.message, 500);
      }
      throw new AppError("Password verification failed", 500);
    }

    // =========================================================
    // 6. PASSWORD INVALID -> THROW ERROR
    // =========================================================
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // =========================================================
    // 7. CHECK USER STATUS (ACTIVE/INACTIVE)
    // =========================================================
    if (!user.isActive) {
      throw new AppError("User is inactive", 403);
    }

    let accessToken: string;

    try {
      // =========================================================
      // 8. GENERATE JWT ACCESS TOKEN
      //    Include minimal necessary payload
      // =========================================================
      accessToken = JwtService.sign({
        id: user.id!,
        role: user.role,
      });
    } catch (err) {
      // =========================================================
      // 9. HANDLE JWT SERVICE ERRORS
      // =========================================================
      if (err instanceof Error) {
        throw new AppError(err.message, 500);
      }
      throw new AppError("Failed to generate access token", 500);
    }

    // =========================================================
    // 10. RETURN TOKEN TO CONTROLLER
    //    Controller handles wrapping into standard API response
    // =========================================================
    return accessToken;
  }
}
