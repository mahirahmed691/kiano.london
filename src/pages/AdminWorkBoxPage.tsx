import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BoxFaceSheet } from '@/components/packing/BoxFaceSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import type { LedgerOrder } from '@/lib/ledger'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminWorkBoxPage() {
  const { getToken } = useAuth()
  const [params] = useSearchParams()
  const orderId = params.get('id') ?? ''
  const [order, setOrder] = useState<LedgerOrder | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'The box — Kiano London',
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
        const next = data.orders?.find((entry) => entry.id === orderId)
        if (!response.ok || !next) {
          setError(data.error || 'That reservation could not be found.')
          return
        }
        setOrder(next)
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
        <Eyebrow>The box</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/work">Return to the work</TextLink>
        </div>
      </>
    )
  }

  if (!order) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the box.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/work">The work</TextLink>
        <Link
          to={`/admin/work/card?id=${encodeURIComponent(order.id)}`}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          The house card
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <BoxFaceSheet order={order} />
      <p className="no-print mt-12">
        <Link to="/admin/work" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the work
        </Link>
      </p>
    </>
  )
}
