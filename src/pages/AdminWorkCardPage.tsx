import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HouseCardSheet } from '@/components/packing/HouseCardSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import { houseCardFromLedger, type HouseCard } from '@/lib/house-card'
import type { LedgerOrder } from '@/lib/ledger'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminWorkCardPage() {
  const { getToken } = useAuth()
  const [params] = useSearchParams()
  const orderId = params.get('id') ?? ''
  const [card, setCard] = useState<HouseCard | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'House card — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!orderId) {
        setError('That reservation could not be found.')
        return
      }
      try {
        const token = await getToken()
        const response = await fetch(
          `/api/admin?section=work&id=${encodeURIComponent(orderId)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
        )
        const data = (await response.json()) as { orders?: LedgerOrder[]; error?: string }
        if (cancelled) return
        const order = data.orders?.find((entry) => entry.id === orderId)
        if (!response.ok || !order) {
          setError(data.error || 'That reservation could not be found.')
          return
        }
        setCard(houseCardFromLedger(order))
      } catch {
        if (!cancelled) setError('That reservation could not be found.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, orderId])

  if (error) {
    return (
      <>
        <Eyebrow>House card</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/work">Return to the work</TextLink>
        </div>
      </>
    )
  }

  if (!card) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the card.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/work">The work</TextLink>
        <Link
          to={`/admin/work/box?id=${encodeURIComponent(orderId)}`}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          The box
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <HouseCardSheet card={card} />
      <p className="no-print mt-12">
        <Link to="/admin/work" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the work
        </Link>
      </p>
    </>
  )
}
