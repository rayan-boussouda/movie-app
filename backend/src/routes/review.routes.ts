import { Router } from 'express';
import { auth } from '../midellewares/auth';
import { validate } from '../midellewares/validate';
import {
  createReviewSchema,
  updateReviewSchema,
  getMovieReviewsSchema,
} from '../schemas/review.schemas';
import { idParamSchema } from '../schemas/common.schemas';
import * as controller from '../controllers/review.controller';

const router = Router();

router.use(auth);

router.post('/', validate(createReviewSchema), controller.createReview);
router.patch('/:id', validate(updateReviewSchema), controller.updateReview);
router.delete('/:id', validate(idParamSchema), controller.deleteReview);
router.get('/', validate(getMovieReviewsSchema), controller.getMovieReviews);

export default router;
