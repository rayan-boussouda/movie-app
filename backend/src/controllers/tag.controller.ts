import { NextFunction, Request, Response } from 'express';
import * as tagsService from '../services/tags.service';

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tag = await tagsService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

export const addTagToPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postTag = await tagsService.addTagToPost(
      Number(req.params.postId),
      Number(req.params.tagId),
    );
    res.status(201).json(postTag);
  } catch (error) {
    next(error);
  }
};
