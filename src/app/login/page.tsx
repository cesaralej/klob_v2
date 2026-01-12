'use client'

import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail } from 'lucide-react'
import { useActionState } from 'react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  // const [signupState, signupAction, isSignupPending] = useActionState(signup, initialState)

  // Use a wrapper or just two distinct forms if needed.
  // For simplicity MVP, I'll allow the user to click either button. 
  // However, useActionState wraps a specific action. 
  // To support both buttons on one form, we can't easily use useActionState for both unless we wire them carefully.
  // Simplest: Split into two forms or use one action that detects intent.
  // I will use one action `handleSubmit` that delegates, or just use `formAction` on buttons with the updated signature (which might still be tricky with useActionState hooks).
  
  // Actually, standard `formAction` on button works with `useActionState` if the action is bounded? 
  // No, `useActionState` returns a new action handler `formAction`.
  
  // Let's simplified: Two tabs (Login / Signup) or just one form that Defaults to Login.
  // I'll implementing a single unified "Auth" action or kept separate.
  // Let's just fix the type error by handling the promise correctly in a client handler, OR use `useActionState` for Login (primary). 
  // For Signup, I'll make it a separate small link or button that toggles mode or just another button.
  
  // Re-reading "Simple MVP": Login Page. Signup isn't explicitly detailed but implied for "User authentication".
  // I will just wrap `login` with `useActionState` and have a separate "Sign Up" button that just calls the server action directly (without state)? No, that will hit the same type error.
  
  // I will implement a client-side handler that calls the server action.
  
  async function handleLogin(formData: FormData) {
      const result = await login(null, formData)
      if (result?.error) {
          alert(result.error) // Simple alert for MVP or set state
      }
  }


  /*
  async function handleSignup(formData: FormData) {
      // const result = await signup(null, formData)
      //  if (result?.error) {
      //     alert(result.error) 
      // }
  }
  */

  
  // But strictly `formAction={handleLogin}` works.

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login to KLOB</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-9"
                />
              </div>
            </div>
            <Button formAction={handleLogin} className="w-full">Sign in</Button>
            {/* <Button formAction={handleSignup} variant="outline" className="w-full">Sign up</Button> */}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? Contact your administrator.
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
