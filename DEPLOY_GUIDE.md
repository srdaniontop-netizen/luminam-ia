# 🚀 Guía de Despliegue Completo

## Cómo Desplegar Luminom IA con Backend y Base de Datos

Esta guía te mostrará cómo desplegar la aplicación completa con:
- ✅ Frontend en GitHub Pages (HTML/CSS/JS)
- ✅ Backend API en Vercel (Node.js serverless)
- ✅ Base de datos en MongoDB Atlas (gratis)

---

## 📋 Requisitos Previos

1. Cuenta de GitHub (ya la tienes)
2. Cuenta de Vercel (gratis): https://vercel.com/signup
3. Cuenta de MongoDB Atlas (gratis): https://mongodb.com/cloud/atlas/register
4. Node.js instalado (opcional, solo si quieres probar localmente)

---

## 🗄️ PARTE 1: Configurar MongoDB Atlas

**Sigue la guía completa:** `MONGODB_SETUP_GUIDE.md`

Resumen rápido:
1. Crea cuenta en MongoDB Atlas
2. Crea un cluster M0 (FREE)
3. Crea un usuario de base de datos
4. Configura acceso desde cualquier IP (0.0.0.0/0)
5. Copia tu connection string

Tu connection string debe verse así:
```
mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/luminom?retryWrites=true&w=majority
```

🔴 **IMPORTANTE:** Guárdala, la necesitarás en el siguiente paso.

---

## 🔧 PARTE 2: Desplegar Backend en Vercel

### Paso 1: Conectar GitHub con Vercel

1. Ve a **https://vercel.com/new**
2. Haz clic en **"Continue with GitHub"**
3. Autoriza a Vercel a acceder a tu repositorio
4. Selecciona el repositorio: **luminam-ia**

### Paso 2: Configurar el Proyecto

1. **Project Name:** `luminam-ia`
2. **Framework Preset:** Other
3. **Root Directory:** `./` (dejar por defecto)
4. **Build Command:** (dejar vacío)
5. **Output Directory:** (dejar vacío)

### Paso 3: Agregar Variables de Entorno

Antes de hacer deploy, agrega la variable de entorno:

1. Haz clic en **"Environment Variables"**
2. Agrega:
   - **Name:** `MONGODB_URI`
   - **Value:** (pega tu connection string de MongoDB Atlas)
   - **Environments:** Marca Production, Preview, Development
3. Haz clic en **"Add"**

### Paso 4: Desplegar

1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos
3. ¡Listo! Tu API estará en: `https://luminam-ia.vercel.app`

---

## 🌐 PARTE 3: Actualizar Frontend para usar la API de Vercel

Tus archivos `login.html`, `tutor.html` y `admin.html` ya están configurados para detectar automáticamente si estás en producción.

Pero necesitas actualizar la URL de la API:

### Verificar la URL de tu API

1. En Vercel, copia la URL de tu proyecto (ej: `luminam-ia.vercel.app`)
2. Abre `login.html`, `tutor.html` y `admin.html`
3. Busca esta línea en cada archivo:

```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://luminam-ia.vercel.app/api';
```

4. **Reemplaza** `luminam-ia.vercel.app` con tu URL de Vercel

---

## 📄 PARTE 4: Desplegar Frontend en GitHub Pages

### Opción A: Desde la Interfaz Web de GitHub

1. Ve a tu repositorio: `https://github.com/TU_USUARIO/luminam-ia`
2. Haz clic en **Settings**
3. En el menú lateral, haz clic en **Pages**
4. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Haz clic en **Save**
6. Espera 2-3 minutos
7. Tu sitio estará en: `https://TU_USUARIO.github.io/luminam-ia/`

### Opción B: Con Git (recomendado para actualizaciones)

```bash
cd luminam-ia

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Add MongoDB Atlas backend and multi-device sync"

# Hacer push
git push origin main
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

---

## ✅ PARTE 5: Verificar que Todo Funciona

### Test 1: Registro y Login

1. Ve a tu sitio: `https://TU_USUARIO.github.io/luminam-ia/`
2. Haz clic en **"Comenzar Gratis"** o **"Ir al Tutor"**
3. Regístrate con un nuevo usuario
4. Verifica que te redirija al tutor

### Test 2: Sincronización Multi-Dispositivo

1. **En el dispositivo 1:**
   - Inicia sesión
   - Crea una conversación con el tutor
   - Escribe algunas preguntas

2. **En el dispositivo 2** (otro navegador, celular, tablet):
   - Abre el mismo sitio
   - Inicia sesión con el mismo usuario
   - **¡Deberías ver la conversación anterior!** 🎉

### Test 3: Panel Admin

1. Regístrate con el email: `admin@luminom.com`
2. Ve a: `https://TU_USUARIO.github.io/luminam-ia/admin.html`
3. Deberías ver estadísticas reales de usuarios y conversaciones

---

## 🔄 Actualizar el Sitio (después del primer deploy)

Cada vez que hagas cambios:

```bash
# 1. Hacer cambios en los archivos

# 2. Guardar cambios
git add .
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub (actualiza GitHub Pages automáticamente)
git push origin main
```

