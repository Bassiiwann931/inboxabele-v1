const STEPS = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Business Profile' },
  { id: 3, label: 'Email Patterns' },
  { id: 4, label: 'Goals & Challenges' },
  { id: 5, label: 'Analysis' },
  { id: 6, label: 'Your Strategy' },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full px-4 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium transition-colors duration-300 hidden sm:block ${
                    isCurrent ? 'text-indigo-600' : isCompleted ? 'text-indigo-400' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 mx-1 sm:mx-2 transition-colors duration-500 ${
                    step.id < currentStep ? 'bg-indigo-600 w-6 sm:w-10' : 'bg-gray-200 w-6 sm:w-10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
