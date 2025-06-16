import { useFormContext } from 'react-hook-form'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Checkbox } from '@/components/common/Checkbox'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'

interface StepProps {
  onPrevious: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onBackToHome: () => void
}

const excitementOptions = [
  {
    id: 'track_shows',
    label: 'Track Local Shows',
    description: 'See which artists are drawing crowds in your area that match your venue\'s size.'
  },
  {
    id: 'artist_insights',
    label: 'Artist Performance Insights',
    description: 'Get deep analytics on an artist\'s streaming, socials, and listener demographics.'
  },
  {
    id: 'rising_talent',
    label: 'Find Rising Talent',
    description: 'Discover and track new artists you haven\'t heard of before.'
  },
  {
    id: 'booking_dashboard',
    label: 'Your Booking Dashboard',
    description: 'View your past shows, performance trends, and where to experiment next—all in one place.'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Tell us what excites you most'
  }
]

export function ToolExcitementStep({ onPrevious, onNext, isFirst, isLast, isSubmitting, onBackToHome }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const selectedOptions = watch('tool_excitement') || []
  const showOtherInput = selectedOptions.includes('other')

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const currentOptions = watch('tool_excitement') || []
    if (checked) {
      setValue('tool_excitement', [...currentOptions, optionId])
    } else {
      setValue('tool_excitement', currentOptions.filter((id: string) => id !== optionId))
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">What excites you most about this tool?</h1>
            {/* Horizontal divider line */}
            <div className="w-full h-px bg-gray-300 mb-16"></div>
          </div>
          
          <div className="space-y-8">
            {excitementOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-4">
                <div className="pt-1">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={option.id} className="text-xl text-gray-900">
                    {option.label}
                  </Label>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              </div>
            ))}

            {showOtherInput && (
              <div className="mt-8">
                <Input
                  id="tool_excitement_other"
                  label="Please specify what excites you"
                  {...register('tool_excitement_other')}
                  className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Tell us more..."
                />
                {errors.tool_excitement_other && (
                  <p className="mt-2 text-sm text-red-600">{String(errors.tool_excitement_other.message)}</p>
                )}
              </div>
            )}

            {errors.tool_excitement && (
              <p className="mt-2 text-sm text-red-600">{String(errors.tool_excitement.message)}</p>
            )}
          </div>
          
          <div className="flex justify-start pt-8">
            <button
              onClick={onNext}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {isLast ? 'Submit' : <ArrowRightIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 