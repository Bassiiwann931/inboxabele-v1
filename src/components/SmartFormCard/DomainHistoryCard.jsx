import { useState } from 'react';

const DOMAIN_TYPES = [
  { value: 'cold_start', label: 'Cold Start' },
  { value: 'migration', label: 'Migration' },
  { value: 'rehab', label: 'Rehab' },
];

export default function DomainHistoryCard({ data, onChange }) {
  const [selected, setSelected] = useState(data?.domainType || '');

  const update = (patch) => {
    const next = { ...data, ...patch };
    onChange(next);
  };

  const handleSelect = (value) => {
    setSelected(value);
    update({ domainType: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">Domain History</h3>

      <div className="flex gap-2">
        {DOMAIN_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSelect(t.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
              selected === t.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {selected === 'cold_start' && (
        <div className="space-y-3 animate-[slideIn_0.2s_ease-out]">
          <label className="block text-xs text-gray-500">
            Domain name
            <input
              type="text"
              value={data?.domainName || ''}
              onChange={(e) => update({ domainName: e.target.value })}
              placeholder="e.g. mail.example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block text-xs text-gray-500">
            Domain age (days)
            <input
              type="number"
              min="0"
              value={data?.domainAge || ''}
              onChange={(e) => update({ domainAge: e.target.value })}
              placeholder="0"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      )}

      {selected === 'migration' && (
        <div className="space-y-3 animate-[slideIn_0.2s_ease-out]">
          <label className="block text-xs text-gray-500">
            Previous ESP / platform
            <input
              type="text"
              value={data?.previousEsp || ''}
              onChange={(e) => update({ previousEsp: e.target.value })}
              placeholder="e.g. Mailchimp, SendGrid"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block text-xs text-gray-500">
            Current sending reputation (1-10)
            <input
              type="number"
              min="1"
              max="10"
              value={data?.reputation || ''}
              onChange={(e) => update({ reputation: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      )}

      {selected === 'rehab' && (
        <div className="space-y-3 animate-[slideIn_0.2s_ease-out]">
          <label className="block text-xs text-gray-500">
            Reason for rehab
            <select
              value={data?.rehabReason || ''}
              onChange={(e) => update({ rehabReason: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="blocklist">Blocklist hit</option>
              <option value="spam_trap">Spam trap hits</option>
              <option value="bounce_spike">Bounce spike</option>
              <option value="complaint_spike">Complaint spike</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block text-xs text-gray-500">
            How long has reputation been damaged?
            <input
              type="text"
              value={data?.damageDuration || ''}
              onChange={(e) => update({ damageDuration: e.target.value })}
              placeholder="e.g. 2 weeks, 3 months"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      )}
    </div>
  );
}
