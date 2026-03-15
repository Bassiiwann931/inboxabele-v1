import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageThread from './components/MessageThread';
import ProgressBar from './components/ProgressBar';
import { TimeoutError, IncompleteIntakeWarning, PlanGenerationError } from './components/ErrorBanner';
import { useChat } from './hooks/useChat';
import { sendMessage } from './utils/api';

const SAMPLE_ITEMS = [
  { id: 1, sender: 'TechCorp Inc.', subject: 'Q4 Email Strategy', preview: 'Prioritization rules, automation workflows...' },
  { id: 2, sender: 'RetailBrand', subject: 'Holiday Campaign Plan', preview: 'High-volume seasonal inbox management...' },
  { id: 3, sender: 'SaaS Co.', subject: 'Onboarding Series', preview: 'Transactional & lifecycle email strategy...' },
];

const INDUSTRIES = ['E-commerce', 'SaaS / Software', 'Media & Publishing', 'Financial Services', 'Healthcare', 'Retail', 'Education', 'Other'];
const EMAIL_TYPES = ['Newsletters', 'Transactional', 'Marketing Campaigns', 'Customer Support', 'Onboarding', 'Re-engagement'];
const PAIN_POINTS = ['Too much volume to manage', 'Missing important emails', 'Poor categorization', 'Slow response times', 'No automation', 'Team collaboration issues'];

