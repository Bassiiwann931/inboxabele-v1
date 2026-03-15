import InboxList from './InboxList';

export default function Sidebar({ items, selectedId, onSelect }) {
  return (
    <aside className="h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Inboxable</h1>
      </div>
      <InboxList items={items} selectedId={selectedId} onSelect={onSelect} />
    </aside>
  );
}
