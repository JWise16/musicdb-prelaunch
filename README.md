# MusicDB Pre-Launch App

A React TypeScript application to gather venue information and gauge interest before the official MusicDB platform launch.

## Features

- **Landing Page**: Simple introduction with navigation to onboarding or about page
- **About Page**: Information about MusicDB's mission and goals
- **Multi-step Onboarding Flow**:
  - Venue Information (name, location, capacity)
  - Personal Information (contact details, role)
  - Booking Preferences (what matters when booking artists)
  - Artist Discovery (how venues find artists)
  - Completion confirmation

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 3
- **Forms**: React Hook Form + Yup validation
- **Icons**: Heroicons
- **Backend**: Supabase (PostgreSQL database)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Make sure your `.env.local` file contains:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**:
   The app uses a `venue_submissions` table in Supabase. The schema is already defined in `src/lib/database.types.ts`.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:5173`

## Usage

1. **Landing Page**: Users see the MusicDB title with "Get Started" and "About Us" buttons
2. **About Page**: Simple informational content about MusicDB
3. **Onboarding Flow**: 
   - Step-by-step form collection
   - Progress indicator shows current step
   - Form validation with error messages
   - Data submission to Supabase
   - Thank you confirmation

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── StepIndicator.tsx
│   ├── onboarding/       # Multi-step form components
│   │   ├── OnboardingFlow.tsx
│   │   └── steps/
│   │       ├── VenueInfoStep.tsx
│   │       ├── PersonalInfoStep.tsx
│   │       ├── BookingPreferencesStep.tsx
│   │       ├── ArtistDiscoveryStep.tsx
│   │       └── CompletionStep.tsx
│   └── pages/            # Main page components
│       ├── LandingPage.tsx
│       └── AboutPage.tsx
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   └── database.types.ts # TypeScript types from Supabase
└── App.tsx               # Main app component with routing
```

## Key Features

### Form Validation
- Required field validation
- Type-specific validation (email, numbers)
- Real-time error display
- Multi-select checkbox handling

### User Experience
- Clean, modern UI with Tailwind CSS
- Responsive design
- Loading states during submission
- Clear progress indication
- Error handling with user feedback

### Data Collection
The app collects the following venue information:
- Venue details (name, location, capacity)
- Contact person information
- Booking priorities and preferences
- Artist discovery methods
- Additional feedback through "other" fields

## Development

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## Database Schema

The `venue_submissions` table includes:
- Venue information (name, location, capacity)
- Personal details (first_name, last_name, role_at_venue)
- Contact information (contact_method, contact_value)
- Preferences (booking_priorities, artist_discovery_methods)
- Optional additional details (booking_priorities_other, artist_discovery_other)
- Timestamps (created_at, updated_at)

## Next Steps

1. **Deployment**: Deploy to your preferred hosting platform
2. **Analytics**: Add tracking for form completion rates
3. **Email Integration**: Automated confirmation emails
4. **Admin Dashboard**: View and analyze collected data
5. **Enhanced Validation**: More sophisticated form validation
6. **A/B Testing**: Test different onboarding flows
