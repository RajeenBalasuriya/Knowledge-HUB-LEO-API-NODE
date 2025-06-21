import { User } from "../entities/user.entity";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async login(email: string,password:string): Promise<{ token: string; user: User } | null> {
    const user = await User.findOneBy({ email });

    if (!user) {
      return null;
    }

    if(user.password==password){
    const token = generateToken(user);
        return { token, user };
    }

    return null;

  }
}
