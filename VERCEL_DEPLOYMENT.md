# 🚀 Desplegar Luminom IA en Vercel

Guía paso a paso para desplegar tu tutor IA en Vercel.

---

## 📋 Pre-requisitos

✅ Cuenta de Vercel (tienes Pro trial)  
✅ Proyecto en GitHub (ya lo tienes)  
✅ MongoDB Atlas configurado  
✅ API Key de Claude (Anthropic)

---

## 🎯 Pasos para Desplegar

### **1. Instala Vercel CLI (Opcional pero recomendado)**

```bash
npm install -g vercel
```

### **2. Login en Vercel**

```bash
vercel login
```

---

## 🌐 Opción A: Desplegar desde GitHub (Recomendado)

### **Paso 1: Ve a Vercel Dashboard**

1. Abre https://vercel.com/dashboard
2. Click en **"Add New..."** → **"Project"**

### **Paso 2: Importa tu Repositorio**

1. Conecta con GitHub si aún no lo has hecho
2. Busca y selecciona: **`srdaniontop-netizen/luminam-ia`**
3. Click en **"Import"**

### **Paso 3: Configurar el Proyecto**

En la página de configuración:

**Framework Preset**: Other  
**Root Directory**: `./` (raíz del proyecto)  
**Build Command**: `npm install` (o déjalo vacío)  
**Output Directory**: (déjalo vacío)  
**Install Command**: `npm install`

### **Paso 4: Agregar Variables de Entorno**

Click en **"Environment Variables"** y agrega:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luminom-ia?retryWrites=true&w=majority

# JWT Secret (genera uno nuevo)
JWT_SECRET=tu_jwt_secret_super_seguro_64_caracteres_minimo

# API Key de Claude
ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-de-claude-aqui

# Admin inicial
ADMIN_EMAIL=admin@luminom.ia
ADMIN_PASSWORD=TuPasswordSeguro2026!

# Configuración
NODE_ENV=production
PORT=5000

# CORS - URL de tu app en Vercel (la agregarás después del primer deploy)
FRONTEND_URL=https://tu-app.vercel.app
```

**⚠️ IMPORTANTE**: Para `FRONTEND_URL`, primero despliega con `*` y luego actualízalo con tu URL real de Vercel.

### **Paso 5: Deploy**

1. Click en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel despliega
3. ¡Listo! 🎉

### **Paso 6: Obtener tu URL**

Vercel te dará una URL como:
```
https://luminam-ia.vercel.app
```

o

```
https://luminam-ia-srdaniontop-netizen.vercel.app
```

### **Paso 7: Actualizar FRONTEND_URL**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `FRONTEND_URL` con tu URL real
4. Redeploy (Deployments → ... → Redeploy)

---

## 🖥️ Opción B: Desplegar desde CLI

### **Paso 1: Desde tu Terminal**

```bash
cd luminam-ia
vercel
```

### **Paso 2: Responde las preguntas**

```
? Set up and deploy "~/luminam-ia"? [Y/n] y
? Which scope do you want to deploy to? → Tu cuenta
? Link to existing project? [y/N] n
? What's your project's name? luminom-ia
? In which directory is your code located? ./
```

### **Paso 3: Agregar Variables de Entorno**

```bash
vercel env add MONGODB_URI
# Pega tu connection string de MongoDB Atlas

vercel env add JWT_SECRET
# Pega tu JWT secret

vercel env add ANTHROPIC_API_KEY
# Pega tu API key de Claude

vercel env add ADMIN_EMAIL
# admin@luminom.ia

vercel env add ADMIN_PASSWORD
# Tu password seguro

vercel env add NODE_ENV
# production
```

### **Paso 4: Deploy a Producción**

```bash
vercel --prod
```

---

## 🔧 Configuración de MongoDB Atlas

### **Whitelist IP de Vercel**

MongoDB Atlas necesita permitir las IPs de Vercel:

1. Ve a MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Solo para desarrollo/pruebas
   - En producción, usa reglas más específicas

### **Connection String**

Tu connection string debe verse así:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luminom-ia?retryWrites=true&w=majority
```

**Asegúrate de**:
- Reemplazar `username` y `password` con tus credenciales
- Incluir el nombre de la base de datos: `luminom-ia`
- URL encode la password si tiene caracteres especiales

---

## 📊 Verificar el Despliegue

### **1. Verificar que el servidor esté corriendo**

```
https://tu-app.vercel.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "Luminom IA Backend está funcionando correctamente",
  "environment": "production"
}
```

### **2. Probar el Frontend**

```
https://tu-app.vercel.app/
```

Deberías ver la landing page de Luminom IA.

### **3. Crear una Cuenta de Prueba**

1. Ve a: `https://tu-app.vercel.app/register.html`
2. Regístrate con un email de prueba
3. Inicia sesión
4. Prueba el chat con el tutor IA

### **4. Acceder al Panel Admin**

```
https://tu-app.vercel.app/admin.html
```

Credenciales:
- Email: `admin@luminom.ia`
- Password: El que configuraste en `ADMIN_PASSWORD`

---

## 🐛 Solución de Problemas

### **Error: "Cannot connect to MongoDB"**

