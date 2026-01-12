'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { trackEvent, trackError, identifyUser, MONITORING_EVENTS } from '@/lib/monitoring'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    trackEvent(MONITORING_EVENTS.AUTH.LOGIN_FAILURE, { email, error: error.message })
    return { error: error.message }
  }

  identifyUser(data.user.id, data.user.email)
  trackEvent(MONITORING_EVENTS.AUTH.LOGIN_SUCCESS, { userId: data.user.id })

  revalidatePath('/', 'layout')
  redirect('/')
}

// Signup removed for B2B closed access (invite only)
/*
export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()
  
    const email = formData.get('email') as string
    const password = formData.get('password') as string
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
  
    if (error) {
      trackEvent(MONITORING_EVENTS.AUTH.SIGNUP_FAILURE, { email, error: error.message })
      return { error: error.message }
    }

    if (data.user) {
        identifyUser(data.user.id, data.user.email)
        trackEvent(MONITORING_EVENTS.AUTH.SIGNUP_SUCCESS, { userId: data.user.id })
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
}
*/
