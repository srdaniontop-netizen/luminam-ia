import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  deleteUser,
  getAllConversations,
  createAdmin
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(protect);
router.use(adminOnly);

// Dashboard y estadísticas
router.get('/stats', getDashboardStats);

// Gestión de usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Gestión de conversaciones
router.get('/conversations', getAllConversations);

// Crear nuevo admin (solo para setup inicial o superadmin)
router.post('/create-admin', createAdmin);

export default router;
