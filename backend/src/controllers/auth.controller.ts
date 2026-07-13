import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { AppError } from '../midellewares/errorHandler';

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
    const { accessToken, rawRefreshToken, user } = await AuthService.login(
      req.body.email,
      req.body.password,
    );

    // set httpOnly cookie — JS can never access this
    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS in prod
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    // only accessToken + user in response body
    res.status(200).json({ accessToken, user });
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

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawRefreshToken = req.cookies.refreshToken;
    if (!rawRefreshToken) throw new AppError('No refresh token', 401);

    await AuthService.logout(rawRefreshToken);

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawRefreshToken = req.cookies.refreshToken;
    if (!rawRefreshToken) throw new AppError('No refresh token', 401);

    const { accessToken, newRawRefreshToken } =
      await AuthService.refresh(rawRefreshToken);

    res.cookie('refreshToken', newRawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};
