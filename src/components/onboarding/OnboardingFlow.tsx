import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { VenueInfoStep } from './steps/VenueInfoStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { BookingPreferencesStep } from './steps/BookingPreferencesStep'
import { ArtistDiscoveryStep } from './steps/ArtistDiscoveryStep'
import { CompletionStep } from './steps/CompletionStep'
import * as yup from 'yup'

const steps = [
  { component: VenueInfoStep, title: 'Venue Information' },
  { component: PersonalInfoStep, title: 'Personal Information' },
  { component: BookingPreferencesStep, title: 'Booking Preferences' },
  { component: ArtistDiscoveryStep, title: 'Artist Discovery' },
  { component: CompletionStep, title: 'Completion' },
]

// Validation schemas for each step
const stepSchemas: Record<number, yup.ObjectSchema<any>> = {
  0: yup.object().shape({
    venue_name: yup.string().required('Venue name is required'),
    venue_location: yup.string().required('Venue location is required'),
    venue_capacity: yup.number().nullable(),
  }),
  1: yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    role_at_venue: yup.string().required('Role is required'),
    contact_method: yup.string().required('Contact method is required'),
    contact_value: yup.string().required('Contact information is required'),
  }),
  2: yup.object().shape({
    booking_priorities: yup.array().min(1, 'Select at least one priority'),
    booking_priorities_other: yup.string().when('booking_priorities', {
      is: (priorities: string[]) => priorities?.includes('other'),
      then: () => yup.string().required('Please specify other priorities'),
    }),
  }),
  3: yup.object().shape({
    artist_discovery_methods: yup.array().min(1, 'Select at least one method'),
    artist_discovery_other: yup.string().when('artist_discovery_methods', {
      is: (methods: string[]) => methods?.includes('other'),
      then: () => yup.string().required('Please specify other methods'),
    }),
  }),
}

export function OnboardingFlow() {
  const navigate = useNavigate()
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
    const isValid = await validateCurrentStep()
    if (!isValid) return

    if (currentStep < steps.length - 2) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      setIsSubmitting(true)
      try {
        const formData = methods.getValues()
        // Convert venue_capacity to number
        const submissionData = {
          ...formData,
          venue_capacity: formData.venue_capacity ? Number(formData.venue_capacity) : null
        }
        
        const { error } = await supabase
          .from('venue_submissions')
          .insert(submissionData)
        
        if (error) throw error
        setCurrentStep(currentStep + 1)
      } catch (error) {
        console.error('Submission error:', error)
        alert('There was an error submitting your information. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <FormProvider {...methods}>
      {currentStep === steps.length - 1 ? (
        <CompletionStep onLearnMore={() => navigate('/about')} />
      ) : (
        <CurrentStepComponent
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 2}
          isSubmitting={isSubmitting}
          onBackToHome={() => navigate('/')}
        />
      )}
    </FormProvider>
  )
} 