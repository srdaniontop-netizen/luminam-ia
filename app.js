// Busca esta sección dentro de tu función sendMessage
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: messageHistory
  })
});