import { Show, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { RestockLedger } from '@/components/admin/RestockLedger'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import {
  houseCompetitors,
  houseDataNotes,
  houseFeatures,
  houseIntegrations,
  houseScope,
  houseVisualAudit,
} from '@/data/house-board'
import { getProduct, productLineName } from '@/data/products'
import { isAdminEmail } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { formatGbp } from '@/lib/money'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

type AppointmentRow = {
  id: number
  name: string
  email: string
  telephone: string
  productId: string
  size: number | null
  note: string
  createdAt: string
}

type Ledger = {
  members: number
  orders: number
  reservedPence: number
  listConfirmed: number
  listHeld: number
  cutsRemaining: number
  sizesHeld: number
  appointmentCount: number
  appointments: AppointmentRow[]
}

function statusCopy(status: 'complete' | 'partial' | 'missing') {
  if (status === 'complete') return 'Kept'
  if (status === 'partial') return 'In hand'
  return 'Not yet'
}

function useLedger() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [ledger, setLedger] = useState<Ledger | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminEmail(user?.primaryEmailAddress?.emailAddress)) return
    let cancelled = false

    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin-summary', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as Ledger & { error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The ledger could not be read.')
          return
        }
        setLedger({
          ...data,
          appointmentCount: data.appointmentCount ?? 0,
          appointments: data.appointments ?? [],
        })
      } catch {
        if (!cancelled) setError('The ledger could not be read.')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  return { ledger, error }
}

function LedgerFigures({ ledger, error }: { ledger: Ledger | null; error: string }) {
  if (error) {
    return (
      <p className="mt-8 text-[15px] font-light text-ink" role="alert">
        {error}
      </p>
    )
  }

  if (!ledger) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the house counts.</p>
  }

  const figures = [
    { label: 'Reserved', value: String(ledger.orders).padStart(2, '0') },
    { label: 'Held', value: formatGbp(ledger.reservedPence) },
    { label: 'Cuts remaining', value: String(ledger.cutsRemaining) },
    { label: 'Sizes held', value: String(ledger.sizesHeld).padStart(2, '0') },
    { label: 'Members', value: String(ledger.members).padStart(2, '0') },
    { label: 'The list', value: `${ledger.listConfirmed} confirmed · ${ledger.listHeld} held` },
    {
      label: 'The diary',
      value: String(ledger.appointmentCount ?? 0).padStart(2, '0'),
    },
  ]

  return (
    <ul className="mt-12 grid gap-8 border-t border-ink pt-10 sm:grid-cols-2 lg:grid-cols-3">
      {figures.map((figure) => (
        <li key={figure.label}>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{figure.label}</p>
          <p className="mt-3 font-display text-3xl font-light md:text-4xl">{figure.value}</p>
        </li>
      ))}
    </ul>
  )
}

function SignedOutBoard() {
  return (
    <>
      <Body className="mt-6">
        The ledger is for the house. Sign in with the address that is listed.
      </Body>
      <div className="mt-10">
        <Button to="/sign-in?redirect_url=/admin" variant="solid">
          Sign in
        </Button>
      </div>
    </>
  )
}

function ClosedBoard() {
  return (
    <>
      <Body className="mt-6">
        This account can shop. It cannot open the ledger. If you keep the house, sign in
        with the listed address.
      </Body>
      <div className="mt-10">
        <TextLink to="/account">Your cuts</TextLink>
      </div>
    </>
  )
}

function appointmentPiece(row: AppointmentRow) {
  const product = getProduct(row.productId)
  if (product) return productLineName(product)
  return 'To be discussed'
}

function formatDiaryDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function AppointmentDiary({ ledger }: { ledger: Ledger | null }) {
  if (!ledger) return null

  return (
    <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
      <Reveal>
        <Eyebrow>The diary</Eyebrow>
        <Display as="h2" className="mt-4 text-4xl md:text-5xl">
          Letters held.
        </Display>
        <Body className="mt-6">
          Requests are copied here when the atelier can keep them. The visitor still
          writes a letter. This is not a booking calendar.
        </Body>
      </Reveal>
      {ledger.appointments.length === 0 ? (
        <p className="mt-12 text-[15px] font-light leading-relaxed text-ink-soft">
          No letters held yet. They still arrive by mail.
        </p>
      ) : (
        <ul className="mt-12 divide-y divide-rule border-y border-ink">
          {ledger.appointments.map((row) => (
            <li key={row.id} className="grid gap-4 py-8 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatDiaryDate(row.createdAt)}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{row.name}</p>
                <p className="mt-2 text-[15px] font-light text-ink-soft">{row.email}</p>
                {row.telephone ? (
                  <p className="mt-1 text-[15px] font-light text-ink-soft">{row.telephone}</p>
                ) : null}
              </div>
              <div className="lg:col-span-6">
                <p className="text-[15px] font-light leading-relaxed text-ink-soft">
                  {appointmentPiece(row)}
                  {row.size ? ` · ${row.size}` : ' · to be fitted'}
                </p>
                {row.note ? (
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-ink">{row.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function OpenBoard() {
  const { ledger, error } = useLedger()
  const ranked = [...houseFeatures].sort((a, b) => b.completion - a.completion)
  const mean = Math.round(
    houseFeatures.reduce((sum, feature) => sum + feature.completion, 0) / houseFeatures.length,
  )

  return (
    <>
      <Body className="mt-6">
        A private reading of the house: what is kept, what is hooked, who else cuts a
        column, and how the rooms look on a screen. Mean completion {mean} of 100.
      </Body>
      <LedgerFigures ledger={ledger} error={error} />

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>Cuts</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Remaining on the line.
          </Display>
          <Body className="mt-6">
            Set a size when cloth returns. Leave the field and it is kept. The shop reads
            these numbers; this page is the only place they are written.
          </Body>
        </Reveal>
        <RestockLedger />
      </div>

      <AppointmentDiary ledger={ledger} />

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>01 · The line of work</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Ranked by how finished it is.
          </Display>
        </Reveal>
        <ol className="mt-12 divide-y divide-rule border-y border-ink">
          {ranked.map((feature, index) => (
            <li key={feature.name} className="grid gap-4 py-8 lg:grid-cols-12 lg:items-baseline">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{feature.name}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {statusCopy(feature.status)} · {feature.completion}
                </p>
              </div>
              <p className="text-[15px] font-light leading-relaxed text-ink-soft lg:col-span-7">
                {feature.note}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>02 · Hooks</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            What is wired, and what is not.
          </Display>
        </Reveal>
        <ul className="mt-12 space-y-12">
          {houseIntegrations.map((item) => (
            <li key={item.name} className="grid gap-4 border-t border-rule pt-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{item.name}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {item.state}
                </p>
                <p className="mt-4 text-[13px] font-light text-ink-soft">{item.hook}</p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[15px] font-light leading-relaxed text-ink-soft">{item.events}</p>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-soft">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>03 · The count</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            What the numbers can say.
          </Display>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {houseDataNotes.map((note) => (
            <div key={note.title}>
              <h3 className="font-display text-2xl font-light">{note.title}</h3>
              <Body className="mt-4">{note.copy}</Body>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>04 · The field</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Other houses of the column.
          </Display>
          <Body className="mt-6">
            Not a market report. A map of who else sells an Emirati or Gulf column, so this
            house does not become a catalogue by accident.
          </Body>
        </Reveal>
        <ul className="mt-12 divide-y divide-rule border-y border-ink">
          {houseCompetitors.map((house) => (
            <li key={house.name} className="grid gap-4 py-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{house.name}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {house.where}
                </p>
              </div>
              <div className="space-y-3 lg:col-span-7 lg:col-start-6">
                <p className="text-[15px] font-light leading-relaxed text-ink-soft">{house.stance}</p>
                <p className="text-[15px] font-light leading-relaxed text-ink">{house.vs}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>05 · The screen</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Visual reading, site and phone.
          </Display>
        </Reveal>
        <ul className="mt-12 space-y-10">
          {houseVisualAudit.map((item) => (
            <li key={item.surface} className="grid gap-3 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-3">
                {item.surface}
                <span className="mt-2 block">{item.rank}</span>
              </p>
              <p className="text-[15px] font-light leading-relaxed text-ink-soft lg:col-span-8">
                {item.finding}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
        <Reveal>
          <Eyebrow>06 · Next</Eyebrow>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Scope that still belongs to the house.
          </Display>
        </Reveal>
        <ol className="mt-12 space-y-5">
          {houseScope.map((line, index) => (
            <li key={line} className="flex gap-6 text-[15px] font-light leading-relaxed text-ink-soft">
              <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {String(index + 1).padStart(2, '0')}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

export function AdminPage() {
  usePageMeta(getShareMeta('/admin'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <Eyebrow>The ledger</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
          The house board.
        </Display>
        {clerkEnabled ? (
          <AdminGate />
        ) : (
          <Body className="mt-6">
            Account is not configured. Set Clerk, then list the house emails.
          </Body>
        )}
        <div className="mt-16">
          <TextLink to="/">Return to the house</TextLink>
        </div>
      </Container>
    </Section>
  )
}

function AdminGate() {
  const { user, isLoaded } = useUser()
  if (!isLoaded) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the house.</p>
  }
  const listed = isAdminEmail(user?.primaryEmailAddress?.emailAddress)

  return (
    <>
      <Show when="signed-out">
        <SignedOutBoard />
      </Show>
      <Show when="signed-in">{listed ? <OpenBoard /> : <ClosedBoard />}</Show>
    </>
  )
}
