// auth.container.ts

import { GetProfileUseCase } from "../../application/use-cases/auth/get-profile.use-case";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { UpdateWalletAdressUseCase } from "../../application/use-cases/auth/update-wallet-address.use-case";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { repositories } from "../repositories.bootstrap";

const { userRepo } = repositories;

// ================= USE CASES =================

const registerUseCase = new RegisterUseCase(userRepo);
const loginUseCase = new LoginUseCase(userRepo);
const getProfileUseCase = new GetProfileUseCase(userRepo);
const updateWalletAddressUseCase = new UpdateWalletAdressUseCase(userRepo);

// ================= CONTROLLER =================

export const authController = new AuthController({
  registerUseCase,
  loginUseCase,
  getProfileUseCase,
  updateWalletAddressUseCase,
});
