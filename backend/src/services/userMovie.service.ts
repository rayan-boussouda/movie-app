import { Prisma, UserMovie, UserMovieStatus } from '@prisma/client';
import prisma from '../config/prisma';
import {
  AddMovieSchema,
  UpdateStatusSchema,
} from '../schemas/userMovie.schemas';
import { AppError } from '../midellewares/errorHandler';

export const addMovieToList = async (
  userId: number,
  data: AddMovieSchema,
): Promise<UserMovie> => {
  try {
    const userMovie = await prisma.userMovie.create({
      data: { userId, movieId: data.movieId, status: data.status },
    });
    return userMovie;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('Movie already in list with this status', 409);
        case 'P2003':
          throw new AppError('Movie not found', 404);
      }
    }
    throw error;
  }
};

export const updateMovieStatus = async (
  id: number,
  userId: number,
  data: UpdateStatusSchema,
): Promise<UserMovie> => {
  try {
    const userMovie = await prisma.userMovie.update({
      where: { id, userId },
      data: { status: data.status },
    });
    return userMovie;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError('Entry not found', 404);
    }
    throw error;
  }
};

export const removeFromList = async (
  id: number,
  userId: number,
): Promise<UserMovie> => {
  try {
    const userMovie = await prisma.userMovie.delete({
      where: { id, userId },
    });
    return userMovie;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Entry not found', 404);
    }
    throw error;
  }
};

export const getUserMovies = async (
  userId: number,
  status?: UserMovieStatus,
): Promise<UserMovie[]> => {
  const userMovies = await prisma.userMovie.findMany({
    where: { userId, ...(status && { status }) },
    include: { movie: true },
  });
  return userMovies;
};
