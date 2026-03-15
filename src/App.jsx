import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageThread from './components/MessageThread';
import PlanRenderer from './components/PlanRenderer';
import { useChat } from './hooks/useChat';
import { mockPlan } from './data/mockPlan';

const SAMPLE_ITEMS = [
  { id: 1, sender: 'Alice Johnson', subject: 'Project Update', preview: 'Here are the latest changes to the dashboard...' },
  { id: 2, sender: 'Bob Smith', subject: 'Meeting Notes', preview: 'Summary from today\'s standup meeting...' },
  { id: 3, sender: 'Carol White', subject: 'Design Review', preview: 'Please review the new mockups attached...' },
  { id: 4, sender: 'Dave Brown', subject: 'Bug Report', preview: 'Found an issue with the login flow...' },
];

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('inbox'); // 'inbox' | 'plan'
  const { messages, loading, send } = useChat();

  if (view === 'plan') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setView('inbox')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Inbox
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-700">Warmup Plan Preview</span>
        </div>
        <div className="pt-11">
          <PlanRenderer plan={mockPlan} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">Inboxable</span>
        <button
          onClick={() => setView('plan')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B4F8A] text-white text-xs font-semibold hover:bg-[#163f6e] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View Warmup Plan
        </button>
      </div>
      <div className="flex-1 flex min-h-0">
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
    </div>
  );
}

export default App;
