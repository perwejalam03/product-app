import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser, validateLogin } from '../middlewares/user.validator';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateUser, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.get('/profile', authenticateToken, UserController.getProfile);

export default router;

