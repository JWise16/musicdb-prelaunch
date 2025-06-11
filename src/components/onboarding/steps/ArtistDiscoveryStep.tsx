import { useFormContext } from 'react-hook-form'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { ChangeEvent } from 'react'

interface StepProps {
  onPrevious: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onBackToHome?: () => void
}

const discoveryOptions = [
  { id: 'social', label: 'Social Media' },
  { id: 'agent', label: 'Agent' },
  { id: 'word', label: 'Word of Mouth' },
  { id: 'platform', label: 'Booking Platform' },
  { id: 'other', label: 'Other (please specify)' },
]

export const ArtistDiscoveryStep: React.FC<StepProps> = ({ 
  onPrevious, 
  onNext,
  isFirst, 
  isLast, 
  isSubmitting,
  onBackToHome
}) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext()
  const selectedOptions = watch('artist_discovery_methods') || []

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let newSelected = [...selectedOptions]
    if (e.target.checked) {
      newSelected.push(value)
    } else {
      newSelected = newSelected.filter((item: string) => item !== value)
    }
    setValue('artist_discovery_methods', newSelected)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Back button - always show */}
        <button
          onClick={isFirst ? onBackToHome : onPrevious}
          className="inline-flex items-center text-gray-600 hover:text-black mb-12 transition-colors"
        >
          <ArrowLeftIcon className="h-8 w-8" />
        </button>
        
        <div className="space-y-12">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">How do you usually find artists?</h1>
            {/* Horizontal divider line */}
            <div className="w-full h-px bg-gray-300 mb-16"></div>
          </div>
          
          {/* Form layout */}
          <div className="space-y-8 mb-16">
            {/* Checkbox options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoveryOptions.map((option) => (
                <label key={option.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.id}
                    onChange={handleCheckboxChange}
                    checked={selectedOptions.includes(option.id)}
                    className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded accent-black"
                  />
                  <span className="ml-3 text-lg text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            
            {/* Other field - appears when "other" is selected */}
            {selectedOptions.includes('other') && (
              <div className="mt-8">
                <input
                  {...register('artist_discovery_other')}
                  className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="How else do you find artists?"
                />
                {errors.artist_discovery_other && (
                  <p className="mt-2 text-sm text-red-600">{errors.artist_discovery_other?.message as string}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-start pt-8">
            <button
              onClick={onNext}
              disabled={isSubmitting && isLast}
              className="inline-flex items-center justify-center bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 