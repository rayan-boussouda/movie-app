import { Router } from 'express';
import * as controller from '../controllers/tag.controller';

const router = Router();

router.post('/', controller.createTag);
router.post('/:tagId/posts/:postId', controller.addTagToPost);

export default router;
