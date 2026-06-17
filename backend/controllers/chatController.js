import anthropic, { AI_CONFIG } from '../config/anthropic.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { buildSystemPrompt, buildWelcomeMessage, detectSubject } from '../utils/prompts.js';

// @desc    Enviar mensaje al tutor IA
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res) => {
  const startTime = Date.now();

  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    let conversation;
    let messageHistory = [];

    // Si hay conversationId, cargar conversación existente
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: userId
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversación no encontrada.'
        });
      }

      // Obtener historial reciente de mensajes (últimos 20)
      const recentMessages = await Message.getRecentContext(conversationId, 20);
      messageHistory = recentMessages.reverse().map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
    } else {
      // Crear nueva conversación
      const subject = detectSubject(message);
      conversation = await Conversation.create({
        userId: userId,
        title: message.length > 60 ? message.substring(0, 60) + '...' : message,
        subject: subject,
        metadata: {
          userCarrera: req.user.carrera,
          firstQuestion: message
        }
      });
    }

    // Guardar mensaje del usuario
    const userMessage = await Message.create({
      conversationId: conversation._id,
      userId: userId,
      role: 'user',
      content: message
    });

    // Agregar mensaje actual al historial
    messageHistory.push({
      role: 'user',
      content: message
    });

    // Construir prompt del sistema personalizado
    const systemPrompt = buildSystemPrompt(req.user.name, req.user.carrera);

    // Llamar a Claude API
    try {
      const response = await anthropic.messages.create({
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        system: systemPrompt,
        messages: messageHistory
      });

      const aiResponse = response.content[0].text;
      const processingTime = Date.now() - startTime;

      // Guardar respuesta de la IA
      const assistantMessage = await Message.create({
        conversationId: conversation._id,
        userId: userId,
        role: 'assistant',
        content: aiResponse,
        tokens: response.usage.output_tokens,
        model: AI_CONFIG.model,
        metadata: {
          processingTime: processingTime
        }
      });

      // Actualizar estadísticas de la conversación
      conversation.messageCount += 2; // user + assistant
      conversation.lastMessageAt = new Date();
      await conversation.save();

      // Actualizar estadísticas del usuario
      await User.findByIdAndUpdate(userId, {
        $inc: { messageCount: 2 },
        $set: { 
          conversationCount: await Conversation.countDocuments({ userId, isActive: true })
        }
      });

      // Responder
      res.json({
        success: true,
        data: {
          conversation: {
            id: conversation._id,
            title: conversation.title,
            subject: conversation.subject
          },
          userMessage: {
            id: userMessage._id,
            content: userMessage.content,
            createdAt: userMessage.createdAt
          },
          assistantMessage: {
            id: assistantMessage._id,
            content: assistantMessage.content,
            createdAt: assistantMessage.createdAt
          },
          metadata: {
            processingTime: processingTime,
            tokens: response.usage.output_tokens,
            model: AI_CONFIG.model
          }
        }
      });

    } catch (aiError) {
      console.error('Error con Claude API:', aiError);

      // Guardar mensaje de error
      await Message.create({
        conversationId: conversation._id,
        userId: userId,
        role: 'assistant',
        content: 'Lo siento, tuve un problema técnico procesando tu pregunta. Por favor intenta nuevamente en un momento.',
        metadata: {
          error: aiError.message,
          processingTime: Date.now() - startTime
        }
      });

      return res.status(500).json({
        success: false,
        message: 'Error al procesar tu mensaje con el tutor IA.',
        error: process.env.NODE_ENV === 'development' ? aiError.message : 'Error interno del servidor'
      });
    }

  } catch (error) {
    console.error('Error en sendMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener conversaciones del usuario
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id,
      isActive: true
    })
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .select('title subject messageCount lastMessageAt createdAt');

    res.json({
      success: true,
      data: {
        conversations,
        total: conversations.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las conversaciones.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener mensajes de una conversación
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
export const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la conversación pertenezca al usuario
    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada.'
      });
    }

    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .select('role content createdAt tokens metadata');

    res.json({
      success: true,
      data: {
        conversation: {
          id: conversation._id,
          title: conversation.title,
          subject: conversation.subject,
          messageCount: conversation.messageCount,
          createdAt: conversation.createdAt
        },
        messages
      }
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los mensajes.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Eliminar una conversación
// @route   DELETE /api/chat/conversations/:id
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada.'
      });
    }

    // Soft delete
    conversation.isActive = false;
    await conversation.save();

    res.json({
      success: true,
      message: 'Conversación eliminada correctamente.'
    });
  } catch (error) {
    console.error('Error eliminando conversación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la conversación.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Crear nueva conversación (opcional - para UI)
// @route   POST /api/chat/conversations
// @access  Private
export const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: 'Nueva conversación',
      metadata: {
        userCarrera: req.user.carrera
      }
    });

    res.status(201).json({
      success: true,
      data: {
        conversation: {
          id: conversation._id,
          title: conversation.title,
          createdAt: conversation.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creando conversación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la conversación.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
