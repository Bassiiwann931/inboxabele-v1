export function TimeoutError({ onRetry }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-slide-in">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-800">Request timed out</p>
          <p className="text-sm text-amber-700 mt-0.5">
            The API is taking longer than expected. Please check your connection and try again.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-amber-800 underline hover:text-amber-900 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function IncompleteIntakeWarning({ missingFields = [] }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-slide-in">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-yellow-800">Incomplete information</p>
          <p className="text-sm text-yellow-700 mt-0.5">
            Please fill in all required fields before continuing.
          </p>
          {missingFields.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {missingFields.map((f) => (
                <li key={f} className="text-sm text-yellow-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanGenerationError({ onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-in">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">Plan generation failed</p>
          <p className="text-sm text-red-700 mt-0.5">
            We couldn&apos;t generate your inbox strategy. This may be a temporary issue.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 active:bg-red-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
