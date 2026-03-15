import { useState, useEffect } from 'react';

const SEGMENTS = [
  { key: 'active30d', label: 'Active 30d' },
  { key: 'active31_90d', label: 'Active 31-90d' },
  { key: 'dormant', label: 'Dormant' },
  { key: 'unknown', label: 'Unknown' },
];

export default function ListProfileCard({ data, onChange }) {
  const [listSize, setListSize] = useState(data?.listSize || '');
  const [segments, setSegments] = useState(
    data?.segments || { active30d: 25, active31_90d: 25, dormant: 25, unknown: 25 }
  );

  const total = Object.values(segments).reduce((a, b) => a + Number(b), 0);
  const isValid = total === 100;

  useEffect(() => {
    onChange({ listSize: Number(listSize) || 0, segments, valid: isValid });
  }, [listSize, segments, isValid]);

  const handleSegment = (key, val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setSegments((s) => ({ ...s, [key]: num }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">List Profile</h3>

      <label className="block text-xs text-gray-500">
        Total list size
        <input
          type="number"
          min="0"
          value={listSize}
          onChange={(e) => setListSize(e.target.value)}
          placeholder="e.g. 100000"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <div className="space-y-3">
        {SEGMENTS.map((seg) => (
          <div key={seg.key}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{seg.label}</span>
              <span>{segments[seg.key]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={segments[seg.key]}
              onChange={(e) => handleSegment(seg.key, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        ))}
      </div>

      <div
        className={`text-xs font-medium text-right ${
          isValid ? 'text-green-600' : 'text-red-500'
        }`}
      >
        Total: {total}% {isValid ? '✓' : '(must equal 100%)'}
      </div>
    </div>
  );
}
