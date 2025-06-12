import { useState, useEffect } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '../common/Button'
import { TypewriterEffect } from '../common/TypewriterEffect'
import logoImage from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const navigate = useNavigate()
  const [logoVisible, setLogoVisible] = useState(false)
  const [startTypewriter, setStartTypewriter] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButtonEffect, setShowButtonEffect] = useState(false)

  // Start logo animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(true)
    }, 300) // Small delay before logo starts

    return () => clearTimeout(timer)
  }, [])

  // Start typewriter after logo animation completes
  useEffect(() => {
    if (logoVisible) {
      const timer = setTimeout(() => {
        setStartTypewriter(true)
      }, 800) // Wait for logo animation to complete

      return () => clearTimeout(timer)
    }
  }, [logoVisible])

  const handleTitleComplete = () => {
    setShowButtonEffect(true) // Show button when title completes
  }

  // Show subtitle when logo becomes visible
  useEffect(() => {
    if (logoVisible) {
      setShowSubtitle(true)
    }
  }, [logoVisible])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content - Center with logo stacked on top */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          {/* Logo */}
          <div className="mb-4">
            <img 
              src={logoImage} 
              alt="MusicDB Logo" 
              className={`w-48 h-48 md:w-56 md:h-56 mx-auto object-contain transition-all duration-700 ease-out ${
                logoVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-8'
              }`}
            />
          </div>
          
          {/* Main messaging */}
          <div className="space-y-6 mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight">
              {startTypewriter ? (
                <TypewriterEffect 
                  text="Meet your next artist" 
                  speed={80}
                  className="text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight"
                  onComplete={handleTitleComplete}
                  showFinalCursor={true}
                />
              ) : (
                <span className="text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight opacity-0">
                  Meet your next artist
                </span>
              )}
            </h2>
            <div className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              <p className={`text-xl md:text-2xl text-gray-600 transition-all duration-700 ease-out ${
                showSubtitle 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}>
                The first artist discovery platform for venues
              </p>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={() => navigate('/onboarding')}
              className={`inline-flex items-center justify-center bg-black text-white px-12 py-4 text-lg font-medium rounded-full hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                showButtonEffect 
                  ? 'animate-bounce shadow-lg shadow-gray-400/30 hover:shadow-xl hover:shadow-gray-400/40' 
                  : ''
              }`}
              style={showButtonEffect ? {
                animationName: 'bounceRight',
                animationDuration: '2.5s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
              } : {}}
            >
              Get Started
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* About Us - Bottom */}
      <div className="flex-none pb-20">
        <div className="text-center">
          <Button
            onClick={() => navigate('/about')}
            variant="ghost"
            className="text-gray-600 text-lg hover:text-black"
          >
            About Us
          </Button>
        </div>
      </div>
    </div>
  )
} 