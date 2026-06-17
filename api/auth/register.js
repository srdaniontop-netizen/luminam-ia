// API: Registro de usuarios
const { connectToDatabase } = require('../db');
const bcrypt = require('bcryptjs');

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
    const { name, email, password, carrera } = req.body;

    if (!name || !email || !password || !carrera) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Verificar si el email ya existe
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      carrera,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Retornar usuario sin contraseña
    const userResponse = {
      userId: result.insertedId.toString(),
      name,
      email: email.toLowerCase(),
      carrera,
    };

    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
