import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { supabase } from '../../lib/supabase'
import { VenueInfoStep } from './steps/VenueInfoStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { BookingPreferencesStep } from './steps/BookingPreferencesStep'
import { ArtistDiscoveryStep } from './steps/ArtistDiscoveryStep'
import { CompletionStep } from './steps/CompletionStep'
import { useNavigate } from 'react-router-dom'


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
  { component: VenueInfoStep, title: 'Venue Information' },
  { component: PersonalInfoStep, title: 'Personal Information' },
  { component: BookingPreferencesStep, title: 'Booking Preferences' },
  { component: ArtistDiscoveryStep, title: 'Artist Discovery' },
  { component: CompletionStep, title: 'Completion' },
]

export function OnboardingFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    mode: 'onChange',
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
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