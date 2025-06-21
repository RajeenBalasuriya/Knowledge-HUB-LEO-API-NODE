import { Router } from "express";

import { createUser } from "../controllers/user.controller";
import { getUsers } from "../controllers/user.controller";

import { CreateUserDto } from "../DTOs/create-user.dto";
import { validateDto } from "../middlewares/validateDto";

const userRouter = Router();

//define user routes
userRouter.post('/',validateDto(CreateUserDto),createUser);
userRouter.get('/',getUsers);

export default userRouter;

