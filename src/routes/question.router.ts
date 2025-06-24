import { Router } from "express";

import { checkRoleMiddleware } from "../middlewares/checkRole";
import { authenticateMiddleware } from "../middlewares/auth";
import { createQuestion } from "../controllers/question.controller";
import { validateDto } from "../middlewares/validateDto";
import { createQuestionDto } from "../DTOs/create-question.dto";

const questionRouter = Router();

questionRouter.post('/',authenticateMiddleware,checkRoleMiddleware,validateDto(createQuestionDto),createQuestion);

export default questionRouter;