import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

// @desc    Obtener estadísticas del dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Estadísticas generales
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeUsers = await User.countDocuments({ role: 'student', isActive: true });
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments({ role: 'user' });

    // Usuarios registrados en los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLastWeek = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: sevenDaysAgo }
    });

    // Mensajes en los últimos 7 días
    const messagesLastWeek = await Message.countDocuments({
      role: 'user',
      createdAt: { $gte: sevenDaysAgo }
    });

    // Usuarios más activos (top 10)
    const topUsers = await User.find({ role: 'student' })
      .sort({ messageCount: -1 })
      .limit(10)
      .select('name email carrera messageCount conversationCount lastLogin');

    // Materias más populares (por conversaciones)
    const popularSubjects = await Conversation.aggregate([
      { $match: { subject: { $ne: null } } },
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Actividad por día (últimos 7 días)
    const dailyActivity = await Message.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          messages: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: '$_id',
          messages: 1,
          users: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Promedio de mensajes por conversación
    const avgMessagesPerConversation = totalConversations > 0
      ? Math.round(totalMessages / totalConversations)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalConversations,
          totalMessages,
          newUsersLastWeek,
          messagesLastWeek,
          avgMessagesPerConversation
        },
        topUsers,
        popularSubjects: popularSubjects.map(s => ({
          subject: s._id,
          count: s.count
        })),
        dailyActivity: dailyActivity.map(d => ({
          date: d.date,
          messages: d.messages,
          users: d.users
        }))
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = 'student' } = req.query;

    const query = { role };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { carrera: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name email carrera isActive messageCount conversationCount createdAt lastLogin');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener detalles de un usuario
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    // Obtener conversaciones del usuario
    const conversations = await Conversation.find({ userId: user._id })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .select('title subject messageCount lastMessageAt createdAt');

    // Obtener actividad reciente
    const recentMessages = await Message.find({ userId: user._id, role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('content conversationId createdAt')
      .populate('conversationId', 'title');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carrera: user.carrera,
          role: user.role,
          isActive: user.isActive,
          messageCount: user.messageCount,
          conversationCount: user.conversationCount,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        conversations,
        recentMessages
      }
    });
  } catch (error) {
    console.error('Error obteniendo detalles del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles del usuario.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Activar/Desactivar usuario
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No puedes desactivar cuentas de administrador.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente.`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Error cambiando estado del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Eliminar usuario (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar cuentas de administrador.'
      });
    }

    // Soft delete: desactivar usuario y sus conversaciones
    user.isActive = false;
    await user.save();

    await Conversation.updateMany(
      { userId: user._id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente.'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener todas las conversaciones (para monitoreo)
// @route   GET /api/admin/conversations
// @access  Private/Admin
export const getAllConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20, subject = '' } = req.query;

    const query = {};
    if (subject) {
      query.subject = subject;
    }

    const conversations = await Conversation.find(query)
      .populate('userId', 'name email carrera')
      .sort({ lastMessageAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title subject messageCount lastMessageAt createdAt');

    const total = await Conversation.countDocuments(query);

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
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

// @desc    Crear usuario administrador
// @route   POST /api/admin/create-admin
// @access  Private/Admin (solo superadmin o primer setup)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este correo ya está registrado.'
      });
    }

    // Crear admin
    const admin = await User.create({
      name,
      email,
      password,
      carrera: 'Administrador',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente.',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el administrador.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
