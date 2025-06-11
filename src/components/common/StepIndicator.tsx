interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav className="flex justify-center">
      <ol className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  index < currentStep
                    ? 'bg-blue-600 text-white'
                    : index === currentStep
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="ml-4 h-0.5 w-8 bg-gray-200 sm:w-12" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 