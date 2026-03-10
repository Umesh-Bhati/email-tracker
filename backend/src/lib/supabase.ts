import { createClient } from '@supabase/supabase-js'

// We will use environment variables to store the Supabase URL and Publishable Key securely.
// In a serverless environment (like Vercel), these are injected at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// This creates a single instance of the Supabase client that we can reuse
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
