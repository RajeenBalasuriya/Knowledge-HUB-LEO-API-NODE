import { Router } from "express";

import { createUser } from "../controllers/user.controller";
import { getUsers } from "../controllers/user.controller";
import { updateUser } from "../controllers/user.controller";

import { CreateUserDto } from "../DTOs/create-user.dto";
import { validateDto } from "../middlewares/validateDto";
import { UpdateUserDto } from "../DTOs/update-user.dto";

const userRouter = Router();

//define user routes
userRouter.post('/',validateDto(CreateUserDto),createUser);
userRouter.get('/',getUsers);
userRouter.put('/:id',validateDto(UpdateUserDto),updateUser)

export default userRouter;

