import InboxList from './InboxList';

export default function Sidebar({ items, selectedId, onSelect, onStartOver, onOpenMain }) {
  return (
    <aside className="h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Ongage brand header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-indigo-700">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
          <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">O</span>
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">Ongage</span>
            <span className="text-indigo-300 text-xs block leading-none">Inbox Strategy</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Strategies</p>
      </div>

      <InboxList items={items} selectedId={selectedId} onSelect={onSelect} />

      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Start Over button */}
        <button
          onClick={onStartOver}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-400 active:bg-indigo-100 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Over
        </button>

        {/* Mobile: open main panel */}
        {onOpenMain && (
          <button
            onClick={onOpenMain}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 text-white text-sm font-medium hover:bg-indigo-800 active:bg-indigo-900 transition-colors md:hidden"
          >
            <span>View Strategy</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
