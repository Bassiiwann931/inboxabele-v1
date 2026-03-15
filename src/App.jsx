import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MessageThread from './components/MessageThread';
import { useChat } from './hooks/useChat';
import { calculateVolume } from './utils/volumeCalculator';
import { sendMessage } from './utils/api';

const SAMPLE_ITEMS = [
  { id: 1, sender: 'Alice Johnson', subject: 'Project Update', preview: 'Here are the latest changes to the dashboard...' },
  { id: 2, sender: 'Bob Smith', subject: 'Meeting Notes', preview: 'Summary from today\'s standup meeting...' },
  { id: 3, sender: 'Carol White', subject: 'Design Review', preview: 'Please review the new mockups attached...' },
  { id: 4, sender: 'Dave Brown', subject: 'Bug Report', preview: 'Found an issue with the login flow...' },
];

const PLAN_GENERATION_SYSTEM_PROMPT = `You are an expert email deliverability strategist.
Given an intake JSON and a pre-calculated volume schedule, generate a structured warmup/migration plan.
You MUST respond with a single valid JSON object matching this schema exactly:

{
  "planType": string,
  "totalListSize": number,
  "engagementRate": number,
  "targetVolume": number,
  "durationDays": number,
  "schedule": [{ "day": number, "dailyVolume": number, "phase": string, "segments": array, "throttleHours": number }],
  "summary": string,
  "recommendations": [string],
  "riskFlags": [string],
  "estimatedInboxRate": number
}

Do not include any explanation text outside the JSON. Do not wrap it in markdown fences.`;

// Validate a generated plan against the expected schema
function validatePlan(plan) {
  const required = ['planType', 'totalListSize', 'engagementRate', 'targetVolume', 'durationDays', 'schedule', 'summary', 'recommendations'];
  for (const key of required) {
    if (!(key in plan)) throw new Error(`Missing field: ${key}`);
  }
  if (!Array.isArray(plan.schedule) || plan.schedule.length === 0) {
    throw new Error('schedule must be a non-empty array');
  }
  for (const entry of plan.schedule) {
    const entryRequired = ['day', 'dailyVolume', 'phase', 'segments', 'throttleHours'];
    for (const k of entryRequired) {
      if (!(k in entry)) throw new Error(`Schedule entry missing field: ${k}`);
    }
  }
  return true;
}

// Strip ```json ... ``` fences from AI output and parse JSON
function parseJsonResponse(text) {
  const stripped = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
  return JSON.parse(stripped);
}

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);

  const handleIntakeComplete = useCallback(async (intakeJson) => {
    setPlanLoading(true);
    setPlanError(null);
    setGeneratedPlan(null);

    try {
      const schedule = calculateVolume(intakeJson);

      const userContent = `Intake JSON:\n${JSON.stringify(intakeJson, null, 2)}\n\nPre-calculated Schedule:\n${JSON.stringify(schedule, null, 2)}`;

      const response = await sendMessage(
        [{ role: 'user', content: userContent }],
        PLAN_GENERATION_SYSTEM_PROMPT
      );

      const rawText = response.content?.[0]?.text;
      if (!rawText) throw new Error('Empty response from AI');

      const plan = parseJsonResponse(rawText);

      // Merge the pre-calculated schedule into the plan to ensure correctness
      plan.schedule = schedule;

      validatePlan(plan);
      setGeneratedPlan(plan);
    } catch (err) {
      setPlanError(`Plan generation failed: ${err.message}`);
    } finally {
      setPlanLoading(false);
    }
  }, []);

  const { messages, loading, send } = useChat({ onIntakeComplete: handleIntakeComplete });

  return (
    <div className="h-screen flex">
      <div className="w-[40%] min-w-0">
        <Sidebar items={SAMPLE_ITEMS} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="w-[60%] min-w-0 flex flex-col">
        {selectedId ? (
          <>
            <MessageThread messages={messages} onSend={send} loading={loading} />
            {planLoading && (
              <div className="p-3 text-sm text-blue-600 border-t border-gray-200">
                Generating warmup plan...
              </div>
            )}
            {planError && (
              <div className="p-3 text-sm text-red-600 border-t border-gray-200">
                {planError}
              </div>
            )}
            {generatedPlan && !planLoading && (
              <div className="p-3 text-sm text-green-600 border-t border-gray-200">
                Plan generated: {generatedPlan.planType} — {generatedPlan.schedule.length} days, target {generatedPlan.targetVolume.toLocaleString()} sends/day
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to get started
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
