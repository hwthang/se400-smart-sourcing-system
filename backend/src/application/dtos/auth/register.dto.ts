import { UserRole } from "../../../domain/enums/user-role.enum";

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
