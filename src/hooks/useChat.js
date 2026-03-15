import { useState, useCallback } from 'react';
import { sendMessage, sendMessageStream } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [intakeComplete, setIntakeComplete] = useState(false);

  const send = useCallback(
    async (text) => {
      const userMessage = { role: 'user', content: text };
      const updated = [...messages, userMessage];
      setMessages(updated);
      setLoading(true);

      try {
        let assistantContent = '';

        try {
          // Try streaming first
          const placeholder = { role: 'assistant', content: '' };
          setMessages([...updated, placeholder]);

          assistantContent = await sendMessageStream(
            updated,
            undefined,
            (partial) => {
              setMessages([...updated, { role: 'assistant', content: partial }]);
            }
          );
        } catch {
          // Fallback to non-streaming
          const response = await sendMessage(updated);
          assistantContent =
            response.content?.[0]?.text || 'No response received.';
          setMessages([...updated, { role: 'assistant', content: assistantContent }]);
        }

        // Detect intake complete token
        if (assistantContent.includes('[INTAKE_COMPLETE]')) {
          setIntakeComplete(true);
          // Strip the token from displayed message
          const cleaned = assistantContent.replace('[INTAKE_COMPLETE]', '').trim();
          setMessages([...updated, { role: 'assistant', content: cleaned }]);
        }
      } catch {
        setMessages([
          ...updated,
          { role: 'assistant', content: 'Error: Failed to get a response.' },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  return { messages, loading, intakeComplete, send };
}
