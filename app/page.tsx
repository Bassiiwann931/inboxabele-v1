"use client";

import { useState } from "react";
import WarmupForm from "@/components/WarmupForm";
import WarmupResults from "@/components/WarmupResults";
import { WarmupStrategy } from "@/types/warmup";

export default function Home() {
  const [strategy, setStrategy] = useState<WarmupStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setStrategy(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030d1a" }}>
      {/* Header */}
      <header className="border-b border-blue-900/40" style={{ backgroundColor: "#071428" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Email Warmup Generator</h1>
              <p className="text-blue-400 text-xs font-medium">AI-Powered Deliverability Strategy</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!strategy && !isLoading && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Build Your Warmup Strategy
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Fill in your sending profile and get a customized, week-by-week warmup plan
              from our AI deliverability consultant — powered by Claude.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-900 rounded-full" />
              <div className="w-20 h-20 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Analyzing your profile...</p>
              <p className="text-slate-400 text-sm mt-1">Claude is crafting your personalized warmup strategy</p>
            </div>
          </div>
        )}

        {!isLoading && !strategy && (
          <WarmupForm
            onResult={setStrategy}
            onLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}

        {!isLoading && strategy && (
          <WarmupResults strategy={strategy} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 text-sm">
            Powered by Claude · Email Warmup Strategy Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
