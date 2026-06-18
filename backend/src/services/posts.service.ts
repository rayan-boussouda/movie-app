import prisma from '../config/prisma';
import type { User, Prisma, Post } from '@prisma/client';
import { CreatePostInput } from '../schemas/post.schema';

export const getPostsByUserId = async (id: number): Promise<Post[]> => {
  const posts = await prisma.post.findMany({
    where: { userId: id },
  });
  return posts;
};

export const createPost = async (
  userId: number,
  data: CreatePostInput,
): Promise<Post> => {
  const { tags, ...rest } = data;

  const post = await prisma.post.create({
    data: {
      ...rest,
      userId,
      ...(tags && {
        tags: { createMany: { data: tags } },
      }),
    },
  });

  return post;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const posts = await prisma.post.findMany();
  return posts;
};

export const getPostsPaginated = async (
  id: number,
  page: number,
  size: number,
): Promise<{
  posts: Post[];
  total: number;
  totalPages: number;
  hasNext: boolean;
}> => {
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { userId: id },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.post.count({ where: { userId: id } }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / size),
    hasNext: page < Math.ceil(total / size),
  };
};
