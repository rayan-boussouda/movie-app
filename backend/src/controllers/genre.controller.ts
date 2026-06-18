import { NextFunction, Request, Response } from 'express';
import * as genreService from '../services/genre.service';

export const getAllGenres = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genres = await genreService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
};

export const getGenreById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await genreService.getGenreById({
      id: Number(req.params.id),
    });
    res.status(200).json(genre);
  } catch (error) {
    next(error);
  }
};

export const createGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await genreService.createGenre(req.body);
    res.status(201).json(genre);
  } catch (error) {
    next(error);
  }
};

export const updateGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await genreService.updateGenre(
      { id: Number(req.params.id) },
      req.body,
    );
    res.status(200).json(genre);
  } catch (error) {
    next(error);
  }
};

export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await genreService.deleteService({
      id: Number(req.params.id),
    });
    res.status(200).json(genre);
  } catch (error) {
    next(error);
  }
};
