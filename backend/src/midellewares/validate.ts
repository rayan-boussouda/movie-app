import { NextFunction, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { ZodError, ZodType } from 'zod';
import { AppError } from './errorHandler';

interface ParsedRequest {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export const validate = <T extends ParsedRequest>(schema: ZodType<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = {
        body: req.body,
        params: req.params,
        query: req.query,
      };
      const parsed = schema.parse(result);
      req.body = parsed.body ?? {};
      req.params = (parsed.params ?? {}) as Record<string, string>;
      req.query = (parsed.query ?? {}) as ParsedQs;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues);
        const messages = error.issues.map((i) => i.message);
        next(new AppError(messages.join(', '), 400));
      } else {
        next(error);
      }
    }
  };
};
