import { NextFunction, Response } from "express";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { GetProfileUseCase } from "../../application/use-cases/auth/get-profile.use-case";
import { UpdateWalletAdressUseCase } from "../../application/use-cases/auth/update-wallet-address.use-case";
import { sendResponse } from "../utils/response";
import { AuthRequest } from "../middlewares/authenticate.middleware";

type AuthControllerUseCases = {
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  getProfileUseCase: GetProfileUseCase;
  updateWalletAddressUseCase: UpdateWalletAdressUseCase;
};

export class AuthController {
  constructor(private readonly useCases: AuthControllerUseCases) {}

  // =========================================================
  // REGISTER USER
  // Purpose: delegate user creation to business layer (use case)
  // =========================================================
  register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.useCases.registerUseCase.execute(req.body);

      return sendResponse(res, user, "User registered successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // LOGIN USER
  // Purpose: authenticate credentials and return JWT access token
  // =========================================================
  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = await this.useCases.loginUseCase.execute(req.body);

      return sendResponse(
        res,
        { accessToken },
        "User logged in successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // GET CURRENT USER (ME)
  // Purpose: return authenticated user profile from JWT context
  // =========================================================
  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authUser = req.user;

      const user = await this.useCases.getProfileUseCase.execute(authUser);

      return sendResponse(
        res,
        user,
        "Current user retrieved successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // UPDATE WALLET ADDRESS TO USER
  // Purpose: bind blockchain wallet address to authenticated user
  // =========================================================
  updateWalletAddress = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authUser = req.user;

      // Wallet address can come from request body
      const { address } = req.body;

      const user = await this.useCases.updateWalletAddressUseCase.execute(
        authUser,
        address,
      );

      return sendResponse(res, user, "Wallet added successfully", 200);
    } catch (error) {
      next(error);
    }
  };
}
