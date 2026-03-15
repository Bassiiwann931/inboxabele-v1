import { useState, useEffect } from 'react';

const SENDS_PER_WEEK = ['1', '2', '3', '4', '5', '6', '7', 'Daily'];

export default function VolumeTargetCard({ data, onChange }) {
  const [targetVolume, setTargetVolume] = useState(data?.targetVolume || '');
  const [sendsPerWeek, setSendsPerWeek] = useState(data?.sendsPerWeek || '');
  const [firstSendDate, setFirstSendDate] = useState(data?.firstSendDate || '');
  const [brandCount, setBrandCount] = useState(data?.brandCount || 1);

  useEffect(() => {
    onChange({
      targetVolume: Number(targetVolume) || 0,
      sendsPerWeek,
      firstSendDate,
      brandCount,
    });
  }, [targetVolume, sendsPerWeek, firstSendDate, brandCount]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">Volume Target</h3>

      <label className="block text-xs text-gray-500">
        Target volume (emails/send)
        <input
          type="number"
          min="0"
          value={targetVolume}
          onChange={(e) => setTargetVolume(e.target.value)}
          placeholder="e.g. 50000"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block text-xs text-gray-500">
        Sends per week
        <select
          value={sendsPerWeek}
          onChange={(e) => setSendsPerWeek(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select frequency...</option>
          {SENDS_PER_WEEK.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-gray-500">
        First send date
        <input
          type="date"
          value={firstSendDate}
          onChange={(e) => setFirstSendDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <div>
        <span className="text-xs text-gray-500 block mb-1">Brand count</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setBrandCount((c) => Math.max(1, c - 1))}
            className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-lg font-medium transition-colors"
          >
            −
          </button>
          <span className="text-sm font-semibold text-gray-700 w-8 text-center">
            {brandCount}
          </span>
          <button
            type="button"
            onClick={() => setBrandCount((c) => c + 1)}
            className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-lg font-medium transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
