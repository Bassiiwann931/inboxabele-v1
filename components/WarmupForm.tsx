"use client";

import { useState } from "react";
import { WarmupFormData, WarmupStrategy } from "@/types/warmup";

interface WarmupFormProps {
  onResult: (strategy: WarmupStrategy) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const initialFormData: WarmupFormData = {
  domainHistory: "",
  listSize: "",
  listAge: "",
  engagementLevel: "",
  esp: "",
  dailyVolumeTarget: "",
  useCase: "",
  industry: "",
  ispMix: "",
  previousIssues: "",
};

export default function WarmupForm({ onResult, onLoading, isLoading }: WarmupFormProps) {
  const [formData, setFormData] = useState<WarmupFormData>(initialFormData);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const required = [
      "domainHistory",
      "listSize",
      "listAge",
      "engagementLevel",
      "esp",
      "dailyVolumeTarget",
      "useCase",
      "industry",
      "ispMix",
    ] as const;

    for (const field of required) {
      if (!formData[field]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    onLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate strategy");
      }

      onResult(data.strategy);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      onLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#0c1e3a] border border-blue-900 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "block text-sm font-medium text-blue-300 mb-1.5";
  const sectionClass = "bg-[#071428] border border-blue-900/50 rounded-xl p-6";
  const sectionTitleClass = "text-lg font-semibold text-white mb-4 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Domain & IP History */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Domain &amp; IP History
        </h3>
        <div>
          <label className={labelClass}>Warmup Scenario *</label>
          <select
            name="domainHistory"
            value={formData.domainHistory}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select scenario...</option>
            <option value="Cold Start">Cold Start – Brand new domain/IP</option>
            <option value="Migration">Migration – Moving to new ESP or IP pool</option>
            <option value="Rehab">Rehab – Recovering from deliverability issues</option>
          </select>
        </div>
      </div>

      {/* Section 2: List Profile */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          List Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Total List Size *</label>
            <input
              type="number"
              name="listSize"
              value={formData.listSize}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className={inputClass}
              min="1"
              required
            />
          </div>
          <div>
            <label className={labelClass}>List Age *</label>
            <input
              type="text"
              name="listAge"
              value={formData.listAge}
              onChange={handleChange}
              placeholder="e.g. 2 years, 6 months"
              className={inputClass}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Engagement Level *</label>
            <select
              name="engagementLevel"
              value={formData.engagementLevel}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select engagement level...</option>
              <option value="Very High">Very High – 40%+ open rates</option>
              <option value="High">High – 25–40% open rates</option>
              <option value="Medium">Medium – 15–25% open rates</option>
              <option value="Low">Low – Under 15% open rates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Sending Infrastructure */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
          Sending Infrastructure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email Service Provider (ESP) *</label>
            <select
              name="esp"
              value={formData.esp}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select ESP...</option>
              <option value="SendGrid">SendGrid</option>
              <option value="Mailchimp">Mailchimp</option>
              <option value="Amazon SES">Amazon SES</option>
              <option value="Klaviyo">Klaviyo</option>
              <option value="HubSpot">HubSpot</option>
              <option value="Postmark">Postmark</option>
              <option value="Mailgun">Mailgun</option>
              <option value="ActiveCampaign">ActiveCampaign</option>
              <option value="Brevo (Sendinblue)">Brevo (Sendinblue)</option>
              <option value="Custom SMTP">Custom SMTP / Self-hosted</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Daily Volume Target *</label>
            <input
              type="number"
              name="dailyVolumeTarget"
              value={formData.dailyVolumeTarget}
              onChange={handleChange}
              placeholder="e.g. 10000"
              className={inputClass}
              min="1"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 4: Use Case & Industry */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
          Use Case &amp; Industry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Use Case *</label>
            <select
              name="useCase"
              value={formData.useCase}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select use case...</option>
              <option value="Marketing / Promotional">Marketing / Promotional</option>
              <option value="Newsletter">Newsletter</option>
              <option value="Transactional">Transactional</option>
              <option value="Onboarding / Lifecycle">Onboarding / Lifecycle</option>
              <option value="Re-engagement">Re-engagement</option>
              <option value="B2B Outbound">B2B Outbound Sales</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Industry *</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select industry...</option>
              <option value="E-commerce / Retail">E-commerce / Retail</option>
              <option value="SaaS / Technology">SaaS / Technology</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Media / Publishing">Media / Publishing</option>
              <option value="Travel & Hospitality">Travel &amp; Hospitality</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Agency">Agency / Marketing Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 5: ISP Mix */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
          ISP Mix
        </h3>
        <div>
          <label className={labelClass}>Primary Recipient ISP Distribution *</label>
          <select
            name="ispMix"
            value={formData.ispMix}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select ISP mix...</option>
            <option value="Gmail-heavy">Gmail-heavy (60%+ Gmail)</option>
            <option value="Outlook B2B">Outlook B2B (Majority corporate Outlook)</option>
            <option value="Yahoo">Yahoo-heavy (40%+ Yahoo/AOL)</option>
            <option value="Mixed">Mixed (Balanced across providers)</option>
            <option value="International">International (Non-US dominant)</option>
          </select>
        </div>
      </div>

      {/* Section 6: Previous Issues */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">6</span>
          Previous Issues
          <span className="text-sm font-normal text-slate-500 ml-1">(Optional)</span>
        </h3>
        <div>
          <label className={labelClass}>Describe any past deliverability problems</label>
          <textarea
            name="previousIssues"
            value={formData.previousIssues}
            onChange={handleChange}
            placeholder="e.g. High spam complaint rates, blacklisted IPs, sudden drop in open rates, bounced from Gmail bulk folder..."
            className={`${inputClass} resize-none`}
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Strategy...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Warmup Strategy
          </>
        )}
      </button>
    </form>
  );
}
