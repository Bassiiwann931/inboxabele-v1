import InboxItem from './InboxItem';

export default function InboxList({ items, selectedId, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {items.map((item) => (
        <InboxItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}
