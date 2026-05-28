import "dotenv/config";
import Database from "./config/database";
import app from "./app";

const PORT = Number(process.env.PORT);

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await Database.getInstance().connect(process.env.MONGO_URI);

    // await bootstrapBlockchainListeners()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
