import { NextFunction, Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await reviewService.createReview(
      Number(req.user?.userId),
      req.body,
    );
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await reviewService.updateReview(
      Number(req.params.id),
      Number(req.user?.userId),
      req.body,
    );
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await reviewService.deleteReview(
      Number(req.params.id),
      Number(req.user?.userId),
    );
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const getMovieReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await reviewService.getMovieReviews(
      Number(req.query.movieId),
    );
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
