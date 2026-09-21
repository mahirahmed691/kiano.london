import { useAuth, useUser } from '@clerk/react'
import { useEffect, useMemo, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { isAdminUser } from '@/lib/admin'
import { mergePlateLine, nextPlate, type PlateLine, type PlatePost } from '@/lib/instagram-plates'

export function LedgerPlates() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [posts, setPosts] = useState<PlatePost[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false

    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=plates', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { posts?: PlatePost[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The plates could not be read.')
          return
        }
        setPosts(data.posts ?? [])
        setError('')
      } catch {
        if (!cancelled) setError('The plates could not be read.')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  const line = useMemo(() => mergePlateLine(posts ?? []), [posts])
  const next = nextPlate(line)

  if (!isSignedIn || !isAdminUser(user)) {
    return null
  }

  if (error) {
    return (
      <p className="mt-10 text-[15px] font-light text-ink" role="alert">
        {error}
      </p>
    )
  }

  if (posts == null) {
    return <p className="mt-10 text-[15px] font-light text-ink-soft">Reading the plates.</p>
  }

  return (
    <>
      <LedgerFold eyebrow="Next" title="Due on the line" className="mt-16">
        {next.plate ? (
          <PlateRow plate={next.plate} next />
        ) : (
          <p className="text-[15px] font-light text-ink-soft">
            {line.every((plate) => plate.postedAt)
              ? 'The book has gone out. Add a still when there is another walk or another cloth.'
              : 'A plate went out this week. The next still waits.'}
          </p>
        )}
      </LedgerFold>
      <LedgerFold eyebrow="The book" title="Stills, in order" defaultOpen={false}>
        <ul className="divide-y divide-rule border-y border-ink">
          {line.map((plate) => (
            <li key={plate.id}>
              <PlateRow plate={plate} />
            </li>
          ))}
        </ul>
      </LedgerFold>
    </>
  )
}

function PlateRow({ plate, next = false }: { plate: PlateLine; next?: boolean }) {
  return (
    <article className={next ? '' : 'grid gap-6 py-8 lg:grid-cols-12 lg:items-start'}>
      <div className={next ? 'grid gap-6 lg:grid-cols-12 lg:items-start' : 'contents'}>
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {plate.kind === 'reel' ? 'Reel' : plate.kind === 'carousel' ? 'Two stills' : 'Still'}
            {plate.place ? ` · ${plate.place}` : ''}
            {plate.postedAt ? ' · Gone out' : ' · Held'}
          </p>
          <p className="mt-3 font-display text-2xl font-light md:text-3xl">{plate.name}</p>
          <p className="mt-4 max-w-sm whitespace-pre-line text-[15px] font-light leading-relaxed text-ink-soft">
            {plate.caption}
          </p>
          {plate.permalink ? (
            <a
              href={plate.permalink}
              className="mt-4 inline-block text-[13px] font-light text-ink-soft underline decoration-rule underline-offset-4 transition-opacity hover:opacity-70"
            >
              On Instagram
            </a>
          ) : null}
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <img
            src={plate.src}
            alt={plate.alt}
            className="aspect-[3/4] w-full max-w-md bg-ivory-deep object-cover"
          />
        </div>
      </div>
    </article>
  )
}
