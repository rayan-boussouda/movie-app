import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { auth } from '../midellewares/auth';
import { uploadMiddleware } from '../midellewares/upload';

const router = Router();

router.post('/', controller.createUser);
router.get('/', controller.getUsers);

router.patch(
  '/me/avatar',
  auth,
  uploadMiddleware.single('avatar'),
  controller.uploadAvatar,
);

router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;
