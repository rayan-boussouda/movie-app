import prisma from '../config/prisma';
import { Movie, Prisma } from '@prisma/client';
import {
  CreateMovieSchema,
  SearchMovieSchema,
  UpdateMovieSchema,
} from '../schemas/movie.schemas';
import { AppError } from '../midellewares/errorHandler';

export const createMovie = async (data: CreateMovieSchema): Promise<Movie> => {
  const { genres, ...rest } = data;

  const movie = await prisma.movie.create({
    data: {
      ...rest,
      releaseYear: new Date(rest.releaseYear),
      ...(genres && {
        genres: { connect: genres.map(({ genreId }) => ({ id: genreId })) },
      }),
    },
    include: { genres: true },
  });

  return movie;
};

export const updateMovie = async (
  movieId: number,
  data: UpdateMovieSchema,
): Promise<Movie> => {
  const { genres, ...rest } = data;
  const movie = await prisma.movie.update({
    where: { id: movieId },
    data: {
      ...rest,
      ...(rest.releaseYear && { releaseYear: new Date(rest.releaseYear) }),
      ...(genres && {
        genres: { set: genres.map(({ genreId }) => ({ id: genreId })) },
      }),
    },
    include: { genres: true },
  });
  return movie;
};

export const deleteMovie = async (movieId: number): Promise<Movie> => {
  try {
    const movieToDelete = await prisma.movie.delete({
      where: { id: movieId },
    });
    return movieToDelete;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Movie not found', 404);
    }
    throw error;
  }
};

export const getMovieById = async (movieId: number): Promise<Movie> => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { genres: true },
  });
  if (!movie) throw new AppError('Movie not found', 404);
  return movie;
};

export const searchMovies = async (title: string): Promise<Movie[]> => {
  const movies = await prisma.movie.findMany({
    where: { title: { contains: title, mode: 'insensitive' } },
  });
  return movies;
};

export const getMoviesByPage = async (
  page: number,
  limit: number,
  sortBy: 'title' | 'releaseYear',
  order: 'asc' | 'desc',
  genreId?: number,
): Promise<{
  movies: Movie[];
  total: number;
  totalPages: number;
  hasNext: boolean;
}> => {
  const where = genreId ? { genres: { some: { id: genreId } } } : {};

  const [movies, total] = await prisma.$transaction([
    prisma.movie.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.movie.count({ where }),
  ]);
  return {
    movies,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
  };
};
