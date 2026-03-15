import { useState } from 'react';
import { sendMessage } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const userMessage = { role: 'user', content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);

    try {
      const response = await sendMessage(updated);
      const assistantContent =
        response.content?.[0]?.text || 'No response received.';
      setMessages([...updated, { role: 'assistant', content: assistantContent }]);
    } catch {
      setMessages([
        ...updated,
        { role: 'assistant', content: 'Error: Failed to get a response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, send };
}
