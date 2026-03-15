import { useState, useEffect } from 'react';

const INDUSTRIES = [
  'E-commerce', 'SaaS', 'Finance', 'Healthcare', 'Education',
  'Media', 'Travel', 'Non-profit', 'Real Estate', 'Other',
];

const EMAIL_TYPES = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'mixed', label: 'Mixed' },
];

export default function UseCaseCard({ data, onChange }) {
  const [industries, setIndustries] = useState(data?.industries || []);
  const [emailType, setEmailType] = useState(data?.emailType || '');

  useEffect(() => {
    onChange({ industries, emailType });
  }, [industries, emailType]);

  const toggleIndustry = (ind) => {
    setIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">Use Case</h3>

      <div>
        <span className="text-xs text-gray-500 block mb-2">Industry Vertical</span>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => toggleIndustry(ind)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                industries.includes(ind)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs text-gray-500">Email Type</legend>
        <div className="flex gap-4">
          {EMAIL_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="emailType"
                value={t.value}
                checked={emailType === t.value}
                onChange={(e) => setEmailType(e.target.value)}
                className="accent-blue-500"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
