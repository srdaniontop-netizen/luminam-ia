import Anthropic from '@anthropic-ai/sdk';

// Inicializamos el cliente de Anthropic con la clave de entorno segura
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Configuración de cabeceras CORS para permitir peticiones desde tu propio frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar la petición de pre-vuelo (Preflight) de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitimos peticiones POST (enviar mensajes)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'El formato de los mensajes no es válido.' });
    }

    // Petición oficial a la API de Anthropic utilizando Claude 3.5 Sonnet
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: "Eres Luminom IA, un tutor universitario de ingeniería de sistemas inteligente, empático y detallado.",
      messages: messages,
    });

    // Devolvemos el texto generado por la IA al frontend
    return res.status(200).json({ reply: msg.content[0].text });

  } catch (error) {
    console.error('Error en el servidor de Luminom IA:', error);
    return res.status(500).json({ error: 'Error interno al procesar la solicitud con la IA.' });
  }
}