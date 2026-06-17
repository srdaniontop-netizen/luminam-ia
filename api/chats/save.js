// API: Guardar o actualizar chat
const { connectToDatabase } = require('../db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, chatId, title, messages } = req.body;

    if (!userId || !messages) {
      return res.status(400).json({ error: 'userId y messages son requeridos' });
    }

    const { db } = await connectToDatabase();
    const chats = db.collection('chats');

    const now = new Date();

    if (chatId) {
      // Actualizar chat existente
      await chats.updateOne(
        { _id: new ObjectId(chatId), userId },
        {
          $set: {
            title,
            messages,
            updatedAt: now,
          },
        }
      );

      res.status(200).json({ chatId, message: 'Chat actualizado' });
    } else {
      // Crear nuevo chat
      const newChat = {
        userId,
        title,
        messages,
        createdAt: now,
        updatedAt: now,
      };

      const result = await chats.insertOne(newChat);

      res.status(201).json({ 
        chatId: result.insertedId.toString(), 
        message: 'Chat creado' 
      });
    }
  } catch (error) {
    console.error('Error al guardar chat:', error);
    res.status(500).json({ error: 'Error al guardar chat' });
  }
};
