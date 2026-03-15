export default function InboxItem({ item, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
      }`}
    >
      <p className="font-medium text-sm text-gray-900 truncate">{item.sender}</p>
      <p className="text-sm text-gray-700 truncate">{item.subject}</p>
      <p className="text-xs text-gray-400 truncate mt-1">{item.preview}</p>
    </div>
  );
}