**Solución**:
1. Verifica tu connection string en las variables de entorno
2. Asegúrate de que MongoDB Atlas permite conexiones desde cualquier IP (0.0.0.0/0)
3. Verifica usuario y contraseña
4. Asegúrate de que el usuario tenga permisos de lectura/escritura

### **Error: "Module not found"**

**Solución**:
```bash
# Agregar engines en package.json (ya lo incluí)
# Redeploy
vercel --prod
```

### **Error: "ANTHROPIC_API_KEY is not defined"**

**Solución**:
1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Verifica que `ANTHROPIC_API_KEY` esté configurada
3. Redeploy

### **Error: "Token inválido" o "JWT malformed"**

**Solución**:
1. Genera un nuevo `JWT_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Actualiza en Vercel Environment Variables
3. Los usuarios existentes deberán volver a iniciar sesión

### **El frontend carga pero el chat no funciona**

**Solución**:
1. Abre la consola del navegador (F12)
2. Verifica errores de CORS
3. Asegúrate de que `FRONTEND_URL` esté configurado correctamente
4. Verifica que la API Key de Claude sea válida

---

## 🔄 Actualizar tu Proyecto

### **Opción 1: Desde GitHub (Automático)**

Cada vez que hagas push a GitHub, Vercel desplegará automáticamente:

```bash
git add .
git commit -m "feat: nueva característica"
git push origin main
```

Vercel detectará el cambio y redesplegará automáticamente.

### **Opción 2: Desde CLI**

```bash
vercel --prod
```

---

## 🌐 Configurar Dominio Personalizado

### **Paso 1: Ve a Vercel Dashboard**

1. Tu Proyecto → Settings → Domains
2. Click en "Add"

### **Paso 2: Agrega tu Dominio**

Ejemplo: `luminom.ia` o `app.luminom.ia`

### **Paso 3: Configurar DNS**

Vercel te dará instrucciones para configurar tu DNS:

**Para dominio raíz** (luminom.ia):
```
A Record: 76.76.21.21
```

**Para subdominio** (app.luminom.ia):
```
CNAME: cname.vercel-dns.com
```

### **Paso 4: Actualizar FRONTEND_URL**

```bash
# En Vercel Environment Variables
FRONTEND_URL=https://luminom.ia  # o tu dominio
```

Luego redeploy.

---

## 📈 Monitoreo en Vercel

### **Ver Logs en Tiempo Real**

1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en el deployment activo
4. Click en "Functions" para ver logs

### **Analytics (Disponible en Pro)**

1. Ve a tu proyecto
2. Click en "Analytics"
3. Verás:
   - Requests por segundo
   - Response times
   - Errores
   - Tráfico por país

### **Speed Insights (Pro)**

1. Click en "Speed Insights"
2. Verás métricas de performance:
   - Core Web Vitals
   - Load times
   - First Contentful Paint

---

## ✅ Checklist Post-Despliegue

- [ ] La app carga en `https://tu-app.vercel.app`
- [ ] `/api/health` responde correctamente
- [ ] Puedes crear una cuenta nueva
- [ ] Puedes iniciar sesión
- [ ] El chat con IA funciona
- [ ] Puedes acceder al panel admin
- [ ] El admin puede ver estadísticas
- [ ] MongoDB está guardando datos correctamente
- [ ] Variables de entorno configuradas
- [ ] `FRONTEND_URL` actualizado con la URL real

---

## 🎯 Configuración Óptima para Vercel Pro

Como tienes Vercel Pro, activa estas características:

### **1. Edge Functions**

Tu app ya está optimizada para Edge. Vercel la desplegará en múltiples regiones automáticamente.

### **2. Analytics**

```bash
# Ya incluido en el plan Pro
# Ve a Analytics en tu dashboard
```

### **3. Performance Monitoring**

Habilita Speed Insights en tu dashboard para:
- Monitorear Core Web Vitals
- Detectar cuellos de botella
- Optimizar rendimiento

### **4. Password Protection (Opcional)**

Para staging/desarrollo:
1. Settings → Deployment Protection
2. Activa "Password Protection"

---

## 🚀 Optimizaciones Adicionales

### **1. Configurar Caching**

Las respuestas estáticas ya tienen cache automático en Vercel.

### **2. Comprimir Assets**

Vercel comprime automáticamente con Brotli y Gzip.

### **3. CDN Global**

Tu app se sirve desde el CDN global de Vercel (200+ ubicaciones).

---

## 📞 Soporte

¿Problemas desplegando?

1. 📖 Revisa los logs en Vercel Dashboard
2. 🐛 Verifica las variables de entorno
3. 💬 Documentación de Vercel: https://vercel.com/docs
4. 📧 Contacto: soporte@luminom.ia

---

## 🎉 ¡Listo!

Tu **Luminom IA** está ahora desplegado en Vercel con:

✅ Backend serverless  
✅ Frontend optimizado  
✅ CDN global  
✅ HTTPS automático  
✅ Despliegues automáticos desde GitHub  
✅ Monitoreo en tiempo real  
✅ Analytics Pro  

**¡A enseñar con IA! 🎓🚀**
