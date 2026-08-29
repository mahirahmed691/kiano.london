import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CutsBookSheet, type CutRow } from '@/components/admin/CutsBookSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminCutsBookPage() {
  const { getToken } = useAuth()
  const [cuts, setCuts] = useState<CutRow[] | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'The line — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin-inventory', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { cuts?: CutRow[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'Remaining cuts could not be read.')
          return
        }
        setCuts(data.cuts ?? [])
      } catch {
        if (!cancelled) setError('Remaining cuts could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken])

  if (error) {
    return (
      <>
        <Eyebrow>The line</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/cuts">Return to the cuts</TextLink>
        </div>
      </>
    )
  }

  if (!cuts) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading remaining cuts.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/cuts">The cuts</TextLink>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <CutsBookSheet cuts={cuts} />
      <p className="no-print mt-12">
        <Link to="/admin/cuts" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the cuts
        </Link>
      </p>
    </>
  )
}
