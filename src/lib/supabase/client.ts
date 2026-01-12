import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
    throw new Error('Supabase Configuration Error: Please update .env.local with your actual credentials.')
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
