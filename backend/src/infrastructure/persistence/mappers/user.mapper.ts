import { User } from "../../../domain/entities/user.entity";
import { UserDocument } from "../schemas/user.schema";
import { UserDto } from "../../../application/dtos/auth/user.dto";

export class UserMapper {
  static toPersistence(user: User): Partial<UserDocument> {
    return {
      username: user.username,
      email: user.email,
      hashedPassword: user.hashedPassword,
      walletAddress: user.walletAddress,
      role: user.role,
      isActive: user.isActive,
    };
  }
  static toDomain(doc: UserDocument): User {
    return new User({
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      hashedPassword: doc.hashedPassword,
      walletAddress: doc.walletAddress,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  static toDto(user: User): UserDto {
    return {
      id: user.id!,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
      isActive: user.isActive,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };
  }
}
