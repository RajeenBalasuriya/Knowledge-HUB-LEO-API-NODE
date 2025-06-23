import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";


import { createCourse } from "../controllers/course.controller";

const courseRouter =  Router();

courseRouter.get('/', (req, res) => {
  res.json({ message: 'jellp' });
})
courseRouter.post('/',authenticateMiddleware,checkRoleMiddleware,createCourse)

export default courseRouter;