import { User, IUser } from "../models/User";
import { comparePassword, hashPassword } from "../utils/hash.util";
import { generateToken } from "../utils/token.util";

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async ({ fullName, email, password }: RegisterInput) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    token,
  };
};