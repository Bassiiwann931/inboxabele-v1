"use client";

import { WarmupStrategy } from "@/types/warmup";

interface WarmupResultsProps {
  strategy: WarmupStrategy;
  onReset: () => void;
}

export default function WarmupResults({ strategy, onReset }: WarmupResultsProps) {
  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-gradient-to-br from-blue-900/60 to-[#071428] border border-blue-700/50 rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-400 text-sm font-medium uppercase tracking-wider">Warmup Strategy Generated</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Your Personalized Plan</h2>
          </div>
          <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/40 rounded-full px-4 py-2 self-start">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-300 font-semibold text-sm">{strategy.duration}</span>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed text-base">{strategy.summary}</p>
      </div>

      {/* Key Rules */}
      {strategy.keyRules && strategy.keyRules.length > 0 && (
        <div className="bg-[#071428] border border-blue-900/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Key Rules
          </h3>
          <ul className="space-y-2">
            {strategy.keyRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-900/60 border border-blue-700/50 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Week-by-Week Plan */}
      {strategy.weeklyPlan && strategy.weeklyPlan.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly Warmup Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {strategy.weeklyPlan.map((week) => (
              <div
                key={week.week}
                className="bg-[#071428] border border-blue-900/50 rounded-xl p-5 hover:border-blue-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Week {week.week}
                  </span>
                  <span className="text-green-400 text-sm font-medium">
                    {week.minOpenRate}%+ opens
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Daily Volume</span>
                    <span className="text-white font-semibold">{week.dailyVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Weekly Total</span>
                    <span className="text-white font-semibold">{week.totalVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Segments</span>
                    <span className="text-blue-300 text-right max-w-[60%] leading-tight">{week.segments}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed border-t border-blue-900/40 pt-3">
                  {week.focus}
                </p>
                {week.warning && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2">
                    <svg className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-300 text-xs leading-relaxed">{week.warning}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISP Tips */}
      {strategy.ispTips && (
        <div className="bg-[#071428] border border-blue-900/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ISP-Specific Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "gmail", label: "Gmail", color: "text-red-400", bgColor: "bg-red-900/10 border-red-900/30" },
              { key: "outlook", label: "Outlook / Microsoft", color: "text-sky-400", bgColor: "bg-sky-900/10 border-sky-900/30" },
              { key: "yahoo", label: "Yahoo / AOL", color: "text-purple-400", bgColor: "bg-purple-900/10 border-purple-900/30" },
            ].map(({ key, label, color, bgColor }) => (
              <div key={key} className={`border rounded-lg p-4 ${bgColor}`}>
                <h4 className={`font-semibold text-sm mb-2 ${color}`}>{label}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {strategy.ispTips[key as keyof typeof strategy.ispTips]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags & Success Metrics side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Flags */}
        {strategy.redFlags && strategy.redFlags.length > 0 && (
          <div className="bg-[#071428] border border-red-900/40 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Red Flags to Watch
            </h3>
            <ul className="space-y-2">
              {strategy.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                  <span className="text-slate-300">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Metrics */}
        {strategy.successMetrics && strategy.successMetrics.length > 0 && (
          <div className="bg-[#071428] border border-green-900/40 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Success Metrics
            </h3>
            <ul className="space-y-2">
              {strategy.successMetrics.map((metric, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                  <span className="text-slate-300">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="py-3 px-8 bg-transparent border border-blue-700 hover:bg-blue-900/30 text-blue-300 font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate New Strategy
        </button>
      </div>
    </div>
  );
}
