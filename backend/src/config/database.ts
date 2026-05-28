import mongoose from "mongoose";

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(uri: string) {
    if (this.isConnected) {
      console.log("⚡ DB already connected");
      return;
    }

    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  }
}

export default Database;
