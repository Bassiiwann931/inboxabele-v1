export async function sendMessage(messages, systemPrompt, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
