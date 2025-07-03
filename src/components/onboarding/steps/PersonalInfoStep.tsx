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

export const PersonalInfoStep: React.FC<StepProps> = ({ 
  onPrevious, 
  onNext,
  isFirst, 
  isLast, 
  isSubmitting,
  onBackToHome
}) => {
  const { register, formState: { errors }, watch } = useFormContext()
  const contactMethod = watch('contact_method')

  return (
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Tell us about you</h1>
            {/* Horizontal divider line */}
            <div className="w-full h-px bg-gray-300 mb-16"></div>
          </div>
          
          {/* Form layout */}
          <div className="space-y-12 mb-16">
            {/* Name fields - horizontal layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <input
                  {...register('first_name')}
                  className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="First name"
                />
                {errors.first_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.first_name?.message as string}</p>
                )}
              </div>
              
              <div>
                <input
                  {...register('last_name')}
                  className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.last_name?.message as string}</p>
                )}
              </div>
            </div>
            
            {/* Role field */}
            <div>
              <input
                {...register('role_at_venue')}
                className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Role at venue"
              />
              {errors.role_at_venue && (
                <p className="mt-2 text-sm text-red-600">{errors.role_at_venue?.message as string}</p>
              )}
            </div>
            
            {/* Contact method - radio buttons with conditional input field */}
            <div className="space-y-6">
              <h3 className="text-xl text-gray-900">Preferred contact method</h3>
              <div className="flex items-center space-x-8">
                <div className="flex space-x-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      {...register('contact_method')}
                      className="h-5 w-5 text-black focus:ring-black border-gray-300 accent-black"
                    />
                    <span className="ml-3 text-lg text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="phone"
                      {...register('contact_method')}
                      className="h-5 w-5 text-black focus:ring-black border-gray-300 accent-black"
                    />
                    <span className="ml-3 text-lg text-gray-700">Phone</span>
                  </label>
                </div>
                
                {/* Contact value field - appears when method is selected */}
                {contactMethod && (
                  <div className="flex-1 ml-8">
                    <input
                      {...register('contact_value')}
                      className="w-full px-0 py-6 text-xl bg-transparent border-0 border-b border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
                      placeholder={contactMethod === 'email' ? 'your@email.com' : '(555) 123-4567'}
                    />
                    {errors.contact_value && (
                      <p className="mt-2 text-sm text-red-600">{errors.contact_value?.message as string}</p>
                    )}
                  </div>
                )}
              </div>
              {errors.contact_method?.message && (
                <p className="text-sm text-red-600">{errors.contact_method.message as string}</p>
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
  )
} 