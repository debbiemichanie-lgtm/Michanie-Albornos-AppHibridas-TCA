import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import { register, login, me } from '../controllers/UsuarioController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('nombre requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('mínimo 6 caracteres')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('email inválido'),
    body('password').notEmpty().withMessage('password requerido')
  ],
  validate,
  login
);

router.get('/me', auth, me);

export default router;
