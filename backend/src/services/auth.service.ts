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
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    },
  );

  const rawRefreshToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    rawRefreshToken,
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
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

export const logout = async (rawRefreshToken: string) => {
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');

  await prisma.refreshToken.delete({
    where: { tokenHash },
  });
};

export const refresh = async (rawRefreshToken: string) => {
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // get user to put in new accessToken
  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
  });
  if (!user) throw new AppError('User not found', 401);

  // delete old token (rotation)
  await prisma.refreshToken.delete({ where: { tokenHash } });

  // create new tokens
  const newRawRefreshToken = crypto.randomBytes(32).toString('hex');
  const newTokenHash = crypto
    .createHash('sha256')
    .update(newRawRefreshToken)
    .digest('hex');

  await prisma.refreshToken.create({
    data: {
      tokenHash: newTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' },
  );

  return { accessToken, newRawRefreshToken };
};
