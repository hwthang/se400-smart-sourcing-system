import { User } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";
import { UserRepository } from "../../repositories/user.repo";
import { BcryptService } from "../../../infrastructure/auth/services/bcrypt.service";
import { AppError } from "../../../presentation/errors/app.error";

export class RegisterUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    // =========================================================
    // 1. CHECK EMAIL EXIST
    //    Ensure email is unique before creating user
    // =========================================================
    const existingEmail = await this.userRepo.findByEmail(data.email);

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }

    // =========================================================
    // 2. CHECK USERNAME EXIST
    //    Ensure username is unique before creating user
    // =========================================================
    const existingUsername = await this.userRepo.findByUsername(data.username);

    if (existingUsername) {
      throw new AppError("Username already exists", 409);
    }

    // =========================================================
    // 3. HASH PASSWORD
    //    Never store plain password in database
    // =========================================================
    const hashedPassword = await BcryptService.hash(data.password);

    let newUser: User;

    try {
      // =========================================================
      // 4. CREATE DOMAIN ENTITY
      //    Build User aggregate and enforce domain rules
      // =========================================================
      newUser = User.create({
        username: data.username,
        email: data.email,
        hashedPassword,
        role: data.role,
      });
    } catch (error) {
      // =========================================================
      // 5. MAP DOMAIN ERROR
      //    Convert domain exception into application error
      // =========================================================
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }

      throw new AppError("Failed to create user", 500);
    }

    // =========================================================
    // 6. PERSIST TO DATABASE
    //    Save domain entity through repository abstraction
    // =========================================================
    const user = await this.userRepo.save(newUser);

    // =========================================================
    // 7. RETURN CREATED USER DTO
    // =========================================================
    return UserMapper.toDto(user);
  }
}
