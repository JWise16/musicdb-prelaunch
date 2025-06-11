import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type VenueSubmission = {
  venue_name: string
  venue_location: string
  venue_capacity: number
  first_name: string
  last_name: string
  role_at_venue: string
  contact_method: 'email' | 'phone'
  contact_value: string
  booking_priorities: string[]
  booking_priorities_other?: string
  artist_discovery_methods: string[]
  artist_discovery_other?: string
}
