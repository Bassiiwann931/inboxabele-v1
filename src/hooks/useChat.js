import { useState } from 'react';
import { sendMessage } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // null | 'timeout' | 'api-error'

  const send = async (text, systemPrompt) => {
    setError(null);
    const userMessage = { role: 'user', content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);

    try {
      const response = await sendMessage(updated, systemPrompt);
      const assistantContent = response.content?.[0]?.text || 'No response received.';
      setMessages([...updated, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      const errorType = err.message === 'TIMEOUT' ? 'timeout' : 'api-error';
      setError(errorType);
      setMessages([
        ...updated,
        { role: 'assistant', content: 'Failed to get a response. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, loading, error, send, reset };
}
