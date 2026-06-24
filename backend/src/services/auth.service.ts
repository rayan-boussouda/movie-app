import crypto from 'crypto';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { AppError } from '../midellewares/errorHandler';
import jwt from 'jsonwebtoken';
import { emailQueue } from '../queues/email.queue';
import { sendPasswordResetEmail } from './email.service';

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

const ONE_HOUR = new Date(Date.now() + 60 * 60 * 1000);

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { tokenHash, expiresAt: ONE_HOUR },
      create: { tokenHash, userId: user.id, expiresAt: ONE_HOUR },
    });
    // await sendPasswordResetEmail('rayanbsd@gmail.com', rawToken);
    await emailQueue.add('send-reset-email', {
      to: 'rayanbsd@gmail.com',
      resetLink: rawToken,
    });
  }
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!record || record.expiresAt < new Date())
    throw new AppError('Invalid or expired token', 400);
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hash },
  });
  await prisma.passwordResetToken.delete({ where: { tokenHash } });
};
