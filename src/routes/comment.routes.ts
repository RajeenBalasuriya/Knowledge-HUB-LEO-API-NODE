import { Express, Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { createComment, deleteComment, updateComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post("/",authenticateMiddleware,createComment);
commentRouter.put("/:id",authenticateMiddleware,updateComment); 
commentRouter.delete("/:id",authenticateMiddleware,deleteComment)

export default commentRouter;
