import express, { Request, Response } from "express";
import { userRouter } from "./ui/user/routes/user-route.js";
import { articlesRouter } from "@ui/article/routes/articles-routes";
import { errorHandlerMiddleware } from "@ui/shared/middlewares/error-handler-middleware.js";

const api = express();
const router = express.Router();

router.use(express.json());

router.use("/users", userRouter);
router.use("/articles", articlesRouter);

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

api.use("/api", router);
api.use(errorHandlerMiddleware);

export default api;
