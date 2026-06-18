import { Prisma, Genre } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateGenreSchema, UpdateGenreSchema } from '../schemas/genre.schemas';
import { AppError } from '../midellewares/errorHandler';
import { IdParamSchema } from '../schemas/common.schemas';

export const createGenre = async (data: CreateGenreSchema) => {
  try {
    const genre = await prisma.genre.create({ data });
    return genre;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError('Genre Already Exist', 409);
    }
    throw error;
  }
};

export const updateGenre = async (
  { id }: IdParamSchema,
  data: UpdateGenreSchema,
) => {
  try {
    const genre = await prisma.genre.update({
      where: { id },
      data,
    });
    return genre;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new AppError('Genre not found', 404);
        case 'P2002':
          throw new AppError('Genre Already Exist', 409);
      }
    }
    throw error;
  }
};

export const getGenreById = async ({ id }: IdParamSchema): Promise<Genre> => {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw new AppError('Genre not found', 404);
  return genre;
};

export const getAllGenres = async (): Promise<Genre[]> => {
  return prisma.genre.findMany({ orderBy: { name: 'asc' } });
};

export const deleteService = async ({ id }: IdParamSchema): Promise<Genre> => {
  try {
    const genre = await prisma.genre.delete({ where: { id } });
    return genre;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Genre not found', 404);
    }
    throw error;
  }
};
