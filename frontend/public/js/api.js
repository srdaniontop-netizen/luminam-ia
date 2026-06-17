// API Client para Luminom IA
// Maneja todas las llamadas al backend con autenticación JWT

const API_BASE_URL = window.location.origin + '/api';

// Utility: Obtener token del localStorage
const getToken = () => localStorage.getItem('luminom_token');

// Utility: Guardar token
const saveToken = (token) => localStorage.setItem('luminom_token', token);

// Utility: Eliminar token
const removeToken = () => localStorage.removeItem('luminom_token');

// Utility: Guardar sesión del usuario
const saveSession = (user) => localStorage.setItem('luminom_session', JSON.stringify(user));

// Utility: Obtener sesión
const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem('luminom_session'));
  } catch {
    return null;
  }
};

// Utility: Eliminar sesión
const removeSession = () => localStorage.removeItem('luminom_session');

// Utility: Hacer request con fetch
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================

const AuthAPI = {
  // Registrar nuevo usuario
  register: async (name, email, password, carrera) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, carrera }),
    });

    if (data.success) {
      saveToken(data.data.token);
      saveSession(data.data.user);
    }

    return data;
  },

  // Login
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success) {
      saveToken(data.data.token);
      saveSession(data.data.user);
    }

    return data;
  },

  // Obtener perfil actual
  getMe: async () => {
    const data = await apiRequest('/auth/me');
    if (data.success) {
      saveSession(data.data.user);
    }
    return data;
  },

  // Actualizar perfil
  updateMe: async (updates) => {
    const data = await apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (data.success) {
      saveSession(data.data.user);
    }
    return data;
  },

  // Logout
  logout: () => {
    removeToken();
    removeSession();
    window.location.href = '/';
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!getToken() && !!getSession();
  },

  // Obtener sesión actual
  getSession: getSession,
};

// ============================================
// CHAT API
// ============================================

const ChatAPI = {
  // Enviar mensaje al tutor IA
  sendMessage: async (message, conversationId = null) => {
    return await apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  },

  // Obtener conversaciones del usuario
  getConversations: async () => {
    return await apiRequest('/chat/conversations');
  },

  // Obtener mensajes de una conversación
  getConversationMessages: async (conversationId) => {
    return await apiRequest(`/chat/conversations/${conversationId}/messages`);
  },

  // Crear nueva conversación
  createConversation: async () => {
    return await apiRequest('/chat/conversations', {
      method: 'POST',
    });
  },

  // Eliminar conversación
  deleteConversation: async (conversationId) => {
    return await apiRequest(`/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ADMIN API
// ============================================

const AdminAPI = {
  // Obtener estadísticas del dashboard
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },

  // Obtener todos los usuarios
  getUsers: async (page = 1, limit = 20, search = '') => {
    const params = new URLSearchParams({ page, limit, search });
    return await apiRequest(`/admin/users?${params}`);
  },

  // Obtener detalles de un usuario
  getUserDetails: async (userId) => {
    return await apiRequest(`/admin/users/${userId}`);
  },

  // Activar/Desactivar usuario
  toggleUserStatus: async (userId) => {
    return await apiRequest(`/admin/users/${userId}/toggle-status`, {
      method: 'PUT',
    });
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Obtener todas las conversaciones
  getConversations: async (page = 1, limit = 20, subject = '') => {
    const params = new URLSearchParams({ page, limit, subject });
    return await apiRequest(`/admin/conversations?${params}`);
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
  // Formatear fecha
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formatear hora
  formatTime: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Formatear fecha y hora
  formatDateTime: (dateString) => {
    return `${Utils.formatDate(dateString)} a las ${Utils.formatTime(dateString)}`;
  },

  // Mostrar notificación de error
  showError: (message) => {
    // Implementar según tu UI (toast, alert, etc.)
    console.error(message);
    alert(message);
  },

  // Mostrar notificación de éxito
  showSuccess: (message) => {
    // Implementar según tu UI (toast, alert, etc.)
    console.log(message);
  },

  // Redirigir si no está autenticado
  requireAuth: () => {
    if (!AuthAPI.isAuthenticated()) {
      window.location.href = '/register.html?next=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  },

  // Redirigir si ya está autenticado
  redirectIfAuthenticated: () => {
    if (AuthAPI.isAuthenticated()) {
      window.location.href = '/tutor.html';
      return true;
    }
    return false;
  },
};

// Exportar APIs (disponible globalmente)
window.LuminomAPI = {
  Auth: AuthAPI,
  Chat: ChatAPI,
  Admin: AdminAPI,
  Utils: Utils,
};
