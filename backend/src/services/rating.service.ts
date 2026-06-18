import { Prisma, Rating } from '@prisma/client';
import prisma from '../config/prisma';
import {
  CreateRatingSchema,
  UpdateRatingSchema,
} from '../schemas/rating.schemas';
import { AppError } from '../midellewares/errorHandler';

export const createRating = async (
  userId: number,
  data: CreateRatingSchema,
): Promise<Rating> => {
  try {
    return await prisma.rating.create({
      data: { userId, movieId: data.movieId, value: data.value },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new AppError('You already rated this movie', 409);
      if (error.code === 'P2025') throw new AppError('Movie not found', 404);
    }
    throw error;
  }
};

export const updateRating = async (
  id: number,
  userId: number,
  data: UpdateRatingSchema,
): Promise<Rating> => {
  try {
    return await prisma.rating.update({
      where: { id, userId },
      data: { value: data.value },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError('Rating not found', 404);
    }
    throw error;
  }
};

export const deleteRating = async (
  id: number,
  userId: number,
): Promise<Rating> => {
  try {
    return await prisma.rating.delete({
      where: { id, userId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError('Rating not found', 404);
    }
    throw error;
  }
};

export const getMovieRatings = async (movieId: number): Promise<Rating[]> => {
  return prisma.rating.findMany({
    where: { movieId },
    include: { user: { select: { id: true, name: true } } },
  });
};