function parsePlanSections(plan) {
  if (!plan) return [];
  const sections = plan.split(/(?=^## )/m).filter(Boolean);
  return sections.length > 1 ? sections : [plan];
}

function buildSystemPrompt() {
  return 'You are an expert email deliverability and inbox management consultant for Ongage, a leading email marketing platform. Generate structured, actionable inbox management strategies. Always use ## headers for each section.';
}

function buildPlanPrompt(formData) {
  return `Generate a comprehensive inbox management strategy for the following client:

**Business:** ${formData.businessName || 'Not specified'}
**Industry:** ${formData.industry || 'Not specified'}
**Team Size:** ${formData.teamSize || 'Not specified'}
**Daily Email Volume:** ${formData.dailyVolume || 'Not specified'}
**Email Types:** ${formData.emailTypes.length ? formData.emailTypes.join(', ') : 'Not specified'}
**Current Tools:** ${formData.currentTools || 'Not specified'}
**Primary Goal:** ${formData.primaryGoal || 'Not specified'}
**Key Challenges:** ${formData.painPoints.length ? formData.painPoints.join(', ') : 'Not specified'}
**Additional Context:** ${formData.additionalContext || 'None'}

Create a detailed strategy with exactly 6 sections using ## headers:
## 1. Prioritization Framework
## 2. Categorization & Labeling System
## 3. Automation Opportunities
## 4. Response Time Targets
## 5. Team Workflows
## 6. Key Metrics & KPIs

Make each section practical and specific to their situation.`;
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'main'
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState([]);
  const [error, setError] = useState(null); // null | 'timeout' | 'incomplete' | 'plan-failure'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    teamSize: '',
    dailyVolume: '',
    emailTypes: [],
    currentTools: '',
    primaryGoal: '',
    painPoints: [],
    additionalContext: '',
  });

  const { messages, loading, error: chatError, send, reset: resetChat } = useChat();

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors([]);
    setError(null);
  };

  const toggleArray = (field, value) => {
    setFormData((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
    setFormErrors([]);
  };

  const validateStep = () => {
    const missing = [];
    if (currentStep === 2) {
      if (!formData.businessName.trim()) missing.push('Business name');
      if (!formData.industry) missing.push('Industry');
      if (!formData.teamSize) missing.push('Team size');
    }
    if (currentStep === 3) {
      if (!formData.dailyVolume) missing.push('Daily email volume');
      if (!formData.emailTypes.length) missing.push('At least one email type');
    }
    if (currentStep === 4) {
      if (!formData.primaryGoal) missing.push('Primary goal');
    }
    return missing;
  };

  const nextStep = () => {
    const missing = validateStep();
    if (missing.length) {
      setFormErrors(missing);
      setError('incomplete');
      return;
    }
    setError(null);
    setFormErrors([]);
    if (currentStep === 4) {
      generatePlan();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const backStep = () => {
    setError(null);
    setFormErrors([]);
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const generatePlan = async () => {
    setCurrentStep(5);
    setIsGenerating(true);
    setError(null);
    try {
      const response = await sendMessage(
        [{ role: 'user', content: buildPlanPrompt(formData) }],
        buildSystemPrompt(),
        25000
      );
      const plan = response.content?.[0]?.text || '';
      setGeneratedPlan(plan);
      setCurrentStep(6);
    } catch (err) {
      if (err.message === 'TIMEOUT') {
        setError('timeout');
      } else {
        setError('plan-failure');
      }
      setCurrentStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const startOver = () => {
    setCurrentStep(1);
    setSelectedId(null);
    setError(null);
    setFormErrors([]);
    setGeneratedPlan(null);
    setIsGenerating(false);
    setFormData({
      businessName: '',
      industry: '',
      teamSize: '',
      dailyVolume: '',
      emailTypes: [],
      currentTools: '',
      primaryGoal: '',
      additionalContext: '',
      painPoints: [],
    });
    resetChat();
    setMobileView('sidebar');
  };

  const handleSelectItem = (id) => {
    setSelectedId(id);
    setMobileView('main');
  };

  const isIntakeMode = selectedId === null;

  // ─── Step renderers ──────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-slide-in">
      <div className="w-16 h-16 rounded-2xl bg-indigo-700 flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white font-black text-2xl">O</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Inbox Strategy Generator</h1>
      <p className="text-gray-500 max-w-md mb-2">
        Answer a few questions about your email program and we&apos;ll generate a tailored inbox management strategy — powered by AI.
      </p>
      <p className="text-xs text-indigo-600 font-medium mb-8">By Ongage · Takes about 2 minutes</p>
      <button
        onClick={() => setCurrentStep(2)}
        className="px-8 py-3 rounded-xl bg-indigo-700 text-white font-semibold text-base hover:bg-indigo-800 active:bg-indigo-900 transition-all shadow-md hover:shadow-lg"
      >
        Get Started →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <div className="w-full max-w-lg animate-slide-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Business Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us about your organization.</p>

          {error === 'incomplete' && <div className="mb-4"><IncompleteIntakeWarning missingFields={formErrors} /></div>}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => updateForm('businessName', e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry <span className="text-red-500">*</span></label>
              <select
                value={formData.industry}
                onChange={(e) => updateForm('industry', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Select industry…</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['1–5', '6–20', '21–100', '100+'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateForm('teamSize', size)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.teamSize === size
                        ? 'bg-indigo-700 border-indigo-700 text-white shadow-sm'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={backStep} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">← Back</button>
            <button onClick={nextStep} className="px-6 py-2.5 rounded-lg bg-indigo-700 text-white text-sm font-semibold hover:bg-indigo-800 transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <div className="w-full max-w-lg animate-slide-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Email Patterns</h2>
          <p className="text-sm text-gray-500 mb-6">Help us understand your email volume and types.</p>

          {error === 'incomplete' && <div className="mb-4"><IncompleteIntakeWarning missingFields={formErrors} /></div>}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Email Volume <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['< 100', '100–500', '500–5K', '5K+'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateForm('dailyVolume', v)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.dailyVolume === v
                        ? 'bg-indigo-700 border-indigo-700 text-white shadow-sm'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Types <span className="text-red-500">*</span> <span className="font-normal text-gray-400">(select all that apply)</span></label>
              <div className="grid grid-cols-2 gap-2">
                {EMAIL_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleArray('emailTypes', t)}
                    className={`py-2 px-3 rounded-lg border text-sm text-left transition-all ${
                      formData.emailTypes.includes(t)
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800 font-medium'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    {formData.emailTypes.includes(t) ? '✓ ' : ''}{t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Tools <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={formData.currentTools}
                onChange={(e) => updateForm('currentTools', e.target.value)}
                placeholder="e.g. Gmail, Outlook, HubSpot..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={backStep} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">← Back</button>
            <button onClick={nextStep} className="px-6 py-2.5 rounded-lg bg-indigo-700 text-white text-sm font-semibold hover:bg-indigo-800 transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <div className="w-full max-w-lg animate-slide-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Goals &amp; Challenges</h2>
          <p className="text-sm text-gray-500 mb-6">What are you trying to achieve?</p>

          {error === 'incomplete' && <div className="mb-4"><IncompleteIntakeWarning missingFields={formErrors} /></div>}
          {error === 'timeout' && <div className="mb-4"><TimeoutError onRetry={generatePlan} /></div>}
          {error === 'plan-failure' && <div className="mb-4"><PlanGenerationError onRetry={generatePlan} /></div>}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {[
                  { value: 'inbox-zero', label: 'Achieve inbox zero', desc: 'Clear backlog, maintain empty inbox' },
                  { value: 'organization', label: 'Better organization', desc: 'Systematic categorization & labeling' },
                  { value: 'prioritization', label: 'Smart prioritization', desc: 'Focus on what matters most first' },
                  { value: 'automation', label: 'Automate workflows', desc: 'Reduce manual handling & routing' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateForm('primaryGoal', value)}
                    className={`w-full flex items-start gap-3 py-3 px-4 rounded-lg border text-left transition-all ${
                      formData.primaryGoal === value
                        ? 'bg-indigo-50 border-indigo-500'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      formData.primaryGoal === value ? 'border-indigo-600' : 'border-gray-400'
                    }`}>
                      {formData.primaryGoal === value && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Challenges <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {PAIN_POINTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleArray('painPoints', p)}
                    className={`py-2 px-3 rounded-lg border text-xs text-left transition-all ${
                      formData.painPoints.includes(p)
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-orange-200'
                    }`}
                  >
                    {formData.painPoints.includes(p) ? '✓ ' : ''}{p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Context <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                rows={3}
                value={formData.additionalContext}
                onChange={(e) => updateForm('additionalContext', e.target.value)}
                placeholder="Anything else we should know about your email program..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={backStep} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">← Back</button>
            <button
              onClick={nextStep}
              className="px-6 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:bg-orange-700 transition-colors shadow-sm"
            >
              Generate Strategy ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-xl">✨</span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Generating Your Strategy</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Our AI is analyzing your inbox profile and building a tailored strategy…
      </p>
      <div className="mt-6 flex flex-col gap-1 text-xs text-gray-400">
        <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>Analyzing email patterns…</p>
        <p className="animate-fade-in" style={{ animationDelay: '1.5s' }}>Building prioritization rules…</p>
        <p className="animate-fade-in" style={{ animationDelay: '3s' }}>Crafting automation workflows…</p>
      </div>
    </div>
  );

  const renderStep6 = () => {
    const sections = parsePlanSections(generatedPlan);
    return (
      <div className="flex flex-col h-full">
        {/* Plan header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Your Inbox Strategy</h2>
            <p className="text-xs text-gray-500">{formData.businessName || 'Custom'} · Generated by Ongage AI</p>
          </div>
          <button
            onClick={startOver}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </div>
        {/* Scrollable plan content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {sections.map((section, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-slide-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {section}
                </div>
              </div>
            ))}
            <div className="animate-slide-in text-center py-4" style={{ animationDelay: `${sections.length * 100}ms` }}>
              <div className="inline-flex items-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Strategy generated by Ongage AI · {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (selectedId) {
      return (
        <div className="h-full flex flex-col">
          {/* Mobile back button */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white md:hidden">
            <button
              onClick={() => setMobileView('sidebar')}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {chatError === 'timeout' && (
              <div className="ml-4 flex-1">
                <TimeoutError onRetry={() => {}} />
              </div>
            )}
          </div>
          <MessageThread messages={messages} onSend={send} loading={loading} />
        </div>
      );
    }

    // Intake wizard
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  const showProgressBar = isIntakeMode && currentStep > 1 && currentStep <= 6;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Progress bar (intake only) */}
      {showProgressBar && <ProgressBar currentStep={currentStep} />}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar — hidden on mobile when main is active */}
        <div
          className={`w-full md:w-[40%] md:block shrink-0 ${
            mobileView === 'main' ? 'hidden' : 'block'
          }`}
        >
          <Sidebar
            items={SAMPLE_ITEMS}
            selectedId={selectedId}
            onSelect={handleSelectItem}
            onStartOver={startOver}
            onOpenMain={isIntakeMode && currentStep > 1 ? () => setMobileView('main') : null}
          />
        </div>

        {/* Main content — hidden on mobile when sidebar is active */}
        <div
          className={`flex-1 min-w-0 overflow-hidden ${
            mobileView === 'sidebar' ? 'hidden md:flex md:flex-col' : 'flex flex-col'
          }`}
        >
          {/* Mobile back-to-sidebar header (intake mode) */}
          {isIntakeMode && mobileView === 'main' && (
            <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white md:hidden shrink-0">
              <button
                onClick={() => setMobileView('sidebar')}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Menu
              </button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">{renderMainContent()}</div>
        </div>
      </div>
    </div>
  );
}
