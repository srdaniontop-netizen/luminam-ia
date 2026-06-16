/* ============================================================
   LUMINOM IA — app.js
   Funcionalidades: Nav, Chat IA, Formulario contacto, Admin panel
   ============================================================ */

/* ---------- Estado global ---------- */
const state = {
  messages: [],
  contacts: JSON.parse(localStorage.getItem('luminom_contacts') || '[]'),
  services: JSON.parse(localStorage.getItem('luminom_services') || '[]'),
  isAdminLogged: false,
};

/* ============================================================
   NAV — scroll + hamburger
   ============================================================ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function updateActiveLink() {
  const sections = ['home', 'catalogo', 'tutor', 'contacto', 'admin'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initReveal() {
  document.querySelectorAll('.catalog-card, .contact-form-wrapper, .contact-info, .panel-stat').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   CHAT IA — Tutor Luminom
   ============================================================ */
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

// Sistema de prompt para el tutor universitario
const SYSTEM_PROMPT = `Eres Luminom IA, un tutor universitario inteligente, amigable y experto.
Tu misión es ayudar a estudiantes universitarios colombianos con cualquier materia académica.
Características de tu personalidad:
- Paciente y claro en las explicaciones
- Usas ejemplos reales y cotidianos
- Adaptas el lenguaje al nivel del estudiante
- Motivas y refuerzas la confianza del estudiante
- Cuando explicas matemáticas, usas pasos numerados
- Cuando explicas conceptos complejos, usas analogías
- Eres breve pero completo (máximo 3 párrafos por respuesta)
- Ocasionalmente preguntas si el estudiante entendió o quiere más profundidad
- Respondes SIEMPRE en español
- Nunca dices que no puedes ayudar; si no sabes algo, guías al estudiante a recursos confiables`;

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';
  showTyping(true);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          ...state.messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu pregunta. Intenta de nuevo.';

    state.messages.push({ role: 'user', content: text });
    state.messages.push({ role: 'assistant', content: reply });

    showTyping(false);
    addMessage(reply, 'bot');
  } catch (err) {
    showTyping(false);
    addMessage('Hubo un problema de conexión. Verifica tu internet e intenta de nuevo.', 'bot');
  }
}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg msg-${type}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = type === 'bot' ? 'L' : 'Tú'[0];

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  // Formatear el texto: párrafos y **negritas**
  const formatted = text
    .split('\n')
    .filter(l => l.trim())
    .map(l => {
      const withBold = l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<p>${withBold}</p>`;
    })
    .join('');
  bubble.innerHTML = formatted;

  if (type === 'bot') {
    msg.appendChild(avatar);
    msg.appendChild(bubble);
  } else {
    msg.appendChild(bubble);
    msg.appendChild(avatar);
  }

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping(show) {
  typingIndicator.classList.toggle('show', show);
  if (show) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setQuestion(q) {
  chatInput.value = q;
  chatInput.focus();
}

// Enter key para enviar
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* ============================================================
   FORMULARIO DE CONTACTO
   ============================================================ */
function validateField(id, errId, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el.value.trim()) {
    el.classList.add('error');
    err.textContent = msg;
    return false;
  }
  el.classList.remove('error');
  err.textContent = '';
  return true;
}

function validateEmail(id, errId) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
  if (!el.value.trim()) {
    el.classList.add('error');
    err.textContent = 'El correo es requerido';
    return false;
  }
  if (!valid) {
    el.classList.add('error');
    err.textContent = 'Ingresa un correo válido';
    return false;
  }
  el.classList.remove('error');
  err.textContent = '';
  return true;
}

function submitForm() {
  const v1 = validateField('cName', 'cNameErr', 'El nombre es requerido');
  const v2 = validateEmail('cEmail', 'cEmailErr');
  const v3 = validateField('cCarrera', 'cCarreraErr', 'Selecciona tu carrera');
  const v4 = validateField('cMsg', 'cMsgErr', 'Escribe tu mensaje');

  if (!v1 || !v2 || !v3 || !v4) return;

  const btn = document.getElementById('btnText');
  const loader = document.getElementById('btnLoader');
  btn.classList.add('hidden');
  loader.classList.remove('hidden');

  // Guardar contacto
  const contact = {
    id: Date.now(),
    name: document.getElementById('cName').value.trim(),
    email: document.getElementById('cEmail').value.trim(),
    carrera: document.getElementById('cCarrera').value,
    message: document.getElementById('cMsg').value.trim(),
    date: new Date().toLocaleDateString('es-CO'),
    status: 'Nuevo'
  };

  setTimeout(() => {
    state.contacts.push(contact);
    localStorage.setItem('luminom_contacts', JSON.stringify(state.contacts));
    updateMessageCount();

    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('formSuccess').classList.remove('hidden');
  }, 1500);
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'luminom2024';

function adminLogin() {
  const user = document.getElementById('aUser').value.trim();
  const pass = document.getElementById('aPass').value.trim();
  const err = document.getElementById('loginErr');

  if (!user || !pass) {
    err.textContent = 'Completa todos los campos';
    return;
  }
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    err.textContent = 'Credenciales incorrectas';
    document.getElementById('aPass').classList.add('error');
    return;
  }

  state.isAdminLogged = true;
  err.textContent = '';
  document.getElementById('adminLogin').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  renderAdminPanel();
}

function adminLogout() {
  state.isAdminLogged = false;
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminLogin').classList.remove('hidden');
  document.getElementById('aUser').value = '';
  document.getElementById('aPass').value = '';
  document.getElementById('loginErr').textContent = '';
}

function renderAdminPanel() {
  updateMessageCount();
  renderMessages();
  renderServices();
}

function updateMessageCount() {
  const el = document.getElementById('statMsgs');
  if (el) el.textContent = state.contacts.length;
}

function renderMessages() {
  const list = document.getElementById('messagesList');
  if (!list) return;

  if (state.contacts.length === 0) {
    list.innerHTML = '<div class="empty-state">Aún no hay mensajes de contacto.</div>';
    return;
  }

  list.innerHTML = state.contacts.map(c => `
    <div class="table-row">
      <span><strong>${escapeHtml(c.name)}</strong></span>
      <span>${escapeHtml(c.carrera)}</span>
      <span style="color:var(--text-secondary);font-size:0.8rem;">${escapeHtml(c.message.substring(0, 60))}${c.message.length > 60 ? '…' : ''}</span>
      <span class="table-status">${c.status}</span>
    </div>
  `).join('');
}

function addService() {
  const name = document.getElementById('svcName').value.trim();
  const desc = document.getElementById('svcDesc').value.trim();
  if (!name) return;

  const svc = { id: Date.now(), name, desc };
  state.services.push(svc);
  localStorage.setItem('luminom_services', JSON.stringify(state.services));

  document.getElementById('svcName').value = '';
  document.getElementById('svcDesc').value = '';
  renderServices();
}

function renderServices() {
  const list = document.getElementById('servicesList');
  if (!list) return;

  if (state.services.length === 0) {
    list.innerHTML = '<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.5rem;">Agrega servicios adicionales al catálogo.</p>';
    return;
  }
  list.innerHTML = state.services.map(s => `
    <span class="service-item" title="${escapeHtml(s.desc)}">${escapeHtml(s.name)}</span>
  `).join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  updateMessageCount();
});
