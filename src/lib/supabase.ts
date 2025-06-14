import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Initialize anonymous auth
export const initAnonymousAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    await supabase.auth.signInAnonymously()
  }
  return session
}

export type VenueSubmission = {
  venue_name: string
  venue_location: string
  venue_capacity: number
  first_name: string
  last_name: string
  role_at_venue: string
  contact_method: 'email' | 'phone'
  contact_value: string
  tool_excitement: string[]
  tool_excitement_other?: string
}
