import { UserModel } from "../schemas/user.schema";
import { UserMapper } from "../mappers/user.mapper";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../application/repositories/user.repo";

export class MongoUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    let doc;
    if (user.id) {
      doc = await UserModel.findByIdAndUpdate(user.id, persistence, {
        new: true,
      });
    } else {
      doc = await UserModel.create(persistence);
    }
    return UserMapper.toDomain(doc!);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username });
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const doc = await UserModel.findOne({ walletAddress });
    console.log(walletAddress)
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }
}
