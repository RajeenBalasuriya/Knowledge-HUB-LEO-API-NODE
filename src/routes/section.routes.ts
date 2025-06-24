import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { create } from "domain";
import { createSection } from "../controllers/section.controller";
import { checkRoleMiddleware } from "../middlewares/checkRole";

const sectionRouter = Router();

sectionRouter.post("/",authenticateMiddleware,checkRoleMiddleware,createSection);


export default sectionRouter;