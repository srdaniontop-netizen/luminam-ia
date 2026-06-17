import Anthropic from '@anthropic-ai/sdk';

// Inicializar cliente de Anthropic Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Configuración del modelo
export const AI_CONFIG = {
  model: 'claude-sonnet-4-20250514', // Modelo actualizado 2026
  maxTokens: 2000,
  temperature: 0.7,
};

export default anthropic;
