import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import type { CompetitorLedgerNote } from '@/data/competitors'
import { isAdminUser } from '@/lib/admin'

export type AppointmentRow = {
  id: number
  name: string
  email: string
  telephone: string
  productId: string
  size: number | null
  note: string
  status: 'new' | 'seen'
  createdAt: string
}

export type HeldCut = {
  productId: string
  size: number
}

export type Ledger = {
  members: number
  orders: number
  reservedPence: number
  listConfirmed: number
  listHeld: number
  cutsRemaining: number
  sizesHeld: number
  appointmentCount: number
  newLetters: number
  workCutting: number
  workPacked: number
  workSent: number
  heldCuts: HeldCut[]
  appointments: AppointmentRow[]
}

export function useLedger() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [ledger, setLedger] = useState<Ledger | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
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
          newLetters: data.newLetters ?? 0,
          workCutting: data.workCutting ?? 0,
          workPacked: data.workPacked ?? 0,
          workSent: data.workSent ?? 0,
          heldCuts: data.heldCuts ?? [],
          appointments: (data.appointments ?? []).map((row) => ({
            ...row,
            status: row.status === 'seen' ? 'seen' : 'new',
          })),
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

  async function markSeen(id: number) {
    try {
      const token = await getToken()
      const response = await fetch('/api/admin?section=diary', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status: 'seen' }),
      })
      if (!response.ok) return
      setLedger((current) =>
        current
          ? {
              ...current,
              appointments: current.appointments.map((row) =>
                row.id === id ? { ...row, status: 'seen' } : row,
              ),
            }
          : current,
      )
    } catch {
      setError('The diary could not be kept.')
    }
  }

  return { ledger, error, markSeen }
}

export function useCompetitorNotes() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [notes, setNotes] = useState<CompetitorLedgerNote[]>([])

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false

    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin-competitors', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { notes?: CompetitorLedgerNote[] }
        if (cancelled || !response.ok) return
        setNotes(data.notes ?? [])
      } catch {
        if (!cancelled) setNotes([])
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  function keepNote(note: CompetitorLedgerNote) {
    setNotes((current) => {
      const without = current.filter(
        (entry) => entry.name.trim().toLowerCase() !== note.name.trim().toLowerCase(),
      )
      return [note, ...without]
    })
  }

  return { notes, keepNote }
}
