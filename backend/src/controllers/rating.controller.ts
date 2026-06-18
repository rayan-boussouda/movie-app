import { NextFunction, Request, Response } from 'express';
import * as ratingService from '../services/rating.service';

export const createRating = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rating = await ratingService.createRating(
      Number(req.user?.userId),
      req.body,
    );
    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
};

export const updateRating = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rating = await ratingService.updateRating(
      Number(req.params.id),
      Number(req.user?.userId),
      req.body,
    );
    res.status(200).json(rating);
  } catch (error) {
    next(error);
  }
};

export const deleteRating = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rating = await ratingService.deleteRating(
      Number(req.params.id),
      Number(req.user?.userId),
    );
    res.status(200).json(rating);
  } catch (error) {
    next(error);
  }
};

export const getMovieRatings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ratings = await ratingService.getMovieRatings(
      Number(req.query.movieId),
    );
    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};
