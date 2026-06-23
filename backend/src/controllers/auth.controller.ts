import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res
      .status(200)
      .json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AuthService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
