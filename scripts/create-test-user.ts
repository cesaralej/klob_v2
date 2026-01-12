import { createClient } from '@supabase/supabase-js';

// Env vars must be loaded before running this.
// Use 'dotenv' or run with `source .env.local && npx tsx scripts/create-test-user.ts`

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'test@example.com';
  const password = 'password123';

  console.log(`Creating user: ${email}...`);

  // Try to sign up (if using Anon Key, this sends an email usually, unless autoconfirm is on)
  // If using Service Role Key, we can use admin.createUser to bypass confirmation
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Using Service Role Key to auto-confirm user...');
      const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
      });
      if (error) {
          console.error('Error creating user:', error.message);
      } else {
          console.log('User created:', data.user.id);
      }
  } else {
      console.log('Using Anon Key (requires email confirmation or existing user)...');
       const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        console.log('Sign up successful (check email for confirmation if required):', data.user?.id);
      }
  }
}

main();
