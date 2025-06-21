import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";

interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: number;
  role: string;
  profile_img?: string | null; // nullable
}

//create user function being exported
export const createUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, mobile_no, role, profile_img } =
      req.body;

    //check for existane
    const userExists = await User.findOne({
      where: {
        email: email,
      },
    });
    

    if (userExists) {
      res.status(409).json({
        message: `A user with this email already exists.${userExists.email}`,
      });

      return;
    }

    const user = User.create({
      first_name,
      last_name,
      email,
      mobile_no,
      role,
      profile_img,
    });

    const createdUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: createdUser.user_id,
        name: `${createdUser.first_name} ${createdUser.last_name}`,
        email: createdUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};


//read user function being exported
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, count] = await User.findAndCount({
      skip,
      take: limit,
      order: {
        first_name: "ASC",
      },
    });

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: {
        users,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

//update user function being exported
export const updateUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await User.findOneBy({ user_id: userId });

    if (!user) {
       res.status(404).json({
        status: "error",
        message: "User not found",
      });

      return
    }

    // Update fields 
    Object.assign(user, req.body);

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

