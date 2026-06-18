import { NextFunction, Request, Response } from 'express';
import { UserMovieStatus } from '@prisma/client';
import * as userMovieService from '../services/userMovie.service';

export const addMovieToList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userMovie = await userMovieService.addMovieToList(
      Number(req.user?.userId),
      req.body,
    );
    res.status(201).json(userMovie);
  } catch (error) {
    next(error);
  }
};

export const updateMovieStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userMovie = await userMovieService.updateMovieStatus(
      Number(req.params.id),
      Number(req.user?.userId),
      req.body,
    );
    res.status(200).json(userMovie);
  } catch (error) {
    next(error);
  }
};

export const removeFromList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const entry = await userMovieService.removeFromList(
      Number(req.params.id),
      Number(req.user?.userId),
    );
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getUserMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const entries = await userMovieService.getUserMovies(
      Number(req.user?.userId),
      req.query.status as UserMovieStatus | undefined,
    );
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};
