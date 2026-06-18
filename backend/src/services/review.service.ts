import { Prisma, Review } from '@prisma/client';
import prisma from '../config/prisma';
import {
  CreateReviewSchema,
  UpdateReviewSchema,
} from '../schemas/review.schemas';
import { AppError } from '../midellewares/errorHandler';

export const createReview = async (
  userId: number,
  data: CreateReviewSchema,
): Promise<Review> => {
  try {
    const review = await prisma.review.create({
      data: {
        userId,
        movieId: data.movieId,
        content: data.content,
      },
    });
    return review;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new AppError('You already reviewed this movie', 409);
      if (error.code === 'P2025') throw new AppError('Movie not found', 404);
    }
    throw error;
  }
};

export const updateReview = async (
  id: number,
  userId: number,
  data: UpdateReviewSchema,
): Promise<Review> => {
  try {
    const review = await prisma.review.update({
      where: { id, userId },
      data: { content: data.content },
    });
    return review;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError('Review not found', 404);
    }
    throw error;
  }
};

export const deleteReview = async (
  id: number,
  userId: number,
): Promise<Review> => {
  try {
    const review = await prisma.review.delete({ where: { id, userId } });
    return review;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError('Review not found', 404);
    }
    throw error;
  }
};

export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { id: movieId },
    include: { user: { select: { id: true, name: true } } },
  });
};
