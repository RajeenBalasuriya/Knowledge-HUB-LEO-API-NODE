import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { CreateUserDto } from "../DTOs/create-user.dto";
import { validateDto } from "../middlewares/validateDto";

const userRouter = Router();

//define user routes
userRouter.post('/',validateDto(CreateUserDto),createUser);

export default userRouter;

