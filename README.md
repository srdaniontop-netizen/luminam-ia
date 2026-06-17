# 🎓 Luminom IA

**Tutor Universitario Inteligente con IA**  
*Desarrollado para estudiantes colombianos - 2026*

---

## 📋 Descripción

**Luminom IA** es un tutor universitario con inteligencia artificial personalizada que ayuda a estudiantes colombianos 24/7 con sus materias. Utiliza Claude (Anthropic) para proporcionar explicaciones claras, resolver ejercicios paso a paso y adaptarse al nivel de cada estudiante.

### ✨ Características Principales

- 🤖 **IA Personalizada**: Prompts adaptados a cada estudiante y su carrera
- 🔐 **Autenticación Segura**: JWT con roles de usuario (estudiante/admin)
- 💬 **Conversaciones Contextuales**: Historial de mensajes guardado en MongoDB
- 📊 **Panel de Administración**: Estadísticas completas y gestión de usuarios
- 🇨🇴 **Contexto Colombiano**: Ejemplos y explicaciones adaptadas a Colombia
- 📱 **Responsive**: Funciona perfectamente en móvil y desktop

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose)
- **Claude API** (Anthropic)
- **JWT** (Autenticación)
- **bcryptjs** (Hash de contraseñas)
- **express-validator** (Validación)
- **helmet** + **cors** (Seguridad)

### Frontend
- **HTML5** + **CSS3** + **JavaScript Vanilla**
- **API Client** personalizado
- **Diseño moderno** con animaciones

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** >= 16.x
- **MongoDB** >= 5.x (local o Atlas)
- **API Key de Anthropic Claude**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/luminam-ia.git
cd luminam-ia
```

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
# Puerto del servidor
PORT=5000

# MongoDB (elige una opción)
# Opción 1: Local
MONGODB_URI=mongodb://localhost:27017/luminom-ia

# Opción 2: MongoDB Atlas (Recomendado)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luminom-ia

# JWT Secret (genera uno único)
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# API Key de Anthropic Claude
# Obtén tu clave en: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-aqui

# Administrador inicial
ADMIN_EMAIL=admin@luminom.ia
ADMIN_PASSWORD=Admin2026Luminom!

# Entorno
NODE_ENV=development
```

### 4. Generar un JWT Secret Seguro (Opcional)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y úsalo como `JWT_SECRET` en tu `.env`.

---

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo

```bash
cd backend
npm run dev
```

El servidor iniciará en `http://localhost:5000`

### Modo Producción

```bash
cd backend
npm start
```

---

## 📱 Acceso a la Aplicación

Una vez el servidor esté corriendo:

- **Landing Page**: http://localhost:5000/
- **Registro/Login**: http://localhost:5000/register.html
- **Panel Tutor**: http://localhost:5000/tutor.html
- **Panel Admin**: http://localhost:5000/admin.html
- **API Health**: http://localhost:5000/api/health

---

## 🔐 Credenciales de Administrador

El sistema crea automáticamente un administrador al iniciar por primera vez:

```
Email: admin@luminom.ia
Contraseña: Admin2026Luminom!
```

**⚠️ IMPORTANTE**: Cambia estas credenciales en el `.env` antes de usar en producción.

---

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener perfil | Sí |
| PUT | `/api/auth/me` | Actualizar perfil | Sí |

### Chat (Tutor IA)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat/message` | Enviar mensaje al tutor | Sí |
| GET | `/api/chat/conversations` | Listar conversaciones | Sí |
| GET | `/api/chat/conversations/:id/messages` | Obtener mensajes | Sí |
| POST | `/api/chat/conversations` | Crear conversación | Sí |
| DELETE | `/api/chat/conversations/:id` | Eliminar conversación | Sí |

### Administración

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Estadísticas del dashboard | Admin |
| GET | `/api/admin/users` | Listar usuarios | Admin |
| GET | `/api/admin/users/:id` | Detalles de usuario | Admin |
| PUT | `/api/admin/users/:id/toggle-status` | Activar/Desactivar usuario | Admin |
| DELETE | `/api/admin/users/:id` | Eliminar usuario | Admin |
| GET | `/api/admin/conversations` | Listar conversaciones | Admin |

---

## 🧪 Ejemplo de Uso de la API

