import { Router } from 'express';
import { body, param, query } from 'express-validator';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { list, getById, create, update, remove } from '../controllers/EspecialistaController.js';

const router = Router();

// Lista + filtros + búsqueda
router.get(
  '/',
  [
    query('modality').optional().isIn(['presencial', 'virtual', 'mixta']),
    query('insurance').optional().isIn(['prepaga', 'particular', 'ambas']),
    query('specialty').optional().isString(),
    query('city').optional().isString(),
    query('province').optional().isString(),
    query('q').optional().isString()
  ],
  validate,
  list
);

// Obtener por id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('id inválido')],
  validate,
  getById
);

// Crear (protegido)
router.post(
  '/',
  auth,
  [
    body('nombre').notEmpty(),
    body('profesion').isIn(['psicologa', 'nutricionista', 'psiquiatra', 'ginecologa', 'medico_clinico', 'otro']),
    body('modality').isIn(['presencial', 'virtual', 'mixta']),
    body('insurance').isIn(['prepaga', 'particular', 'ambas']),
    body('specialties').isArray().withMessage('specialties debe ser array'),
    body('city').notEmpty(),
    body('province').notEmpty(),
    body('email').optional().isEmail().withMessage('email inválido')
  ],
  validate,
  create
);

// Actualizar (protegido)
router.put(
  '/:id',
  auth,
  [param('id').isMongoId().withMessage('id inválido')],
  validate,
  update
);

// Eliminar (protegido)
router.delete(
  '/:id',
  auth,
  [param('id').isMongoId().withMessage('id inválido')],
  validate,
  remove
);

export default router;

