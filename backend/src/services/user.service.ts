import prisma from "../config/prisma";
import type { User, Prisma } from "@prisma/client"; // ✅ import types properly

// Create a new user
export const createUser = (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

// Get all users
export const getAllUsers = (): Promise<User[]> => {
  return prisma.user.findMany();
};

// Get a user by ID
export const getUserById = (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Update a user
export const updateUser = (
  id: number,
  data: Prisma.UserUpdateInput,
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// Delete a user
export const deleteUser = (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};
