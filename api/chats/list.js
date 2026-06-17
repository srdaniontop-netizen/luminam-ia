// API: Listar chats de un usuario
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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' });
    }

    const { db } = await connectToDatabase();
    const chats = db.collection('chats');

    const userChats = await chats
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    // Convertir ObjectId a string
    const chatsResponse = userChats.map(chat => ({
      id: chat._id.toString(),
      userId: chat.userId,
      title: chat.title,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    res.status(200).json({ chats: chatsResponse });
  } catch (error) {
    console.error('Error al listar chats:', error);
    res.status(500).json({ error: 'Error al obtener chats' });
  }
};
