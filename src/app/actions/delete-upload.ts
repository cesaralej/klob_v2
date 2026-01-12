'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteUpload() {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Delete all uploads for this user
  // Because of CASCADE, this will remove products and sales too
  const { error } = await supabase
    .from('uploads')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting data:', error)
    throw new Error('Failed to delete data')
  }

  revalidatePath('/')
}
