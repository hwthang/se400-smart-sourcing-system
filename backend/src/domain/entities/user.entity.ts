import { UserRole } from "../enums/user-role.enum";

interface UserData {
  id?: string;
  walletAddress: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateUserData {
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
}

export class User {
  private _id?: string;
  private _walletAddress: string;
  private _username: string;
  private _email: string;
  private _hashedPassword: string;
  private _role: UserRole;
  private _isActive: boolean;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: UserData) {
    this._id = data.id;
    this._walletAddress = data.walletAddress;
    this._username = data.username;
    this._email = data.email;
    this._hashedPassword = data.hashedPassword;
    this._role = data.role;
    this._isActive = data.isActive;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  static create(data: CreateUserData) {
    return new User({
      walletAddress: "",
      username: data.username,
      email: data.email,
      hashedPassword: data.hashedPassword,
      role: data.role,
      isActive: true,
    });
  }

  get id(): string | undefined {
    return this._id;
  }

  get walletAddress(): string | undefined {
    return this._walletAddress;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get hashedPassword(): string {
    return this._hashedPassword;
  }

  get role(): UserRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateWalletAddress(address: string): void {
    this._walletAddress = address;
  }

  updateHashedPassword(password: string): void {
    this._hashedPassword = password;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  updateRole(role: UserRole): void {
    this._role = role;
  }

  updateEmail(email: string): void {
    this._email = email;
  }

  updateUsername(username: string): void {
    this._username = username;
  }
}
