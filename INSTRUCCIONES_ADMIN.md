# 🔐 INSTRUCCIONES PARA ACCEDER AL PANEL ADMIN

## ⚠️ IMPORTANTE: Crear Cuenta de Administrador

Para acceder al panel admin, necesitas crear una cuenta con el email especial de administrador.

### Paso 1: Ir al Registro

Ve a: **https://srdaniontop-netizen.github.io/luminam-ia/login.html?tab=register**

### Paso 2: Registrarse con el Email Admin

Completa el formulario con estos datos:

```
Nombre: Admin Luminom
Email: admin@luminom.com  ← IMPORTANTE: Debe ser este email exacto
Carrera: (cualquiera)
Contraseña: [tu contraseña segura]
```

### Paso 3: Acceder al Panel Admin

Después de registrarte, ve a:

**https://srdaniontop-netizen.github.io/luminam-ia/admin.html**

---

## 🔑 Credenciales Admin

**Email Admin**: `admin@luminom.com`

⚠️ **Nota**: Solo cuentas con este email exacto pueden acceder al panel admin.

---

## 📊 Funcionalidades del Panel Admin

### Estadísticas en Tiempo Real:
- ✅ **Total de usuarios** registrados
- ✅ **Conversaciones** creadas
- ✅ **Preguntas respondidas** por la IA
- ✅ **Usuarios activos** en las últimas 24h

### Tablas de Datos:
- ✅ **Lista completa de usuarios** con estado
- ✅ **Últimas conversaciones** con detalles
- ✅ **Distribución por carreras** con gráficos

### Actualización Automática:
- 🔄 Las estadísticas se actualizan cada 30 segundos
- 📊 Datos tomados directamente del localStorage

---

## 🚫 Seguridad

### Protección Implementada:

```javascript
// Solo permite acceso si el email es admin@luminom.com
isAdmin() {
  const session = this.getSession();
  return session && session.email === 'admin@luminom.com';
}

// Verifica antes de mostrar el panel
if (!Auth.isAdmin()) {
  // Muestra "Acceso Denegado" y redirect a login
}
```

### ¿Qué pasa si alguien más intenta entrar?

1. El sistema verifica el email de la sesión
2. Si NO es `admin@luminom.com`, muestra:
   - 🔒 "Acceso Denegado"
   - Mensaje: "Esta página es solo para administradores"
   - Botón para volver al login

---

## 🔄 Flujo Completo de Acceso

```
1. Crear cuenta con email admin@luminom.com
   ↓
2. Sistema detecta email especial
   ↓
3. Cuenta creada normalmente
   ↓
4. Login con esas credenciales
   ↓
5. Ir a /admin.html
   ↓
6. Sistema verifica: ¿email === admin@luminom.com?
   ↓
7. ✅ SI → Muestra panel admin
   ❌ NO → "Acceso Denegado"
```

---

## 💾 Datos Mostrados

Todos los datos son **REALES** tomados de localStorage:

### `luminom_users`
- Todos los usuarios registrados
- Nombres, emails, carreras, fechas

### `luminom_chats`
- Todas las conversaciones
- Títulos, mensajes, fechas de actualización

### `luminom_stats`
- Contadores globales
- Preguntas totales, actividad

---

## 📧 Contacto

Email de soporte: **luminomia@gmail.com**

Este email aparece en:
- Footer del sitio
- Página de contacto
- Mensajes de error

---

## ⚙️ Configuración Técnica

### Cambiar Email Admin

Si quieres usar otro email de admin, edita `admin.html`:

```javascript
// Línea ~180 aprox
isAdmin() {
  const session = this.getSession();
  return session && session.email === 'TU_EMAIL@AQUI.com'; // ← Cambiar
}
```

### Agregar Múltiples Admins

```javascript
isAdmin() {
  const session = this.getSession();
  const adminEmails = [
    'admin@luminom.com',
    'admin2@luminom.com',
    'otro@email.com'
  ];
  return session && adminEmails.includes(session.email);
}
```

---

## 🐛 Solución de Problemas

### "Acceso Denegado" aunque soy admin

**Causa**: Email no coincide exactamente

**Solución**:
1. Cierra sesión
2. Regístrate de nuevo con `admin@luminom.com` (sin espacios, minúsculas)
3. Inicia sesión
4. Intenta acceder al admin

### No veo estadísticas

**Causa**: No hay datos en localStorage

**Solución**:
1. Crea algunos usuarios de prueba
2. Haz conversaciones en el tutor
3. Recarga el panel admin

### Las estadísticas no se actualizan

**Causa**: Datos antiguos en caché

**Solución**:
1. Abre DevTools (F12)
2. Application → Local Storage
3. Revisa los datos en `luminom_users`, `luminom_chats`, `luminom_stats`
4. O recarga con Ctrl+Shift+R

---

## 🚀 Próximos Pasos

Para mejorar el panel admin:

### Backend Real:
- API REST para gestión de usuarios
- Base de datos MongoDB/PostgreSQL
- Autenticación con JWT
- Roles y permisos granulares

### Funcionalidades Avanzadas:
- Exportar datos a CSV/Excel
- Filtros avanzados (fecha, carrera, actividad)
- Ver conversaciones completas de usuarios
- Banear/desbanear usuarios
- Enviar notificaciones por email
- Logs de acceso y auditoría

---

¡Listo! Ahora tienes un panel admin completamente funcional con acceso restringido.
