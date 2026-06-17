// API: Estadísticas para admin
const { connectToDatabase } = require('../db');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email } = req.query;

    // Solo el admin puede acceder
    if (email !== 'admin@luminom.com') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { db } = await connectToDatabase();
    const users = db.collection('users');
    const chats = db.collection('chats');

    // Total de usuarios
    const totalUsers = await users.countDocuments();

    // Total de conversaciones
    const totalChats = await chats.countDocuments();

    // Total de preguntas (contar mensajes de usuario en todos los chats)
    const allChats = await chats.find({}).toArray();
    const totalQuestions = allChats.reduce((sum, chat) => {
      return sum + chat.messages.filter(m => m.role === 'user').length;
    }, 0);

    // Usuarios activos hoy (últimas 24 horas)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activeUsers = await users.countDocuments({
      lastLogin: { $gte: yesterday }
    });

    // Lista de todos los usuarios
    const allUsers = await users
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    const usersResponse = allUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      carrera: user.carrera,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }));

    // Últimas 10 conversaciones
    const recentChats = await chats
      .find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray();

    const chatsResponse = recentChats.map(chat => ({
      id: chat._id.toString(),
      userId: chat.userId,
      title: chat.title,
      messagesCount: chat.messages.length,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    // Distribución por carreras
    const carrerasDistribution = await users.aggregate([
      { $group: { _id: '$carrera', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    res.status(200).json({
      totalUsers,
      totalChats,
      totalQuestions,
      activeUsers,
      users: usersResponse,
      recentChats: chatsResponse,
      carrerasDistribution,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
