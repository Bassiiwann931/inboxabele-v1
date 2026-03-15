import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageThread from './components/MessageThread';
import { useChat } from './hooks/useChat';

const SAMPLE_ITEMS = [
  { id: 1, sender: 'Alice Johnson', subject: 'Project Update', preview: 'Here are the latest changes to the dashboard...' },
  { id: 2, sender: 'Bob Smith', subject: 'Meeting Notes', preview: 'Summary from today\'s standup meeting...' },
  { id: 3, sender: 'Carol White', subject: 'Design Review', preview: 'Please review the new mockups attached...' },
  { id: 4, sender: 'Dave Brown', subject: 'Bug Report', preview: 'Found an issue with the login flow...' },
];

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const { messages, loading, send } = useChat();

  return (
    <div className="h-screen flex">
      <div className="w-[40%] min-w-0">
        <Sidebar items={SAMPLE_ITEMS} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="w-[60%] min-w-0">
        {selectedId ? (
          <MessageThread messages={messages} onSend={send} loading={loading} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to get started
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
