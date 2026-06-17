import express from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validator.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Rutas protegidas (requieren autenticación)
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
