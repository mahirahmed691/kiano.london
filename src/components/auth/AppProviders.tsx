import { ClerkProvider } from '@clerk/react'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { clerkPublishableKey } from '@/lib/clerk'
import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  if (!clerkPublishableKey) return children

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      {children}
    </ClerkProvider>
  )
}
