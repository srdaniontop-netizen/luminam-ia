# 🎓 Luminom IA - Tutor Universitario Gratuito

**Tutor universitario con IA 100% gratuito y sin registros**

🔗 **Demo en vivo**: https://srdaniontop-netizen.github.io/luminam-ia/

---

## ✨ Características

- 🆓 **100% Gratis** - Sin pagos, sin suscripciones, sin límites
- 🚫 **Sin Registro** - Empieza a usar inmediatamente
- 🤖 **IA Avanzada** - Modelos de lenguaje de última generación
- 🇨🇴 **Para Colombia** - Explicaciones adaptadas al contexto local
- 📚 **Todas las Materias** - Matemáticas, Física, Programación, y más
- 🔒 **Privado** - Tus conversaciones no se guardan

---

## 🚀 Tecnología

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **IA**: Hugging Face Inference API (Llama 3.2)
- **Hosting**: GitHub Pages (gratis)
- **Sin Backend** - Todo funciona en el navegador

---

## 🎯 Uso

1. Visita: https://srdaniontop-netizen.github.io/luminam-ia/
2. Haz clic en "Empezar a Chatear Gratis"
3. Escribe tu pregunta
4. ¡Recibe ayuda al instante!

---

## 📦 Desplegar tu Propia Versión

### GitHub Pages (Gratis)

1. **Fork este repositorio**
2. **Ve a Settings** → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main` → **Folder**: `/root`
5. **Save**
6. Tu app estará en: `https://tu-usuario.github.io/luminam-ia/`

¡Eso es todo! Sin configuración adicional necesaria.

---

## 🔑 Cambiar el Modelo de IA

Si quieres usar otro modelo de Hugging Face:

1. Abre `tutor.html`
2. Busca `const API_URL`
3. Cambia por otro modelo:
   - `meta-llama/Llama-3.2-3B-Instruct` (actual)
   - `mistralai/Mistral-7B-Instruct-v0.2`
   - `google/flan-t5-xxl`
   - Ver más en: https://huggingface.co/models

---

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `tutor.html`:

```css
:root {
  --navy: #0A1628;    /* Fondo oscuro */
  --gold: #C9A84C;    /* Color dorado */
  --bg: #0F1419;      /* Fondo general */
  --card: #1A1F2E;    /* Tarjetas */
}
```

### Cambiar Prompt del Sistema

En `tutor.html`, busca `systemPrompt` y personaliza:

```javascript
const systemPrompt = `Eres [TU NOMBRE], un tutor para...`;
```

---

## 📊 Materias Soportadas

✅ Matemáticas (Cálculo, Álgebra, Estadística)  
✅ Física (Mecánica, Termodinámica)  
✅ Programación (Python, JavaScript, Java)  
✅ Química (Orgánica, Inorgánica)  
✅ Economía (Micro, Macro)  
✅ Derecho (Constitucional, Civil)  
✅ Y muchas más...

---

## 🔒 Privacidad

- ✅ No requiere registro ni login
- ✅ No se guardan conversaciones en servidores
- ✅ Todo funciona en tu navegador
- ✅ Las llamadas a la API son directas (sin intermediarios)

---

## ⚡ Limitaciones

### API Gratuita de Hugging Face:

- **Rate Limit**: ~30 requests por minuto
- **Modelo carga**: Puede tardar 20-30 segundos la primera vez
- **Respuestas**: ~1000 tokens máximo

Para uso intensivo, considera:
- Crear tu propia API key en Hugging Face (gratis)
- Usar modelos más pequeños
- Implementar caché de respuestas

---

## 🆘 Solución de Problemas

### "El modelo está cargando..."

**Causa**: Los modelos gratuitos de Hugging Face se "duermen" si no se usan.

**Solución**: Espera 20-30 segundos y vuelve a intentar.

### "Rate limit exceeded"

**Causa**: Demasiadas peticiones en poco tiempo.

**Solución**: Espera 1 minuto e intenta de nuevo.

### La IA responde en inglés

**Causa**: El modelo a veces olvida el idioma.

**Solución**: Escribe tu pregunta en español claro: "Explícame en español..."

---

## 🚀 Roadmap

- [ ] Historial de conversaciones (localStorage)
- [ ] Modo oscuro/claro
- [ ] Exportar conversaciones a PDF
- [ ] Voz a texto (Web Speech API)
- [ ] Múltiples modelos para elegir
- [ ] PWA (app instalable)
- [ ] Modo offline con cache

---

## 🤝 Contribuir

¿Quieres mejorar Luminom IA?

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/mejora`
3. Commit: `git commit -m 'Add: nueva función'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Úsalo libremente

---

## 🌟 Créditos

- **IA**: Hugging Face (Llama 3.2)
- **Diseño**: Luminom IA Team
- **Inspiración**: Estudiantes colombianos 🇨🇴

---

## 💬 Contacto

- GitHub: [@srdaniontop-netizen](https://github.com/srdaniontop-netizen)
- Proyecto: [luminam-ia](https://github.com/srdaniontop-netizen/luminam-ia)

---

**Hecho con ❤️ para estudiantes — 100% gratis, para siempre**

🔗 **Pruébalo ahora**: https://srdaniontop-netizen.github.io/luminam-ia/
