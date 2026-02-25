# PinJar Setup Guide

## Environment Variables

You need to set up the following environment variables in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000 (for development)
```

Get these values from your Supabase project settings.

## Authentication Flow

### Sign Up
1. User navigates to `/auth/sign-up`
2. Fills in username, email, and password
3. System validates form and creates account via Supabase
4. Confirmation OTP is sent to email
5. User is redirected to `/auth/confirm-otp?email=user@example.com`

### OTP Verification
1. User enters 6-digit OTP code
2. System verifies OTP with Supabase
3. Email is confirmed and account is activated
4. User is redirected to home page `/`

### Sign In
1. User navigates to `/auth/sign-in`
2. Enters email and password
3. System authenticates with Supabase
4. User session is created
5. User can access protected pages

## Database Trigger

Your Supabase database includes a custom trigger that automatically creates a user profile when a new user signs up. This trigger:
- Runs with `security definer` privileges
- Inserts into the `profiles` table automatically
- Captures the username from user metadata

## Color Schema

The app uses a Slate-based blue color scheme:
- **Primary**: Blue (#3b82f6)
- **Foreground**: Dark Slate
- **Accent**: Lighter Blue tones
- **Neutral**: Slate grays

All colors are defined in `/app/globals.css` using OKLCH color space for better color accuracy.

## Key Files

- `/lib/supabase/client.ts` - Browser client for Supabase
- `/lib/supabase/server.ts` - Server client for Supabase
- `/lib/supabase/proxy.ts` - Session refresh handler
- `/middleware.ts` - Token refresh and session management
- `/app/auth/sign-up/page.tsx` - Sign up page
- `/app/auth/confirm-otp/page.tsx` - OTP verification page
- `/app/auth/sign-in/page.tsx` - Sign in page
- `/lib/auth.ts` - Auth utility functions
- `/components/toast-provider.tsx` - Toast notifications

## Toast Notifications

The app uses `react-toastify` for notifications:
- Position: Bottom-right
- Auto-close: 3 seconds
- Supports dark mode
- Can be dismissed manually

## Next Steps

1. Configure environment variables in Vercel
2. Test sign up flow
3. Test OTP verification
4. Implement Sign Out (Step 3 of the plan)
5. Build main page UI (Step 4)
