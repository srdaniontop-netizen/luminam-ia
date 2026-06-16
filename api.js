import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { messages } = req.body;

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: "Eres Luminom IA, un tutor universitario de ingeniería de sistemas de la Universidad. Eres inteligente, empático y explicas con ejemplos claros y analogías colombianas.",
      messages: messages,
    });

    return res.status(200).json({ reply: msg.content[0].text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno en el servidor del tutor de IA' });
  }
}