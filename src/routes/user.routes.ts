import { Router } from "express";

import { createUser } from "../controllers/user.controller";
import { getUsers } from "../controllers/user.controller";
import { updateUser } from "../controllers/user.controller";
import { deleteUser } from "../controllers/user.controller";
import { getUserById } from "../controllers/user.controller";

import { validateDto } from "../middlewares/validateDto";
import { authenticateMiddleware } from "../middlewares/auth";

import { CreateUserDto } from "../DTOs/create-user.dto";
import { UpdateUserDto } from "../DTOs/update-user.dto";

const userRouter = Router();

//define user routes
userRouter.post('/',validateDto(CreateUserDto),createUser);
userRouter.get('/',authenticateMiddleware,getUsers);
userRouter.get('/:id',getUserById)
userRouter.put('/:id',validateDto(UpdateUserDto),updateUser)
userRouter.delete('/:id',deleteUser)

export default userRouter;

