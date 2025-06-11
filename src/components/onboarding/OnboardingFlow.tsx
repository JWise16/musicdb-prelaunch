import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { supabase } from '../../lib/supabase'
import { VenueInfoStep } from './steps/VenueInfoStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { BookingPreferencesStep } from './steps/BookingPreferencesStep'
import { ArtistDiscoveryStep } from './steps/ArtistDiscoveryStep'
import { CompletionStep } from './steps/CompletionStep'


// Step-specific validation schemas
const venueInfoSchema = yup.object({
  venue_name: yup.string().required('Venue name is required'),
  venue_location: yup.string().required('Venue location is required'),
  venue_capacity: yup.number().positive('Capacity must be a positive number').required('Venue capacity is required'),
})

const personalInfoSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  role_at_venue: yup.string().required('Role at venue is required'),
  contact_method: yup.string().oneOf(['email', 'phone']).required('Contact method is required'),
  contact_value: yup.string().required('Contact value is required'),
})

const bookingPreferencesSchema = yup.object({
  booking_priorities: yup.array().of(yup.string()).min(1, 'Please select at least one booking priority'),
  booking_priorities_other: yup.string().optional(),
})

const artistDiscoverySchema = yup.object({
  artist_discovery_methods: yup.array().of(yup.string()).min(1, 'Please select at least one discovery method'),
  artist_discovery_other: yup.string().optional(),
})

const stepSchemas = [
  venueInfoSchema,
  personalInfoSchema,
  bookingPreferencesSchema,
  artistDiscoverySchema,
]

const steps = [
  { title: 'Venue Info', component: VenueInfoStep },
  { title: 'Personal Info', component: PersonalInfoStep },
  { title: 'Booking Preferences', component: BookingPreferencesStep },
  { title: 'Artist Discovery', component: ArtistDiscoveryStep },
  { title: 'Complete', component: CompletionStep },
]

interface OnboardingFlowProps {
  onBack: () => void
  onAboutUs?: () => void
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onBack, onAboutUs }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      venue_name: '',
      venue_location: '',
      venue_capacity: '',
      first_name: '',
      last_name: '',
      role_at_venue: '',
      contact_method: '',
      contact_value: '',
      booking_priorities: [],
      booking_priorities_other: '',
      artist_discovery_methods: [],
      artist_discovery_other: '',
    }
  })

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep]
    if (!currentSchema) return true

    try {
      const formData = methods.getValues()
      await currentSchema.validate(formData, { abortEarly: false })
      return true
    } catch (error: any) {
      // Set validation errors
      if (error.inner) {
        error.inner.forEach((err: any) => {
          methods.setError(err.path, { message: err.message })
        })
      }
      return false
    }
  }

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep)
    console.log('Current form data:', methods.getValues())
    
    const isValid = await validateCurrentStep()
    console.log('Validation result:', isValid)
    
    if (!isValid) {
      console.log('Validation failed, stopping')
      return
    }

    if (currentStep < steps.length - 2) {
      console.log('Moving to next step')
      setCurrentStep(prev => prev + 1)
    } else {
      // Final submission
      console.log('Final submission')
      setIsSubmitting(true)
      try {
        const formData = methods.getValues()
        // Convert venue_capacity to number
        const submissionData = {
          ...formData,
          venue_capacity: formData.venue_capacity ? Number(formData.venue_capacity) : null
        }
        console.log('Submitting data:', submissionData)
        
        const { error } = await supabase
          .from('venue_submissions')
          .insert(submissionData)
        if (error) throw error
        setCurrentStep(prev => prev + 1)
      } catch (error) {
        console.error('Submission error:', error)
        alert('There was an error submitting your information. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const CurrentStepComponent = steps[currentStep]?.component || CompletionStep

  return (
    <FormProvider {...methods}>
      {currentStep === steps.length - 1 ? (
        <CompletionStep onLearnMore={onAboutUs} />
      ) : (
        <CurrentStepComponent
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 2}
          isSubmitting={isSubmitting}
          onBackToHome={onBack}
        />
      )}
    </FormProvider>
  )
} 