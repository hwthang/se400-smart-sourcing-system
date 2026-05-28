import { UserRole } from "../../domain/enums/user-role.enum";

export type AuthUser = {
  id: string;
  role: UserRole;
};
