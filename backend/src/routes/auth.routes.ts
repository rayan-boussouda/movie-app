import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { validate } from '../midellewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

export default router;
