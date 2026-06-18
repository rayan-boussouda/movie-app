import { Router } from 'express';
import * as controller from '../controllers/user.controller';

const router = Router();

router.post('/', controller.createUser);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;
