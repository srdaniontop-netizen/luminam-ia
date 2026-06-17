# 🗄️ Guía Completa: Configurar MongoDB Atlas

## ¿Qué es MongoDB Atlas?

MongoDB Atlas es una **base de datos en la nube GRATIS** que permite sincronizar datos entre dispositivos. Con esto, los usuarios podrán:

- ✅ Iniciar sesión desde cualquier dispositivo
- ✅ Ver sus conversaciones en el celular, tablet y computador
- ✅ No perder datos al cerrar sesión o cambiar de navegador

---

## 📋 Paso 1: Crear Cuenta en MongoDB Atlas

1. Ve a: **https://www.mongodb.com/cloud/atlas/register**
2. Regístrate con tu email o Google
3. Selecciona el plan **M0 (FREE)** - ¡Es gratis para siempre!
4. Elige región: **AWS / N. Virginia (us-east-1)** o la más cercana a Colombia

---

## 📦 Paso 2: Crear un Cluster (Base de Datos)

1. Haz clic en **"Build a Database"**
2. Selecciona **M0 FREE**
3. Provider: **AWS**
4. Region: **us-east-1** (N. Virginia)
5. Cluster Name: `luminom` (o el que quieras)
6. Haz clic en **"Create"**

⏱️ Espera 3-5 minutos mientras se crea el cluster.

---

## 🔐 Paso 3: Configurar Usuario de Base de Datos

1. En el menú lateral, ve a **Database Access**
2. Haz clic en **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `luminomadmin` (o el que quieras)
5. Password: **Genera una contraseña segura** (guárdala bien)
6. Database User Privileges: **Atlas admin**
7. Haz clic en **"Add User"**

🔑 **IMPORTANTE:** Guarda el username y password, los necesitarás después.

---

## 🌐 Paso 4: Configurar Acceso desde Cualquier IP

1. En el menú lateral, ve a **Network Access**
2. Haz clic en **"Add IP Address"**
3. Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Haz clic en **"Confirm"**

⚠️ Esto es necesario para que Vercel pueda conectarse.

---

## 🔗 Paso 5: Obtener la Connection String

1. Ve a **Database** en el menú lateral
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copia la **Connection String**, se ve así:

```
mongodb+srv://luminomadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **REEMPLAZA** `<password>` con la contraseña que creaste en el Paso 3
8. **AÑADE** el nombre de la base de datos después de `mongodb.net/`:

```
mongodb+srv://luminomadmin:TU_PASSWORD_AQUI@cluster0.xxxxx.mongodb.net/luminom?retryWrites=true&w=majority
```

🎯 Esta es tu **MONGODB_URI** final.

---

## 🚀 Paso 6: Configurar en Vercel

### Opción A: Si ya tienes el proyecto en Vercel

1. Ve a tu proyecto en Vercel: **https://vercel.com/dashboard**
2. Ve a **Settings → Environment Variables**
3. Agrega una nueva variable:
   - **Name:** `MONGODB_URI`
   - **Value:** (pega tu connection string completa)
   - **Environments:** Marca Production, Preview, Development
4. Haz clic en **"Save"**
5. Ve a **Deployments** y haz **"Redeploy"** del último deployment

### Opción B: Si aún no has desplegado en Vercel

1. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. En la carpeta del proyecto, ejecuta:
   ```bash
   vercel
   ```

3. Sigue las instrucciones:
   - Set up and deploy? **Yes**
   - Which scope? (tu usuario)
   - Link to existing project? **No**
   - Project name: `luminam-ia`
   - Directory: `./`
   - Override settings? **No**

4. Una vez desplegado, configura la variable de entorno:
   ```bash
   vercel env add MONGODB_URI
   ```
   - Pega tu connection string
   - Selecciona **Production, Preview, Development**

5. Redeploy:
   ```bash
   vercel --prod
   ```

---

## ✅ Paso 7: Verificar que Funciona

1. Ve a tu sitio: `https://tu-proyecto.vercel.app`
2. Regístrate con un nuevo usuario
3. Inicia sesión
4. Crea una conversación en el tutor
5. Cierra sesión
6. **Abre el sitio en otro navegador o dispositivo**
7. Inicia sesión con el mismo usuario
8. ¡Deberías ver tu conversación anterior! 🎉

---

## 🐛 Solución de Problemas

### Error: "MongoServerError: bad auth"
- ❌ La contraseña en la connection string es incorrecta
- ✅ Verifica que reemplazaste `<password>` correctamente

### Error: "ENOTFOUND" o "timeout"
- ❌ La IP no está en la whitelist
- ✅ Ve a Network Access y agrega `0.0.0.0/0`

### Error: "Variable MONGODB_URI no definida"
- ❌ No configuraste la variable de entorno en Vercel
- ✅ Ve a Settings → Environment Variables en Vercel

### Los datos no se sincronizan
- ❌ Vercel no redeployó después de agregar la variable
- ✅ Ve a Deployments → Redeploy

---

## 📊 Ver tus Datos en MongoDB Atlas

1. Ve a **Database** en el menú lateral
2. Haz clic en **"Browse Collections"** en tu cluster
3. Verás 2 colecciones:
   - **users**: Todos los usuarios registrados
   - **chats**: Todas las conversaciones

Puedes ver, editar y eliminar datos desde aquí.

---

## 💰 Límites del Plan Gratuito

El plan M0 FREE incluye:

- ✅ 512 MB de almacenamiento (suficiente para miles de usuarios)
- ✅ Conexiones ilimitadas
- ✅ Backups automáticos
- ✅ 100% gratis para siempre

### ¿Cuántos usuarios soporta?

Con 512 MB puedes tener aproximadamente:

- **~10,000 usuarios** (50 KB por usuario)
- **~100,000 conversaciones** (5 KB por conversación)

Si necesitas más, puedes actualizar a M10 ($0.08/hora ~ $57/mes).

---

## 🔒 Seguridad

### Mejores Prácticas:

1. ✅ Nunca compartas tu connection string públicamente
2. ✅ Usa variables de entorno (no hardcodees el URI)
3. ✅ Cambia la contraseña regularmente
4. ✅ Monitorea accesos en el panel de Atlas

### ¿Es seguro "Allow Access from Anywhere"?

Sí, porque:
- La conexión está encriptada (TLS/SSL)
- Requiere usuario y contraseña correctos
- MongoDB Atlas tiene protección contra ataques

---

## 📞 ¿Necesitas Ayuda?

- 📧 Email: luminomia@gmail.com
- 📚 Docs MongoDB: https://docs.mongodb.com/
- 💬 Comunidad: https://community.mongodb.com/

---

## 🎉 ¡Listo!

Ahora tu aplicación tiene:

✅ Base de datos real en la nube  
✅ Sincronización multi-dispositivo  
✅ Datos persistentes (no se pierden)  
✅ Escalable a miles de usuarios  
✅ **100% GRATIS**  

---

**Actualizado:** 17 de Junio, 2026  
**Versión:** 4.0 - Sistema con Base de Datos Real
