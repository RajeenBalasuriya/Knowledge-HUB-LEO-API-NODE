import { Express, Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { createComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post("/",authenticateMiddleware,createComment);

export default commentRouter;
