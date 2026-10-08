import { Router } from "express";
import { registerUserController } from "../controllers/register-user-controller";
import { loginUserController } from "../controllers/login-user-controller";
import { checkAvailabilityController } from "../controllers/check-availability-controller";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { getCurrentUserController } from "../controllers/get-current-user-controller";

export const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);

userRouter.get("/availability", checkAvailabilityController);
userRouter.get("/me", [authenticationMiddleware, getCurrentUserController]);
