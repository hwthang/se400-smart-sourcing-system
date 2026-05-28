import { UserRepository } from "../../repositories/user.repo";
import { AuthUser } from "../../common/auth-user";
import { AppError } from "../../../presentation/errors/app.error";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";

export class GetProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(authUser: AuthUser) {
    try {
      // =========================================================
      // 1. VALIDATE AUTH CONTEXT
      //    Ensure authenticated user exists in JWT payload
      // =========================================================
      if (!authUser?.id) {
        throw new AppError("Unauthorized", 401);
      }

      // =========================================================
      // 2. FETCH USER FROM DATABASE
      //    Always retrieve latest user state from persistence layer
      // =========================================================
      const user = await this.userRepo.findById(authUser.id);

      // =========================================================
      // 3. CHECK USER EXISTENCE
      //    User may have been deleted after token issuance
      // =========================================================
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // =========================================================
      // 4. MAP DOMAIN ENTITY TO DTO
      //    Prevent exposing internal domain structure
      // =========================================================
      return UserMapper.toDto(user);

    } catch (error) {
      // =========================================================
      // 5. MAP ANY ERROR TO AppError
      //    Wrap unexpected errors (repository/domain) into AppError
      // =========================================================
      if (error instanceof AppError) {
        // Already AppError → re-throw
        throw error;
      }

      if (error instanceof Error) {
        // Wrap standard JS error
        throw new AppError(error.message, 500);
      }

      // Fallback for unknown error type
      throw new AppError("Failed to get profile", 500);
    }
  }
}