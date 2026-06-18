import { Router } from 'express';
import { auth } from '../midellewares/auth';
import { validate } from '../midellewares/validate';
import {
  createRatingSchema,
  updateRatingSchema,
  getMovieRatingsSchema,
} from '../schemas/rating.schemas';
import { idParamSchema } from '../schemas/common.schemas';
import * as controller from '../controllers/rating.controller';

const router = Router();

router.use(auth);

router.post('/', validate(createRatingSchema), controller.createRating);
router.patch('/:id', validate(updateRatingSchema), controller.updateRating);
router.delete('/:id', validate(idParamSchema), controller.deleteRating);
router.get('/', validate(getMovieRatingsSchema), controller.getMovieRatings);

export default router;
