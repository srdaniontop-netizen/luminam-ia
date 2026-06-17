import express from 'express';
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  deleteConversation,
  createConversation
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { messageValidation } from '../middleware/validator.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Enviar mensaje al tutor IA
router.post('/message', messageValidation, sendMessage);

// Gestión de conversaciones
router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getConversationMessages);
router.delete('/conversations/:id', deleteConversation);

export default router;
