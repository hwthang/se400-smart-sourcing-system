import { User } from "../../domain/entities/user.entity";

export interface UserRepository {
  save(user: User): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(email: string): Promise<User | null>;
  
  findByWalletAddress(walletAddress: string): Promise<User | null>;
}
