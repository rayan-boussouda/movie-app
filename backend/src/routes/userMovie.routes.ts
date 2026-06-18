import { Router } from 'express';
import { auth } from '../midellewares/auth';
import { validate } from '../midellewares/validate';
import {
  addMovieSchema,
  updateStatusSchema,
  getUserMoviesSchema,
} from '../schemas/userMovie.schemas';
import { idParamSchema } from '../schemas/common.schemas';
import * as controller from '../controllers/userMovie.controller';

const router = Router();

router.use(auth);

router.post('/', validate(addMovieSchema), controller.addMovieToList);
router.patch(
  '/:id',
  validate(updateStatusSchema),
  controller.updateMovieStatus,
);
router.delete('/:id', validate(idParamSchema), controller.removeFromList);
router.get('/', validate(getUserMoviesSchema), controller.getUserMovies);

export default router;
