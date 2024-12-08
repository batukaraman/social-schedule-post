import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.password) {
    throw new Error("Kullanıcı bulunamadı.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Geçersiz şifre.");
  }

  const token = generateJwt(user);
  return token;
};

const generateJwt = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
