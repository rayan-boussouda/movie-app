import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/posts.service';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await postService.getPostsByUserId(Number(req.params.id));
  console.log(req);
  console.log('salut');
  if (!posts) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(posts);
};

export const getPostsPaginated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { posts, total, totalPages, hasNext } =
      await postService.getPostsPaginated(
        req.user!.userId,
        Number(req.query.page),
        Number(req.query.size),
      );
    res.status(200).json({ posts, total, totalPages, hasNext });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const post = await postService.createPost(userId, req.body);
    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
