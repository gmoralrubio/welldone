import express, { Request, Response } from "express";
import { userRouter } from "./ui/user/routes/user-route.js";

const api = express();

api.use(express.json());

api.use("/users", userRouter);

// api.use('/articles', articlesRouter);

api.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// TODO: implementar src/ui/shared/middlewares/error-handler-middleware.ts
// api.use(errorHandlerMiddleware)

export default api;
