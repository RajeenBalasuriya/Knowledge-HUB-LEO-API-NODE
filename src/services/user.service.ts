import { User } from "../entities/user.entity";
import { IUser } from "../interfaces/IUser.interface";

export class UserService {
  async createUser(data: IUser) {
    const {
      first_name,
      last_name,
      email,
      password,
      mobile_no,
      role,
      profile_img,
    } = data;

    // Check for existence
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return {
        exists: true,
        user: userExists,
      };
    }

    const user = User.create({
      first_name,
      last_name,
      email,
      password,
      mobile_no,
      role,
      profile_img,
    });
    const createdUser = await user.save();

    return {
      exists: false,
      user: createdUser,
    };
  }

  async getUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, count] = await User.findAndCount({
      skip,
      take: limit,
      order: {
        first_name: "ASC",
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        mobile_no: true,
        role: true,
        profile_img: true,
      },
    });

    return {
      users,
      meta: {
        total: count,
        page,
        last_page: Math.ceil(count / limit),
      },
    };
  }

  async getUserById(userId: number) {
    const user = await User.findOneBy({ user_id: userId });
    return user;
  }

  async updateUser(userId: number, updates: Partial<IUser>) {
    const user = await User.findOneBy({ user_id: userId });

    if (!user) return null;

    Object.assign(user, updates);
    const updatedUser = await user.save();

    return updatedUser;
  }

  async deleteUser(userId: number) {
    const user = await User.findOneBy({ user_id: userId });

    if (!user) return null;

    await user.remove();
    return user;
  }
}
