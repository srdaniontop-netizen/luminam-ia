import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, carrera } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este correo ya está registrado. Intenta iniciar sesión.'
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      name,
      email,
      password,
      carrera,
      role: 'student'
    });

    // Generar token
    const token = generateToken(user._id, user.role);

    // Actualizar última sesión
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Cuenta creada exitosamente. ¡Bienvenido a Luminom IA!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carrera: user.carrera,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la cuenta. Intenta nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está desactivada. Contacta al administrador.'
      });
    }

    // Generar token
    const token = generateToken(user._id, user.role);

    // Actualizar última sesión
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: `¡Bienvenido de nuevo, ${user.name.split(' ')[0]}!`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carrera: user.carrera,
          role: user.role,
          conversationCount: user.conversationCount,
          messageCount: user.messageCount
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión. Intenta nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carrera: user.carrera,
          role: user.role,
          conversationCount: user.conversationCount,
          messageCount: user.messageCount,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
  try {
    const { name, carrera } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (carrera) user.carrera = carrera;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carrera: user.carrera,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
