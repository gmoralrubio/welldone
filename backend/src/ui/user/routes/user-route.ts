import { Router } from "express";
import { registerUserController } from "../controllers/register-user-controller";
import { loginUserController } from "../controllers/login-user-controller";
import { deleteUserController } from "../controllers/delete-user-controller";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";

export const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.delete("/me", authenticationMiddleware, deleteUserController);
