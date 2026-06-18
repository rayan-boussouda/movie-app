import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { AppError } from '../midellewares/errorHandler';
import jwt from 'jsonwebtoken';

export const register = async (data: Prisma.UserUncheckedCreateInput) => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) {
    throw new AppError('User already exists', 409);
  }
  const hash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { ...data, password: hash } });
  const { password, ...userWithoutPasword } = user;
  return userWithoutPasword;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid Credentials', 401);
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError('Invalid Credentials', 401);
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    },
  );
  return { token };
};
