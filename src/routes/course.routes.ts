import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";


import { createCourse } from "../controllers/course.controller";
import { validateDto } from "../middlewares/validateDto";
import { CreateCourseDto } from "../DTOs/create-course.dto";

const courseRouter =  Router();


courseRouter.post('/',authenticateMiddleware,checkRoleMiddleware,validateDto(CreateCourseDto),createCourse)

export default courseRouter;