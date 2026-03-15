import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import {
  DomainHistoryCard,
  ListProfileCard,
  InfrastructureCard,
  UseCaseCard,
  ISPMixCard,
  VolumeTargetCard,
} from './components/SmartFormCard';
import { useChat } from './hooks/useChat';

const SAMPLE_ITEMS = [
  { id: 1, sender: 'Alice Johnson', subject: 'Project Update', preview: 'Here are the latest changes to the dashboard...' },
  { id: 2, sender: 'Bob Smith', subject: 'Meeting Notes', preview: 'Summary from today\'s standup meeting...' },
  { id: 3, sender: 'Carol White', subject: 'Design Review', preview: 'Please review the new mockups attached...' },
  { id: 4, sender: 'Dave Brown', subject: 'Bug Report', preview: 'Found an issue with the login flow...' },
];

const CARD_KEYS = [
  'domainHistory',
  'listProfile',
  'infrastructure',
  'useCase',
  'ispMix',
  'volumeTarget',
];

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const { messages, loading, intakeComplete, send } = useChat();

  // Intake form state for all 6 dimensions
  const [intakeData, setIntakeData] = useState({
    domainHistory: {},
    listProfile: {},
    infrastructure: {},
    useCase: {},
    ispMix: {},
    volumeTarget: {},
  });

  // Track which cards are visible (revealed by AI conversation)
  const [visibleCards, setVisibleCards] = useState(new Set());

  const updateIntake = useCallback((dimension, data) => {
    setIntakeData((prev) => ({ ...prev, [dimension]: data }));
  }, []);

  // Expose a method to reveal a card (called when AI introduces a dimension)
  const revealCard = useCallback((cardKey) => {
    setVisibleCards((prev) => new Set([...prev, cardKey]));
  }, []);

  // Enhanced send that checks for dimension keywords to reveal cards
  const handleSend = useCallback(
    async (text) => {
      await send(text);

      // Auto-reveal cards based on keywords in conversation
      const lower = text.toLowerCase();
      const dimensionKeywords = {
        domainHistory: ['domain', 'history', 'cold start', 'migration', 'rehab'],
        listProfile: ['list', 'subscribers', 'active', 'dormant', 'profile'],
        infrastructure: ['smtp', 'infrastructure', 'ip', 'spf', 'dkim', 'dmarc'],
        useCase: ['use case', 'industry', 'vertical', 'email type'],
        ispMix: ['isp', 'gmail', 'yahoo', 'outlook', 'mailbox provider'],
        volumeTarget: ['volume', 'target', 'sends per week', 'brand', 'first send'],
      };

      for (const [key, keywords] of Object.entries(dimensionKeywords)) {
        if (keywords.some((kw) => lower.includes(kw))) {
          revealCard(key);
        }
      }
    },
    [send, revealCard]
  );

  // Map card keys to components
  const cardComponents = {
    domainHistory: (
      <DomainHistoryCard
        data={intakeData.domainHistory}
        onChange={(d) => updateIntake('domainHistory', d)}
      />
    ),
    listProfile: (
      <ListProfileCard
        data={intakeData.listProfile}
        onChange={(d) => updateIntake('listProfile', d)}
      />
    ),
    infrastructure: (
      <InfrastructureCard
        data={intakeData.infrastructure}
        onChange={(d) => updateIntake('infrastructure', d)}
      />
    ),
    useCase: (
      <UseCaseCard
        data={intakeData.useCase}
        onChange={(d) => updateIntake('useCase', d)}
      />
    ),
    ispMix: (
      <ISPMixCard
        data={intakeData.ispMix}
        onChange={(d) => updateIntake('ispMix', d)}
      />
    ),
    volumeTarget: (
      <VolumeTargetCard
        data={intakeData.volumeTarget}
        onChange={(d) => updateIntake('volumeTarget', d)}
      />
    ),
  };

  // Build messages with form cards injected
  const enrichedMessages = messages.map((msg, i) => {
    // Check if an AI message mentions a dimension to attach its card
    if (msg.role === 'assistant') {
      const lower = msg.content.toLowerCase();
      const dimensionKeywords = {
        domainHistory: ['domain history', 'cold start', 'migration', 'rehab'],
        listProfile: ['list profile', 'list size', 'subscriber segments'],
        infrastructure: ['infrastructure', 'smtp vendor', 'ip type', 'authentication'],
        useCase: ['use case', 'industry vertical', 'email type'],
        ispMix: ['isp mix', 'mailbox provider', 'gmail', 'isp distribution'],
        volumeTarget: ['volume target', 'sends per week', 'first send date'],
      };

      for (const [key, keywords] of Object.entries(dimensionKeywords)) {
        if (keywords.some((kw) => lower.includes(kw)) && !visibleCards.has(key)) {
          revealCard(key);
        }
      }
    }
    return msg;
  });

  return (
    <div className="h-screen flex">
      <div className="w-[40%] min-w-0">
        <Sidebar items={SAMPLE_ITEMS} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="w-[60%] min-w-0">
        {selectedId ? (
          <ChatPanel
            messages={enrichedMessages}
            onSend={handleSend}
            loading={loading}
          >
            {/* Render visible smart form cards below the chat */}
            {CARD_KEYS.filter((k) => visibleCards.has(k)).map((key) => (
              <div key={key} className="px-2 pb-2">
                {cardComponents[key]}
              </div>
            ))}
            {intakeComplete && (
              <div className="mx-2 mb-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 animate-[slideIn_0.3s_ease-out]">
                Intake complete — generating your warmup plan...
              </div>
            )}
          </ChatPanel>
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
