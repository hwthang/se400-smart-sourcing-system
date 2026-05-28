import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./presentation/middlewares/error.middleware";
import { createAppRoute } from "./presentation/routes/app.route";
import { appContainer } from "./bootstrap/containers/app.container";

const app = express();

// core middleware
app.use(cors());
app.use(express.json());

// logger
app.use(morgan("dev"));

// routes
app.use("/api", createAppRoute(appContainer.controllers));

// health check
app.get("/", (req, res) => {
  console.log("12");
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
