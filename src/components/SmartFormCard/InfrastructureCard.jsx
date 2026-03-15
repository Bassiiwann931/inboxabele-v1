import { useState, useEffect } from 'react';

const SMTP_VENDORS = [
  'SendGrid', 'Mailgun', 'Amazon SES', 'Postmark', 'SparkPost',
  'Mandrill', 'SMTP2GO', 'Elastic Email', 'Other',
];

const IP_TYPES = [
  { value: 'dedicated', label: 'Dedicated' },
  { value: 'shared', label: 'Shared' },
  { value: 'mixed', label: 'Mixed' },
];

const AUTH_OPTIONS = [
  { key: 'spf', label: 'SPF' },
  { key: 'dkim', label: 'DKIM' },
  { key: 'dmarc', label: 'DMARC' },
];

export default function InfrastructureCard({ data, onChange }) {
  const [vendor, setVendor] = useState(data?.vendor || '');
  const [ipType, setIpType] = useState(data?.ipType || '');
  const [auth, setAuth] = useState(data?.auth || { spf: false, dkim: false, dmarc: false });

  useEffect(() => {
    onChange({ vendor, ipType, auth });
  }, [vendor, ipType, auth]);

  const toggleAuth = (key) => {
    setAuth((a) => ({ ...a, [key]: !a[key] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h3 className="text-sm font-semibold text-gray-700">Infrastructure</h3>

      <label className="block text-xs text-gray-500">
        SMTP Vendor
        <select
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select vendor...</option>
          {SMTP_VENDORS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="text-xs text-gray-500">IP Type</legend>
        <div className="flex gap-4">
          {IP_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="ipType"
                value={t.value}
                checked={ipType === t.value}
                onChange={(e) => setIpType(e.target.value)}
                className="accent-blue-500"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs text-gray-500">Authentication</legend>
        <div className="flex gap-4">
          {AUTH_OPTIONS.map((opt) => (
            <label key={opt.key} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={auth[opt.key]}
                onChange={() => toggleAuth(opt.key)}
                className="accent-blue-500 rounded"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
