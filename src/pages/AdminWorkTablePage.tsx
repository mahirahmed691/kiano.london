import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { WorkTableSheet } from '@/components/packing/WorkTableSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import type { LedgerOrder } from '@/lib/ledger'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminWorkTablePage() {
  const { getToken } = useAuth()
  const [params] = useSearchParams()
  const email = (params.get('email') ?? '').trim()
  const [orders, setOrders] = useState<LedgerOrder[] | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'The table — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const query = new URLSearchParams({ section: 'work' })
        if (email) query.set('email', email)
        const response = await fetch(`/api/admin?${query.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { orders?: LedgerOrder[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The table could not be read.')
          return
        }
        setOrders(data.orders ?? [])
      } catch {
        if (!cancelled) setError('The table could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, email])

  if (error) {
    return (
      <>
        <Eyebrow>The table</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/work">Return to the work</TextLink>
        </div>
      </>
    )
  }

  if (!orders) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the table.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/work">The work</TextLink>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <WorkTableSheet orders={orders} />
      <p className="no-print mt-12">
        <Link to="/admin/work" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the work
        </Link>
      </p>
    </>
  )
}
