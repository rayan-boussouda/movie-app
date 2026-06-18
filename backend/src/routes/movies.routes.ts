import { Router } from 'express';
import { auth, requireRole } from '../midellewares/auth';
import { validate } from '../midellewares/validate';
import {
  createMovieSchema,
  getMoviesByPageSchema,
  searchMovieSchema,
  updateMovieSchema,
} from '../schemas/movie.schemas';
import * as controller from '../controllers/movie.controller';
import { idParamSchema } from '../schemas/common.schemas';

const router = Router();

router.use(auth);
router.post(
  '/',
  requireRole('ADMIN'),
  validate(createMovieSchema),
  controller.createMovie,
);
router.patch(
  '/:id',
  requireRole('ADMIN'),
  validate(updateMovieSchema),
  controller.updateMovie,
);
router.delete(
  '/:id',
  requireRole('ADMIN'),
  validate(idParamSchema),
  controller.deleteMovie,
);
router.get('/', validate(getMoviesByPageSchema), controller.getMoviesByPage);
router.get('/search', validate(searchMovieSchema), controller.searchMovies);
router.get('/:id', validate(idParamSchema), controller.getById);

export default router;
