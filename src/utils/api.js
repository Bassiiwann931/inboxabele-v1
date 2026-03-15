export async function sendMessage(messages, systemPrompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function sendMessageStream(messages, systemPrompt, onChunk) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt, stream: true }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return fullText;

      try {
        const parsed = JSON.parse(data);
        const text =
          parsed.delta?.text ||
          parsed.content?.[0]?.text ||
          parsed.text ||
          '';
        if (text) {
          fullText += text;
          onChunk(fullText);
        }
      } catch {
        // non-JSON data line, append as raw text
        if (data.trim()) {
          fullText += data;
          onChunk(fullText);
        }
      }
    }
  }

  return fullText;
}
