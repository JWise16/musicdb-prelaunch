import { useState } from 'react'
import { LandingPage } from './components/pages/LandingPage'
import { AboutPage } from './components/pages/AboutPage'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'

function App() {
  const [page, setPage] = useState('landing')

  return (
    <div className="min-h-screen">
      {page === 'landing' && (
        <LandingPage
          onGetStarted={() => setPage('onboarding')}
          onAboutUs={() => setPage('about')}
        />
      )}
      {page === 'about' && (
        <AboutPage 
          onGetStarted={() => setPage('onboarding')}
          onBack={() => setPage('landing')} 
        />
      )}
      {page === 'onboarding' && (
        <OnboardingFlow 
          onBack={() => setPage('landing')} 
          onAboutUs={() => setPage('about')}
        />
      )}
    </div>
  )
}

export default App
