import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DiaryBookSheet } from '@/components/admin/DiaryBookSheet'
import type { AppointmentRow } from '@/components/admin/ledger-state'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import { asLetterKind, asLetterStatus, storedNamedFor } from '@/lib/letters'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

function asDiaryRow(row: AppointmentRow): AppointmentRow {
  return {
    ...row,
    kind: asLetterKind(row.kind),
    reference: row.reference ?? '',
    status: asLetterStatus(row.status),
    namedFor: storedNamedFor(row.namedFor),
    reply: row.reply ?? '',
  }
}

export function AdminDiaryBookPage() {
  const { getToken } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentRow[] | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'The diary — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=diary', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { appointments?: AppointmentRow[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The diary could not be read.')
          return
        }
        setAppointments((data.appointments ?? []).map(asDiaryRow))
      } catch {
        if (!cancelled) setError('The diary could not be read.')
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
        <Eyebrow>The diary</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/diary">Return to the diary</TextLink>
        </div>
      </>
    )
  }

  if (!appointments) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the diary.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/diary">The diary</TextLink>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <DiaryBookSheet appointments={appointments} />
      <p className="no-print mt-12">
        <Link to="/admin/diary" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the diary
        </Link>
      </p>
    </>
  )
}
