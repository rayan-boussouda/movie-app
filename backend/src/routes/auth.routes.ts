import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { validate } from '../midellewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);

export default router;
