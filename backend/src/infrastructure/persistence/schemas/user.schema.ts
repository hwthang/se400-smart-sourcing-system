import { Schema, model, Document } from "mongoose";
import { UserRole } from "../../../domain/enums/user-role.enum";

// =========================================================
// USER DOCUMENT INTERFACE
// Defines the shape of User document in MongoDB
// =========================================================
export interface UserDocument extends Document {
  username: string;
  email: string;
  hashedPassword: string;
  walletAddress: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// =========================================================
// USER SCHEMA DEFINITION
// =========================================================
const UserSchema = new Schema<UserDocument>(
  {
    // -------------------------
    // Username - required for login and display
    // -------------------------
    username: { type: String, required: true },

    // -------------------------
    // Email - unique identifier for authentication
    // Used for login and password recovery
    // -------------------------
    email: { type: String, required: true, unique: true },

    // -------------------------
    // Hashed Password - bcrypt hash, never store plain text
    // -------------------------
    hashedPassword: { type: String, required: true },

    // -------------------------
    // Wallet Address - optional, used for blockchain integration
    // Can be updated after user registration
    // -------------------------
    walletAddress: { type: String, default: "" },

    // -------------------------
    // User Role - determines system permissions
    // Values: BUYER, SUPPLIER, PROCUREMENT_MANAGER, ADMIN
    // -------------------------
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    // -------------------------
    // Active Status - soft delete mechanism
    // Inactive users cannot log in or perform actions
    // -------------------------
    isActive: { type: Boolean, default: true },
  },
  {
    // -------------------------
    // Timestamps - automatically adds createdAt & updatedAt
    // -------------------------
    timestamps: true,
    versionKey: false,
  },
);

// =========================================================
// MONGOOSE MODEL
// =========================================================
export const UserModel = model<UserDocument>("User", UserSchema);
