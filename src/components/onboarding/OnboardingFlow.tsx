import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, initAnonymousAuth } from '../../lib/supabase'
import { VenueInfoStep } from './steps/VenueInfoStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { ToolExcitementStep } from './steps/ToolExcitementStep'
import { CompletionStep } from './steps/CompletionStep'
import { ProgressBar } from '../common/ProgressBar'
import * as yup from 'yup'
import type { Database } from '../../lib/database.types'

type VenueSubmission = Database['public']['Tables']['venue_submissions']['Row']
type FormData = Omit<VenueSubmission, 'id' | 'created_at' | 'updated_at' | 'venue_capacity'> & {
  venue_capacity: string | null
}

type FormFieldName = keyof FormData | 'root' | `root.${string}` | `tool_excitement.${number}`

interface ValidationError {
  path: FormFieldName
  message: string
}

const steps = [
  { component: VenueInfoStep, title: 'Venue Information' },
  { component: PersonalInfoStep, title: 'Personal Information' },
  { component: ToolExcitementStep, title: 'Tool Excitement' },
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
    tool_excitement: yup.array().min(1, 'Select at least one option'),
    tool_excitement_other: yup.string().when('tool_excitement', {
      is: (options: string[]) => options?.includes('other'),
      then: () => yup.string().required('Please specify what excites you'),
    }),
  }),
}

export function OnboardingFlow() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize anonymous auth
  useEffect(() => {
    const init = async () => {
      try {
        await initAnonymousAuth()
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing anonymous auth:', error)
      }
    }
    init()
  }, [])

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      venue_name: '',
      venue_location: '',
      venue_capacity: null,
      first_name: '',
      last_name: '',
      role_at_venue: '',
      contact_method: '',
      contact_value: '',
      tool_excitement: [],
      tool_excitement_other: '',
    }
  })

  // Load existing submission if ID is provided
  useEffect(() => {
    const loadSubmission = async () => {
      const id = searchParams.get('id')
      if (id) {
        try {
          const { data, error } = await supabase
            .from('venue_submissions')
            .select('*')
            .eq('id', id)
            .single()

          if (error) throw error
          if (data) {
            setSubmissionId(data.id)
            // Convert data to match form types
            const formData: FormData = {
              ...data,
              venue_capacity: data.venue_capacity?.toString() || null,
              tool_excitement: data.tool_excitement || [],
              tool_excitement_other: data.tool_excitement_other || '',
            }
            methods.reset(formData)
            
            // Determine which step to show based on completed data
            if (data.tool_excitement && data.tool_excitement.length > 0) {
              setCurrentStep(3) // Show completion
            } else if (data.first_name && data.last_name) {
              setCurrentStep(2) // Show tool excitement
            } else if (data.venue_name && data.venue_location) {
              setCurrentStep(1) // Show personal info
            }
          }
        } catch (error) {
          console.error('Error loading submission:', error)
        }
      }
    }
    loadSubmission()
  }, [searchParams, methods])

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep]
    if (!currentSchema) return true

    try {
      const formData = methods.getValues()
      await currentSchema.validate(formData, { abortEarly: false })
      return true
    } catch (error: any) {
      if (error.inner) {
        error.inner.forEach((err: ValidationError) => {
          methods.setError(err.path, { message: err.message })
        })
      }
      return false
    }
  }

  const saveCurrentStep = async (formData: FormData) => {
    if (!isInitialized) {
      throw new Error('Authentication not initialized')
    }

    try {
      const stepData = {
        ...formData,
        venue_capacity: formData.venue_capacity ? Number(formData.venue_capacity) : null,
        tool_excitement: formData.tool_excitement || [],
        tool_excitement_other: formData.tool_excitement_other || null,
        updated_at: new Date().toISOString()
      }

      if (submissionId) {
        // Update existing submission
        const { error } = await supabase
          .from('venue_submissions')
          .update(stepData)
          .eq('id', submissionId)
        
        if (error) throw error
      } else {
        // Create new submission
        const { data, error } = await supabase
          .from('venue_submissions')
          .insert(stepData)
          .select()
          .single()
        
        if (error) throw error
        if (data) {
          setSubmissionId(data.id)
          // Update URL with submission ID
          navigate(`/onboarding?id=${data.id}`, { replace: true })
        }
      }
    } catch (error) {
      console.error('Error saving step:', error)
      throw error
    }
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const formData = methods.getValues()
      await saveCurrentStep(formData)

      if (currentStep < steps.length - 2) {
        setCurrentStep(currentStep + 1)
      } else {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error saving your information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      {currentStep === steps.length - 1 ? (
        <CompletionStep onLearnMore={() => navigate('/about')} />
      ) : (
        <div className="min-h-screen bg-white">
          {/* Progress bar at the top */}
          <div className="max-w-4xl mx-auto px-8 pt-8">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={steps.length - 1} 
              className="mb-8"
            />
          </div>
          
          <CurrentStepComponent
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 2}
            isSubmitting={isSubmitting}
            onBackToHome={() => navigate('/')}
          />
        </div>
      )}
    </FormProvider>
  )
} 