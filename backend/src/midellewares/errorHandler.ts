import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaMessages: Record<string, { status: number; message: string }> = {
      P2002: { status: 409, message: 'Resource already exists' },
      P2025: { status: 404, message: 'Resource not found' },
      P2003: { status: 409, message: 'Cannot delete: related records exist' },
    };
    const mapped = prismaMessages[err.code];
    if (mapped) {
      return res.status(mapped.status).json({ error: mapped.message });
    }
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
