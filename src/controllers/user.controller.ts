import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/IUser.interface";


const userService = new UserService();

// Create user
export const createUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
     
    const { exists, user } = await userService.createUser(req.body );

    if (exists) {
       res.status(409).json({
        status: "error",
        message: "A user with this email already exists.",
        error: {
          code: "DUPLICATE_EMAIL",
          details: { email: user.email },
        },
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "User created successfully",
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

// Get all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, meta } = await userService.getUsers(page, limit);

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: {
        users,
        meta,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserById(userId);

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

// Update user
export const updateUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = await userService.updateUser(userId, req.body);

    if (!updatedUser) {
       res.status(404).json({
        status: "error",
        message: "User not found",
      });

      return;
    }

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

// Delete user
export const deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
       res.status(404).json({
        status: "error",
        message: "User not found",
        error: {
          code: "USER_NOT_FOUND",
          details: null,
        },
      });
      return
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: {
        user: {
          id: deletedUser.user_id,
          name: `${deletedUser.first_name} ${deletedUser.last_name}`,
          email: deletedUser.email,
        },
        meta: null,
      },
    });
  } catch (error) {
    next(error);
  }
};
