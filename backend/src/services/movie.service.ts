import prisma from '../config/prisma';
import { Movie } from '@prisma/client';
import {
  CreateMovieSchema,
  SearchMovieSchema,
  UpdateMovieSchema,
} from '../schemas/movie.schemas';
import { AppError } from '../midellewares/errorHandler';
import { getCache, invalidateCache, setCache } from './cache.service';

const CACHE_TTL = Number(process.env.CACHE_TTL ?? 6000);

export const buildMovieCacheKey = (
  page: number,
  limit: number,
  sortBy: 'title' | 'releaseYear',
  order: 'asc' | 'desc',
  genreId?: number,
) => {
  return `movies:page:${page}:limit:${limit}:sortBy:${sortBy}:order:${order}${genreId ? `:genre:${genreId}` : ''}`;
};

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
  await invalidateCache('movies:*');
  return movie;
};

export const deleteMovie = async (movieId: number): Promise<Movie> => {
  const movieToDelete = await prisma.movie.delete({
    where: { id: movieId },
  });
  await invalidateCache('movies:*');
  return movieToDelete;
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
  const cachedKey = buildMovieCacheKey(page, limit, sortBy, order, genreId);
  const cached = await getCache<{
    movies: Movie[];
    total: number;
    totalPages: number;
    hasNext: boolean;
  }>(cachedKey);
  if (cached) return cached;
  const where = genreId ? { genres: { some: { id: genreId } } } : {};

  const [movies, total] = await prisma.$transaction([
    prisma.movie.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
      include: { genres: true, ratings: { select: { id: true, userId: true, value: true } } },
    }),
    prisma.movie.count({ where }),
  ]);

  const result = {
    movies,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
  };

  setCache(cachedKey, result, CACHE_TTL);
  return result;
};
