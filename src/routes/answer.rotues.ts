import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { createAnswer } from "../controllers/answer.controller";

const answerRouter = Router();

answerRouter.post("/",authenticateMiddleware,createAnswer);

export default answerRouter;
