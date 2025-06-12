import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import AdminLogin from './components/pages/AdminLogin'
import AdminDashboard from './components/pages/AdminDashboard'
import { LandingPage } from './components/pages/LandingPage'
import { AboutPage } from './components/pages/AboutPage'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('landing')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <LandingPage
              onGetStarted={() => setPage('onboarding')}
              onAboutUs={() => setPage('about')}
            />
          } 
        />
        <Route 
          path="/about" 
          element={
            <AboutPage 
              onGetStarted={() => setPage('onboarding')}
              onBack={() => setPage('landing')} 
            />
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <OnboardingFlow 
              onBack={() => setPage('landing')} 
              onAboutUs={() => setPage('about')}
            />
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/login" 
          element={!session ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={session ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
    </Router>
  )
}

export default App
