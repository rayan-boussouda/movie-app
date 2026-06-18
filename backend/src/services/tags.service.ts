import { Tag, Prisma, PostTag } from '@prisma/client';
import prisma from '../config/prisma';

export const createTag = async (
  data: Prisma.TagUncheckedCreateInput,
): Promise<Tag> => {
  const tag = await prisma.tag.create({ data });
  return tag;
};

export const addTagToPost = async (
  tagId: number,
  postId: number,
): Promise<PostTag> => {
  const postTag = await prisma.postTag.create({ data: { tagId, postId } });
  return postTag;
};
