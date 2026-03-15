import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function MessageThread({ messages, onSend, loading }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
}