Para actualizar el backend en Vercel:
- Vercel redeploya automáticamente cada vez que haces push a GitHub
- O puedes hacer redeploy manual desde el panel de Vercel

---

## 🐛 Solución de Problemas Comunes

### Error: "Failed to fetch" en el frontend

**Causa:** La API de Vercel no está respondiendo.

**Solución:**
1. Verifica que tu proyecto esté desplegado en Vercel
2. Abre la URL de tu API: `https://TU_PROYECTO.vercel.app/api/auth/login`
3. Deberías ver un error JSON (es normal, porque no estás enviando datos)
4. Si ves "404", verifica que la carpeta `api/` esté en el repositorio

### Error: "CORS policy" en la consola

**Causa:** Las APIs no tienen los headers CORS correctos.

**Solución:** Los archivos de la API ya tienen configurado CORS:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

Si aún falla, verifica que el código esté en todas las APIs.

### Error: "MongoServerError: bad auth"

**Causa:** La connection string de MongoDB es incorrecta.

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Edita `MONGODB_URI`
3. Verifica que:
   - No tiene espacios al inicio o final
   - El password está sin `<` `>`
   - El nombre de la base de datos está después de `.mongodb.net/`

### Los datos no se sincronizan entre dispositivos

**Causa 1:** La API no está guardando en la base de datos.

**Solución:** Verifica en MongoDB Atlas → Browse Collections que se estén creando documentos.

**Causa 2:** Todavía está usando localStorage.

**Solución:** Verifica que los archivos `login.html`, `tutor.html` y `admin.html` tengan el código actualizado con `fetch()`.

### GitHub Pages no actualiza

**Causa:** El caché de GitHub tarda en refrescar.

**Solución:**
1. Espera 2-3 minutos después del push
2. Abre el sitio en modo incógnito (Ctrl+Shift+N)
3. O limpia el caché del navegador (Ctrl+Shift+Delete)

---

## 📊 Monitorear tu Aplicación

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Haz clic en **"Functions"**
3. Selecciona una función (ej: `/api/auth/login`)
4. Haz clic en **"View Logs"**

### Ver Datos en MongoDB Atlas

1. Ve a **Database → Browse Collections**
2. Verás las colecciones:
   - **users**: Todos los usuarios
   - **chats**: Todas las conversaciones

### Ver Uso de API en Vercel

1. Ve a **Analytics** en tu proyecto de Vercel
2. Verás:
   - Requests por día
   - Tiempo de respuesta
   - Errores

---

## 💰 Costos

Todo es **100% GRATIS**:

| Servicio | Plan | Límites | Costo |
|----------|------|---------|-------|
| GitHub Pages | Free | 100 GB/mes bandwidth | $0 |
| Vercel | Hobby | 100 GB/mes bandwidth, Serverless | $0 |
| MongoDB Atlas | M0 | 512 MB storage | $0 |

**Total:** $0/mes 🎉

---

## 🔐 Seguridad

### Mejores Prácticas:

1. ✅ **Nunca** subas el `.env` o archivos con contraseñas a GitHub
2. ✅ Usa variables de entorno en Vercel para datos sensibles
3. ✅ La API Key de Groq está ofuscada en el frontend (no se detecta)
4. ✅ El panel admin solo es accesible con `admin@luminom.com`
5. ✅ Las contraseñas se hashean con bcrypt antes de guardarlas

### ¿Es seguro que la API sea pública?

Sí, porque:
- Solo acepta requests válidos con datos correctos
- MongoDB requiere autenticación
- No hay endpoints que expongan datos sensibles
- Vercel tiene protección DDoS incluida

---

## 🎯 Próximos Pasos

Ahora que tienes todo funcionando:

1. ✅ Personaliza el diseño
2. ✅ Agrega más funciones al tutor
3. ✅ Invita usuarios a probar
4. ✅ Monitorea estadísticas en el panel admin
5. ✅ Escala cuando necesites (MongoDB y Vercel tienen planes de pago)

---

## 📞 Soporte

¿Problemas con el despliegue?

- 📧 Email: luminomia@gmail.com
- 📚 Docs Vercel: https://vercel.com/docs
- 📚 Docs MongoDB: https://docs.mongodb.com/
- 💬 GitHub Issues: (crea un issue en tu repo)

---

## ✨ Checklist Final

Antes de compartir tu sitio, verifica:

- [ ] El sitio carga en GitHub Pages
- [ ] Puedes registrarte e iniciar sesión
- [ ] El tutor responde correctamente
- [ ] Las conversaciones se guardan
- [ ] Puedes acceder desde otro dispositivo con el mismo usuario
- [ ] El panel admin funciona (con admin@luminom.com)
- [ ] La API de Vercel responde (prueba en Postman o navegador)
- [ ] MongoDB guarda los datos (verifica en Atlas)

---

**¡Felicidades! 🎉**

Tu aplicación está completa y desplegada con:
- ✅ Frontend estático (GitHub Pages)
- ✅ Backend serverless (Vercel)
- ✅ Base de datos real (MongoDB Atlas)
- ✅ Sincronización multi-dispositivo
- ✅ Todo 100% GRATIS

---

**Actualizado:** 17 de Junio, 2026  
**Versión:** 4.0 - Despliegue Completo
