import { body, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Reglas de validación para registro
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El correo es requerido')
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('carrera')
    .trim()
    .notEmpty().withMessage('La carrera es requerida')
    .isLength({ min: 2, max: 100 }).withMessage('La carrera debe tener entre 2 y 100 caracteres'),
  
  handleValidationErrors
];

// Reglas de validación para login
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo es requerido')
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

// Reglas de validación para mensajes de chat
export const messageValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('El mensaje no puede estar vacío')
    .isLength({ min: 1, max: 5000 }).withMessage('El mensaje debe tener entre 1 y 5000 caracteres'),
  
  body('conversationId')
    .optional()
    .isMongoId().withMessage('ID de conversación inválido'),
  
  handleValidationErrors
];
