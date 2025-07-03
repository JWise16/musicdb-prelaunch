interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  className = "" 
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full bg-gradient-to-r from-gray-400 to-black transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
    </div>
  )
} 