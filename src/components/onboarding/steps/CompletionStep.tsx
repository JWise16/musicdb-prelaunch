import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import logoImage from '../../../assets/logo.png'
import { TypewriterEffect } from '../../common/TypewriterEffect'

interface CompletionStepProps {
  onLearnMore?: () => void
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ onLearnMore }) => {
  const [showTypingText, setShowTypingText] = useState(false)

  // Start typing animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypingText(true)
    }, 1000) // 1 second delay

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
          {/* Logo */}
          <div>
            <img 
              src={logoImage} 
              alt="MusicDB Logo" 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain"
            />
          </div>
          
          {/* Thank you message */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Thank you!</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
              We will notify you when MusicDB launches.
            </p>
          </div>
          
          {/* Additional message with typing animation */}
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl">
            {showTypingText ? (
              <TypewriterEffect 
                text="Your submission has been received. We'll use this information to help shape MusicDB into the perfect platform for venues like yours. Keep an eye out for updates!"
                speed={40}
                className="text-lg text-gray-700 leading-relaxed"
              />
            ) : (
              <p className="text-lg text-gray-700 leading-relaxed opacity-0">
                Your submission has been received. We'll use this information to help shape MusicDB into the perfect platform for venues like yours. Keep an eye out for updates!
              </p>
            )}
          </div>
          
          {/* Learn more button */}
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors text-lg"
            >
              Learn more
              <ArrowDownIcon className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 