### Registro de Usuario

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "María García",
  "email": "maria@universidad.edu.co",
  "password": "miPassword123",
  "carrera": "Ingeniería de Sistemas"
}
```

### Enviar Mensaje al Tutor

```javascript
POST /api/chat/message
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "message": "¿Puedes explicarme qué es una derivada?",
  "conversationId": null  // null para nueva conversación
}
```

---

## 📂 Estructura del Proyecto

```
luminam-ia/
├── backend/
│   ├── config/
│   │   ├── database.js          # Configuración MongoDB
│   │   └── anthropic.js         # Configuración Claude API
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── chatController.js    # Lógica del tutor IA
│   │   └── adminController.js   # Lógica de administración
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── validator.js         # Validación de datos
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Conversation.js      # Modelo de conversación
│   │   └── Message.js           # Modelo de mensaje
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── chatRoutes.js        # Rutas del chat
│   │   └── adminRoutes.js       # Rutas de admin
│   ├── utils/
│   │   ├── jwt.js               # Utilidades JWT
│   │   ├── prompts.js           # Prompts personalizados IA
│   │   └── setupAdmin.js        # Setup admin inicial
│   ├── server.js                # Servidor principal
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── js/
│   │       └── api.js           # Cliente API JavaScript
│   └── views/
│       ├── index.html           # Landing page
│       ├── register.html        # Registro/Login
│       ├── tutor.html           # Panel del tutor
│       └── admin.html           # Panel admin
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
└── README.md
```

---

## 🎨 Características del Tutor IA

### Adaptación Personalizada

El tutor se adapta a:
- **Nombre del estudiante**: Respuestas personalizadas
- **Carrera universitaria**: Ejemplos relevantes a la carrera
- **Contexto colombiano**: Ejemplos y términos locales
- **Nivel de profundidad**: Empieza simple, profundiza según necesidad

### Materias Soportadas

- ✅ Matemáticas (Cálculo, Álgebra, Estadística)
- ✅ Física (Mecánica, Termodinámica, Cuántica)
- ✅ Programación (Python, Java, JavaScript, C++)
- ✅ Química (Orgánica, Inorgánica, Analítica)
- ✅ Derecho (Constitucional, Civil, Penal)
- ✅ Economía (Micro, Macro, Finanzas)
- ✅ Y muchas más...

---

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **JWT**: Tokens de autenticación con expiración
- ✅ **bcrypt**: Hash de contraseñas (12 rounds)
- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **CORS**: Control de acceso entre orígenes
- ✅ **Rate Limiting**: Prevención de abuso (100 req/15min)
- ✅ **Validación**: express-validator en todos los inputs
- ✅ **Roles**: Sistema de permisos (student/admin)

### Recomendaciones para Producción

1. Cambia `JWT_SECRET` a un valor único y seguro
2. Usa `HTTPS` en producción
3. Configura `NODE_ENV=production`
4. Usa MongoDB Atlas con autenticación
5. Cambia credenciales del admin por defecto
6. Implementa logs estructurados
7. Configura backups automáticos de MongoDB

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución**: Verifica que MongoDB esté corriendo:

```bash
# Si usas MongoDB local
sudo systemctl start mongod

# O verifica tu connection string de Atlas
```

### Error: "Anthropic API Key invalid"

**Solución**: Verifica tu API Key en el archivo `.env`:

1. Ve a https://console.anthropic.com/
2. Crea un nuevo API Key
3. Cópialo a `ANTHROPIC_API_KEY` en `.env`

### Error: "Token inválido"

**Solución**: El token JWT expiró o es inválido. Cierra sesión e inicia sesión nuevamente.

---

## 📈 Próximas Mejoras

- [ ] Sistema de notificaciones en tiempo real (WebSockets)
- [ ] Historial de conversaciones con búsqueda
- [ ] Exportar conversaciones a PDF
- [ ] Sistema de favoritos y notas
- [ ] Modo oscuro/claro
- [ ] Aplicación móvil (React Native)
- [ ] Soporte para imágenes en el chat
- [ ] Integración con Google Classroom

---

## 👥 Contribuir

¿Quieres contribuir? ¡Genial! 

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🤝 Equipo

**Luminom IA** - Desarrollado por Jóvenes creaTIvos  
Ruta Avanzada - 2026

---

## 📞 Soporte

¿Necesitas ayuda? 

- 📧 Email: soporte@luminom.ia
- 💬 Discord: [Únete a nuestra comunidad](#)
- 🐛 Issues: [GitHub Issues](#)

---

## ⭐ ¿Te gusta el proyecto?

¡Dale una estrella ⭐ en GitHub!

---

**Hecho con ❤️ en Colombia 🇨🇴**
