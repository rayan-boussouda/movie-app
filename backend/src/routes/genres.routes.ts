import { Router } from 'express';
import { auth, requireRole } from '../midellewares/auth';
import * as genreController from '../controllers/genre.controller';
import { validate } from '../midellewares/validate';
import { createGenreSchema, updateGenreSchema } from '../schemas/genre.schemas';
import { idParamSchema } from '../schemas/common.schemas';
const router = Router();

router.use(auth);
router.get('/', genreController.getAllGenres);
router.get('/:id', validate(idParamSchema), genreController.getGenreById);
router.post(
  '/',
  requireRole('ADMIN'),
  validate(createGenreSchema),
  genreController.createGenre,
);
router.patch(
  '/:id',
  requireRole('ADMIN'),
  validate(updateGenreSchema),
  genreController.updateGenre,
);
router.delete('/:id', validate(idParamSchema), genreController.deleteGenre);
export default router;
