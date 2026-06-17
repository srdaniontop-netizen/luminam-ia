// API: Eliminar chat
const { connectToDatabase } = require('../db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { chatId, userId } = req.query;

    if (!chatId || !userId) {
      return res.status(400).json({ error: 'chatId y userId son requeridos' });
    }

    const { db } = await connectToDatabase();
    const chats = db.collection('chats');

    await chats.deleteOne({ 
      _id: new ObjectId(chatId),
      userId 
    });

    res.status(200).json({ message: 'Chat eliminado' });
  } catch (error) {
    console.error('Error al eliminar chat:', error);
    res.status(500).json({ error: 'Error al eliminar chat' });
  }
};
