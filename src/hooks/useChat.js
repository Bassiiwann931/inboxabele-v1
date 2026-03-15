import { useState } from 'react';
import { sendMessage } from '../utils/api';

// Extracts the intake JSON object from a message containing [INTAKE_COMPLETE]
function extractIntakeJson(text) {
  const jsonMatch = text.match(/\[INTAKE_COMPLETE\]\s*(\{[\s\S]*\})/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[1]);
  } catch {
    return null;
  }
}

export function useChat({ onIntakeComplete } = {}) {
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

      // Detect [INTAKE_COMPLETE] signal and trigger plan generation
      if (assistantContent.includes('[INTAKE_COMPLETE]') && onIntakeComplete) {
        const intakeJson = extractIntakeJson(assistantContent);
        if (intakeJson) {
          onIntakeComplete(intakeJson);
        }
      }
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
