# 🎓 Luminom IA - Tutor Universitario con IA

**Tutor universitario inteligente 100% gratuito para estudiantes colombianos**

🔗 **Demo en vivo**: https://srdaniontop-netizen.github.io/luminam-ia/

---

## ✨ Características

- 🆓 **100% Gratis** - Sin pagos ni suscripciones
- 🚫 **Sin Registro Obligatorio** - Empieza inmediatamente
- 🤖 **IA Avanzada** - Llama 3.3 70B de Meta (vía Groq API)
- 🇨🇴 **Para Colombia** - Explicaciones adaptadas al contexto local
- 📚 **Todas las Materias** - Matemáticas, Física, Programación, Derecho, y más
- ⚡ **Súper Rápido** - Respuestas en segundos gracias a Groq
- 🔒 **Privado** - Tus conversaciones solo se guardan en tu navegador

---

## 🚀 Uso Rápido

### Paso 1: Obtén tu API Key (Gratis)

1. Ve a [https://console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita
3. Ve a **API Keys** → **Create API Key**
4. Copia tu key (empieza con `gsk_...`)

### Paso 2: Usa el Tutor

1. Visita: https://srdaniontop-netizen.github.io/luminam-ia/
2. Haz clic en **"Empezar Gratis"**
3. Pega tu API Key cuando te lo pida
4. ¡Empieza a estudiar! 🎉

**Tu API Key se guarda solo en tu navegador** (localStorage), nadie más puede verla.

---

## 🔑 ¿Por qué necesito una API Key?

Groq ofrece acceso **gratuito** a modelos de IA muy potentes, pero requiere una key para:
- Evitar abuso del servicio
- Darte tu propio límite de uso (muy generoso)
- Mantener el servicio rápido y estable

**Plan Gratuito de Groq:**
- ✅ 14,400 requests por día
- ✅ 30 requests por minuto
- ✅ Modelo Llama 3.3 70B (uno de los mejores)
- ✅ Sin tarjeta de crédito requerida

---

## 🎯 Páginas Incluidas

| Página | Descripción |
|--------|-------------|
| **index.html** | Página principal con info del proyecto |
| **tutor.html** | Chat interactivo con la IA |
| **login.html** | Sistema de login (demo, localStorage) |
| **servicios.html** | Planes y precios (próximamente) |
| **admin.html** | Panel de administración (demo) |

---

## 📦 Desplegar tu Propia Versión

### GitHub Pages (Recomendado - Gratis)

1. **Fork este repositorio**
2. **Settings** → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main` → **Folder**: `/root`
5. **Save**

Tu app estará en: `https://tu-usuario.github.io/luminam-ia/`

### Vercel (Alternativa)

1. Importa el repo en Vercel
2. Configura como Static Site
3. Deploy

---

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en cualquier archivo HTML:

```css
:root {
  --primary: #6366F1;    /* Violeta */
  --secondary: #8B5CF6;  /* Púrpura */
  --accent: #EC4899;     /* Rosa */
  --darker: #020617;     /* Fondo oscuro */
}
```

### Cambiar el Modelo de IA

En `tutor.html`, cambia el modelo (línea ~406):

```javascript
const API_CONFIG = {
  url: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile'  // ← Cambia esto
};
```

Modelos disponibles en Groq (gratis):
- `llama-3.3-70b-versatile` (recomendado - más inteligente)
- `llama-3.1-8b-instant` (más rápido, menos preciso)
- `mixtral-8x7b-32768` (buen balance)

Ver todos: [https://console.groq.com/docs/models](https://console.groq.com/docs/models)

### Personalizar el Prompt

En `tutor.html`, busca `systemPrompt` y edita:

```javascript
const systemPrompt = `Eres [NOMBRE], un tutor que...`;
```

---

## 📊 Materias Soportadas

✅ **Matemáticas**: Cálculo, Álgebra, Estadística, Geometría  
✅ **Física**: Mecánica, Termodinámica, Óptica, Cuántica  
✅ **Programación**: Python, JavaScript, Java, C++, C#  
✅ **Química**: Orgánica, Inorgánica, Bioquímica  
✅ **Economía**: Microeconomía, Macroeconomía  
✅ **Derecho**: Constitucional, Civil, Penal  
✅ **Inglés**: Gramática, vocabulario, writing  
✅ **Y muchas más...**

---

## 🔒 Privacidad y Seguridad

### ¿Dónde se guarda mi API Key?

Tu API Key se guarda **solo en tu navegador** usando `localStorage`:
- ❌ **NO** se envía a ningún servidor nuestro (no tenemos servidor)
- ❌ **NO** se guarda en GitHub
- ✅ Solo se usa para llamadas directas a Groq API
- ✅ Puedes borrarla cuando quieras (botón "🔑 API Key")

### ¿Puedo compartir mi API Key?

**NO**. Tu API Key es personal. Si alguien la tiene, puede:
- Usar tu cuota de requests
- Potencialmente violar términos de servicio de Groq

**Para cambiar tu key:**
1. Haz clic en **"🔑 API Key"** en el tutor
2. Pega tu nueva key

---

## ⚡ Solución de Problemas

### "Por favor ingresa tu API Key"

**Causa**: No has configurado tu API Key de Groq.

**Solución**: 
1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta y genera una API Key
3. Pégala en la app

### "Error 401: Invalid API Key"

**Causa**: Tu API Key es incorrecta o expiró.

**Solución**: 
1. Verifica que copiaste la key completa (empieza con `gsk_`)
2. Genera una nueva key en Groq
3. Haz clic en "🔑 API Key" y actualízala

### "Error 429: Rate Limit"

**Causa**: Excediste los límites del plan gratuito (30 req/min).

**Solución**: Espera 1 minuto y vuelve a intentar.

### Las respuestas son muy lentas

**Causa**: Groq está saturado o tu conexión es lenta.

**Solución**: 
- Intenta en otro momento
- Cambia a un modelo más rápido como `llama-3.1-8b-instant`

---

## 🚀 Roadmap

- [x] Chat básico con IA
- [x] Página de login (demo)
- [x] Página de servicios
- [x] Panel admin (demo)
- [ ] Historial de conversaciones (localStorage)
- [ ] Modo oscuro/claro
- [ ] Exportar conversaciones a PDF
- [ ] Múltiples modelos para elegir
- [ ] Reconocimiento de voz
- [ ] PWA (app instalable)
- [ ] Backend real con autenticación
- [ ] Sistema de pagos (Premium)

---

## 🤝 Contribuir

¿Quieres mejorar Luminom IA?

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/mejora`
3. Commit: `git commit -m 'Add: nueva función'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

**Ideas de mejoras:**
- Temas personalizados (dark/light mode)
- Soporte para más idiomas
- Explicaciones con diagramas (Mermaid.js)
- Modo matemático con LaTeX
- Generador de flashcards
- Quizzes interactivos

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- **IA**: Groq API (Llama 3.3 70B)
- **Hosting**: GitHub Pages
- **Diseño**: Glassmorphism, gradientes, animaciones CSS
- **Arquitectura**: Static site (sin backend)

---

## 📄 Licencia

MIT License - Usa, modifica y distribuye libremente

---

## 🌟 Créditos

- **IA**: [Groq](https://groq.com) (API) + Meta (Llama 3.3)
- **Diseño**: Luminom IA Team
- **Inspiración**: Estudiantes colombianos 🇨🇴

---

## 💬 Contacto

- **GitHub**: [@srdaniontop-netizen](https://github.com/srdaniontop-netizen)
- **Proyecto**: [luminam-ia](https://github.com/srdaniontop-netizen/luminam-ia)
- **Issues**: [Reportar problema](https://github.com/srdaniontop-netizen/luminam-ia/issues)

---

## 📝 Notas Importantes

### Para Usuarios

- **Groq API es gratis** pero requiere registro (sin tarjeta)
- Tu API Key es **personal**, no la compartas
- La app **no tiene backend**, todo es frontend
- Los datos se guardan **solo en tu navegador**

### Para Desarrolladores

- Código 100% cliente (HTML/CSS/JS)
- Sin dependencias externas (no npm, no build)
- Diseño responsive (mobile-first)
- Accesible (puede mejorarse con ARIA labels)

---

**Hecho con ❤️ para estudiantes colombianos — 100% gratis**

🔗 **Pruébalo ahora**: https://srdaniontop-netizen.github.io/luminam-ia/

📚 **¿Necesitas ayuda?** Abre un [issue en GitHub](https://github.com/srdaniontop-netizen/luminam-ia/issues)
