import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../midellewares/errorHandler';
import { uploadImage } from '../services/upload.service';
import prisma from '../config/prisma';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  console.log(_req.body);
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: 'User deleted' });
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
};
// export const uploadImage = (
//   buffer: Buffer,
//   folder: string,
//   publicId: string,
// ):

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!req.file) throw new AppError('No file uploaded', 400);
    const url = await uploadImage(req.file.buffer, 'avatars', `user-${userId}`);
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
    });
    res.status(201).json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    next(error);
  }
};
