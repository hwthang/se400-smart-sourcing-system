import { UserRepository } from "../../repositories/user.repo";
import { AuthUser } from "../../common/auth-user";
import { AppError } from "../../../presentation/errors/app.error";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";

export class UpdateWalletAdressUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(authUser: AuthUser, address: string) {
    try {
      // =========================================================
      // 1. VALIDATE AUTH USER
      //    Ensure request is authenticated
      // =========================================================
      if (!authUser?.id) {
        throw new AppError("Unauthorized", 401);
      }

      // =========================================================
      // 2. VALIDATE INPUT ADDRESS
      //    Wallet address is required for binding
      // =========================================================
      if (!address) {
        throw new AppError("Wallet address is required", 400);
      }

      // =========================================================
      // 3. FETCH USER FROM DATABASE
      //    Retrieve latest user state from persistence layer
      // =========================================================
      const user = await this.userRepo.findById(authUser.id);

      // =========================================================
      // 4. CHECK USER EXISTENCE
      //    Prevent operation on deleted/non-existent user
      // =========================================================
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // =========================================================
      // 5. ASSIGN WALLET ADDRESS (OVERRIDE IF EXISTS)
      //    Bind blockchain wallet to user identity
      //    Note: Allows replacing existing wallet address
      // =========================================================
      user.updateWalletAddress(address);

      // =========================================================
      // 6. PERSIST UPDATED USER
      //    Save modified aggregate through repository abstraction
      // =========================================================
      const updatedUser = await this.userRepo.save(user);

      // =========================================================
      // 7. MAP DOMAIN ENTITY TO DTO
      //    Prevent exposing internal domain structure
      // =========================================================
      return UserMapper.toDto(updatedUser);
    } catch (error) {
      // =========================================================
      // 8. MAP ERROR TO APPLICATION ERROR
      //    Normalize unknown/domain errors into AppError
      // =========================================================
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }

      throw new AppError("Failed to add wallet", 500);
    }
  }
}