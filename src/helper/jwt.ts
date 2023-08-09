import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

class JWTFunctions {
  static async signToken(data: Partial<IUser>): Promise<string> {
    try {
      const token = await jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: 10000,
      });
      return token as string;
    } catch (error) {
      throw error;
    }
  }

  static async verifyJWT(token: string): Promise<any> {
    try {
      const data = await jwt.verify(token, process.env.JWT_SECRET);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default JWTFunctions;
