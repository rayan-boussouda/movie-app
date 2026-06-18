import { NextFunction, Request, Response } from 'express';
import * as movieService from '../services/movie.service';
import {
  GetMoviesByPageSchema,
  SearchMovieSchema,
} from '../schemas/movie.schemas';
export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await movieService.updateMovie(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movieDeleted = await movieService.deleteMovie(Number(req.params.id));
    res.status(200).json(movieDeleted);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await movieService.getMovieById(Number(req.params.id));
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const searchMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.query as SearchMovieSchema;
    const movies = await movieService.searchMovies(title);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMoviesByPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //unknown first "erases" the type to "could be anything", then as GetMoviesByPageSchema says "treat it as this"
    const { page, limit, sortBy, order, genreId } =
      req.query as unknown as GetMoviesByPageSchema;
    const { movies, total, totalPages, hasNext } =
      await movieService.getMoviesByPage(page, limit, sortBy, order, genreId);
    res.status(200).json({ movies, total, totalPages, hasNext });
  } catch (error) {
    next(error);
  }
};
