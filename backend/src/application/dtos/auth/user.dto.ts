import { UserRole } from "../../../domain/enums/user-role.enum";

export interface UserDto {
  id?: string;
  username: string;
  email: string;
  walletAddress?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
