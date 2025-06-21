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
        status: "error",
        message: `A user with this email already exists.`,
        error: {
          code: "DUPLICATE_EMAIL",
          details: { email },
        },
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
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          id: createdUser.user_id,
          name: `${createdUser.first_name} ${createdUser.last_name}`,
          email: createdUser.email,
          role: createdUser.role,
          mobile_no: createdUser.mobile_no,
          profile_img: createdUser.profile_img,
        },
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

//read user function being exported
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

//get user by id function being exported
export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await User.findOneBy({ user_id: userId });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
        error: {
          code: "USER_NOT_FOUND",
          details: null,
        },
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user: {
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          mobile_no: user.mobile_no,
          profile_img: user.profile_img,
        },
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

//update user function being exported
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await User.findOneBy({ user_id: userId });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });

      return;
    }

    // Update fields
    Object.assign(user, req.body);

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user: {
          id: updatedUser.user_id,
          name: `${updatedUser.first_name} ${updatedUser.last_name}`,
          email: updatedUser.email,
          role: updatedUser.role,
          mobile_no: updatedUser.mobile_no,
          profile_img: updatedUser.profile_img,
        },
        meta: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete user function being exported
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await User.findOneBy({ user_id: userId });

    if (!user) {
      res.status(404).json({
  status: "error",
  message: "User not found",
  error: {
    code: "USER_NOT_FOUND",
    details: null,
  },
});

      return;
    }

    await user.remove(); // Active Record style deletion

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: {
        user: {
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        },
        meta: null,
      },
    });
  } catch (error) {
    next(error);
  }
};
