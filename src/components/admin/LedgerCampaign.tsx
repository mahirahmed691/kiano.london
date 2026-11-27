import { useAuth } from '@clerk/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { site } from '@/data/site'
import { campaignHtml, type CampaignDraft } from '@/lib/campaign-letter'
import { cn } from '@/lib/cn'
import { formatLedgerDate } from '@/lib/ledger'

type SentLetter = {
  id: number
  subject: string
  recipients: number
  failed: number
  sentBy: string
  sentAt: string
}

const empty: CampaignDraft = {
  subject: '',
  heading: '',
  body: '',
  ctaLabel: 'The Shop',
  ctaHref: 'https://www.kiano.london/shop',
  image: '',
}

const KEY = 'kiano.campaign-draft'

function readDraft(): CampaignDraft {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<CampaignDraft>) } : empty
  } catch {
    return empty
  }
}

const label = 'text-[10px] uppercase tracking-[0.24em] text-stone'
const field =
  'mt-2 w-full border-0 border-b border-ink bg-transparent py-2 text-[15px] font-light outline-none placeholder:text-stone/60'

export function LedgerCampaign() {
  const { getToken } = useAuth()
  const [draft, setDraft] = useState<CampaignDraft>(readDraft)
  const [active, setActive] = useState<number | null>(null)
  const [history, setHistory] = useState<SentLetter[]>([])
  const [busy, setBusy] = useState<'test' | 'send' | null>(null)
  const [status, setStatus] = useState('')
  const [tested, setTested] = useState(false)

  const load = useCallback(async () => {
    try {
      const token = await getToken()
      const response = await fetch('/api/admin?section=campaigns', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = (await response.json()) as { active?: number; campaigns?: SentLetter[] }
      if (response.ok) {
        setActive(data.active ?? 0)
        setHistory(data.campaigns ?? [])
      }
    } catch {
      /* the list below still shows */
    }
  }, [getToken])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(draft))
    } catch {
      /* storage unavailable */
    }
  }, [draft])

  const preview = useMemo(
    () => campaignHtml(draft, '#unsubscribe', site.email),
    [draft],
  )

  function set<K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) {
    setTested(false)
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function post(test: boolean) {
    setStatus('')
    if (!draft.subject.trim() || !draft.body.trim()) {
      setStatus('A subject and a letter are needed.')
      return
    }
    if (!test) {
      const ok = window.confirm(
        `Send "${draft.subject.trim()}" to ${active ?? 0} ${active === 1 ? 'person' : 'people'} on the list? This cannot be undone.`,
      )
      if (!ok) return
    }
    setBusy(test ? 'test' : 'send')
    try {
      const token = await getToken()
      const response = await fetch('/api/admin?section=campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...draft, test, confirm: test ? undefined : 'SEND' }),
      })
      const data = (await response.json()) as {
        error?: string
        to?: string
        sent?: number
        failed?: number
      }
      if (!response.ok) {
        setStatus(data.error || 'The letter could not be sent.')
        return
      }
      if (test) {
        setTested(true)
        setStatus(`A test is on its way to ${data.to}. Check it on your phone before sending.`)
      } else {
        setStatus(
          `Sent to ${data.sent} ${data.sent === 1 ? 'person' : 'people'}${data.failed ? `; ${data.failed} could not be sent` : ''}.`,
        )
        setDraft(empty)
        setTested(false)
        void load()
      }
    } catch {
      setStatus('The letter could not be sent.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <LedgerFold title="Write to the list">
      <p className="max-w-xl text-[14px] font-light leading-relaxed text-ink-soft">
        {active === null
          ? 'Counting the list.'
          : `${active} ${active === 1 ? 'person is' : 'people are'} confirmed and subscribed.`}{' '}
        Every letter carries an unsubscribe link. Send yourself a test first.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="space-y-7">
          <div>
            <label htmlFor="c-subject" className={label}>
              Subject line
            </label>
            <input
              id="c-subject"
              className={field}
              value={draft.subject}
              maxLength={140}
              placeholder="Order by 18 February for Eid"
              onChange={(event) => set('subject', event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="c-heading" className={label}>
              Heading (optional)
            </label>
            <input
              id="c-heading"
              className={field}
              value={draft.heading}
              maxLength={140}
              placeholder="Ready before Eid."
              onChange={(event) => set('heading', event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="c-body" className={label}>
              Letter
            </label>
            <textarea
              id="c-body"
              rows={9}
              className={cn(field, 'resize-y leading-relaxed')}
              value={draft.body}
              placeholder={'A blank line starts a new paragraph.'}
              onChange={(event) => set('body', event.target.value)}
            />
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="c-cta" className={label}>
                Button text
              </label>
              <input
                id="c-cta"
                className={field}
                value={draft.ctaLabel}
                maxLength={40}
                onChange={(event) => set('ctaLabel', event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="c-href" className={label}>
                Button link
              </label>
              <input
                id="c-href"
                className={field}
                value={draft.ctaHref}
                placeholder="https://www.kiano.london/shop"
                onChange={(event) => set('ctaHref', event.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="c-image" className={label}>
              Image link (optional)
            </label>
            <input
              id="c-image"
              className={field}
              value={draft.image ?? ''}
              placeholder="https://www.kiano.london/images/…"
              onChange={(event) => set('image', event.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void post(true)}
              className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory disabled:opacity-40"
            >
              {busy === 'test' ? 'Sending test' : 'Send me a test'}
            </button>
            <button
              type="button"
              disabled={busy !== null || !tested || !active}
              onClick={() => void post(false)}
              className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ink/85 disabled:opacity-35"
              title={tested ? undefined : 'Send yourself a test first'}
            >
              {busy === 'send' ? 'Sending' : `Send to the list${active ? ` (${active})` : ''}`}
            </button>
          </div>
          {status ? (
            <p className="text-[14px] font-light text-ink" role="status">
              {status}
            </p>
          ) : null}
        </div>

        <div>
          <p className={label}>Preview</p>
          <iframe
            title="Letter preview"
            srcDoc={preview}
            sandbox=""
            className="mt-3 h-[38rem] w-full border border-rule bg-ivory"
          />
        </div>
      </div>

      {history.length ? (
        <div className="mt-14">
          <p className={label}>Sent</p>
          <ul className="mt-4 divide-y divide-rule border-y border-ink">
            {history.map((letter) => (
              <li key={letter.id} className="grid gap-2 py-4 sm:grid-cols-12">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-3">
                  {formatLedgerDate(letter.sentAt)}
                </p>
                <p className="text-[15px] font-light sm:col-span-6">{letter.subject}</p>
                <p className="text-[13px] font-light text-stone sm:col-span-3 sm:text-right">
                  {letter.recipients} sent{letter.failed ? ` · ${letter.failed} failed` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </LedgerFold>
  )
}
