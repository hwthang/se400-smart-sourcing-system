// auth.route.ts

import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.middleware";

import { AuthController } from "../controllers/auth.controller";

export const createAuthRoute = (
  controller: AuthController,
) => {
  const router = Router();

  // ================= AUTH =================

  router.post(
    "/register",
    controller.register,
  );

  router.post(
    "/login",
    controller.login,
  );

  // ================= PROFILE =================

  router.get(
    "/profile",
    authenticate,
    controller.getProfile,
  );

  // ================= WALLET =================

  router.patch(
    "/profile/wallet",
    authenticate,
    controller.updateWalletAddress,
  );

  return router;
};