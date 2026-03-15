import { useState, useEffect } from 'react';

const ISP_FIELDS = [
  { key: 'gmail', label: 'Gmail' },
  { key: 'yahoo', label: 'Yahoo' },
  { key: 'outlook', label: 'Outlook' },
  { key: 'apple', label: 'Apple' },
  { key: 'b2b', label: 'B2B' },
  { key: 'other', label: 'Other' },
];

export default function ISPMixCard({ data, onChange }) {
  const [mix, setMix] = useState(
    data?.mix || { gmail: 0, yahoo: 0, outlook: 0, apple: 0, b2b: 0, other: 0 }
  );

  const total = Object.values(mix).reduce((a, b) => a + Number(b), 0);
  const isValid = total === 100;

  useEffect(() => {
    onChange({ mix, valid: isValid });
  }, [mix, isValid]);

  const handleChange = (key, val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setMix((m) => ({ ...m, [key]: num }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">ISP Mix</h3>

      <div className="grid grid-cols-2 gap-3">
        {ISP_FIELDS.map((f) => (
          <label key={f.key} className="block text-xs text-gray-500">
            {f.label}
            <div className="mt-1 flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={mix[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>
          </label>
        ))}
      </div>

      {/* Live validation bar */}
      <div className="space-y-1">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              isValid ? 'bg-green-500' : total > 100 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(total, 100)}%` }}
          />
        </div>
        <div
          className={`text-xs font-medium text-right ${
            isValid ? 'text-green-600' : 'text-red-500'
          }`}
        >
          Total: {total}% {isValid ? '✓' : '(must equal 100%)'}
        </div>
      </div>
    </div>
  );
}
