import { Show, useUser } from '@clerk/react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSubnav } from '@/components/admin/AdminSubnav'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminLayout() {
  const { pathname } = useLocation()
  const invoiceSheet = /^\/admin\/invoices\/.+/.test(pathname)
  usePageMeta(getShareMeta('/admin'))

  return (
    <Section className={cn('pt-32 md:pt-40', invoiceSheet && 'print:py-8')}>
      <Container>
        {invoiceSheet ? null : <Eyebrow>The ledger</Eyebrow>}
        {clerkEnabled ? (
          <AdminGate invoiceSheet={invoiceSheet} />
        ) : (
          <Body className="mt-6">
            Account is not configured. Set Clerk, then list the house emails.
          </Body>
        )}
        {invoiceSheet ? null : (
          <div className="mt-16">
            <TextLink to="/">Return to the house</TextLink>
          </div>
        )}
      </Container>
    </Section>
  )
}

function AdminGate({ invoiceSheet }: { invoiceSheet: boolean }) {
  const { user, isLoaded } = useUser()
  const { pathname } = useLocation()

  if (!isLoaded) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the house.</p>
  }

  return (
    <>
      <Show when="signed-out">
        <SignedOutBoard redirect={pathname} />
      </Show>
      <Show when="signed-in">
        {isAdminUser(user) ? (
          <>
            {invoiceSheet ? null : <AdminSubnav />}
            <Outlet />
          </>
        ) : (
          <ClosedBoard />
        )}
      </Show>
    </>
  )
}

function SignedOutBoard({ redirect }: { redirect: string }) {
  return (
    <>
      <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
        The house board.
      </Display>
      <Body className="mt-6">
        The ledger is for the house. Sign in with atelier@kiano.london or the address
        that keeps the house.
      </Body>
      <div className="mt-10">
        <Button to={`/sign-in?redirect_url=${encodeURIComponent(redirect)}`} variant="solid">
          Sign in
        </Button>
      </div>
    </>
  )
}

function ClosedBoard() {
  return (
    <>
      <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
        The house board.
      </Display>
      <Body className="mt-6">
        This account can shop. It cannot open the ledger. Sign in with
        atelier@kiano.london, or the Gmail that keeps the house.
      </Body>
      <div className="mt-10">
        <TextLink to="/account">Your cuts</TextLink>
      </div>
    </>
  )
}
