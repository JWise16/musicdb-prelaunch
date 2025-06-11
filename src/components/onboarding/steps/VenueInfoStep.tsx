import { useFormContext } from 'react-hook-form'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface StepProps {
  onPrevious: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onBackToHome?: () => void
}

export const VenueInfoStep: React.FC<StepProps> = ({ 
  onPrevious, 
  onNext,
  isFirst, 
  isLast, 
  isSubmitting,
  onBackToHome
}) => {
  const { register, formState: { errors } } = useFormContext()

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Tell us about your venue</h1>
            {/* Horizontal divider line */}
            <div className="w-full h-px bg-gray-300 mb-16"></div>
          </div>
          
          {/* Horizontal input layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div>
              <input
                {...register('venue_name')}
                className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Venue name"
              />
              {errors.venue_name && (
                <p className="mt-2 text-sm text-red-600">{errors.venue_name?.message as string}</p>
              )}
            </div>
            
            <div>
              <input
                {...register('venue_location')}
                className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Location"
              />
              {errors.venue_location && (
                <p className="mt-2 text-sm text-red-600">{errors.venue_location?.message as string}</p>
              )}
            </div>
            
            <div>
              <input
                type="number"
                {...register('venue_capacity', { valueAsNumber: true })}
                className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Venue capacity"
              />
              {errors.venue_capacity && (
                <p className="mt-2 text-sm text-red-600">{errors.venue_capacity?.message as string}</p>
              )}
            </div>
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