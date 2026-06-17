import { verifyToken, extractToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware para proteger rutas (usuario autenticado)
export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No estás autenticado. Por favor inicia sesión.'
      });
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Buscar usuario
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está desactivada. Contacta al administrador.'
      });
    }

    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
    });
  }
};

// Middleware para verificar rol de administrador
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Solo administradores pueden acceder a este recurso.'
    });
  }
};

// Middleware para verificar que el usuario sea el propietario del recurso
export const ownerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a este recurso.'
    });
  }
};
