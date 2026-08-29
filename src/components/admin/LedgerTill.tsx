import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { getProduct, productLineName } from '@/data/products'
import { shippingCountryName } from '@/data/shipping'
import { isAdminUser } from '@/lib/admin'
import type { LedgerTill, LedgerTillPeriod } from '@/lib/ledger'
import { formatLedgerWeek } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'
import { asWorkStage, workCopy, workStages } from '@/lib/work'

function emptyPeriod(): LedgerTillPeriod {
  return {
    billedPence: 0,
    returnedPence: 0,
    heldPence: 0,
    netPence: 0,
    vatPence: 0,
    grossPence: 0,
    count: 0,
  }
}

function emptyTill(): LedgerTill {
  return {
    month: emptyPeriod(),
    lastMonth: emptyPeriod(),
    allTime: emptyPeriod(),
    openHeldPence: 0,
    openCount: 0,
    buyers: 0,
    returning: 0,
    weeks: [],
    pieces: [],
    sizes: [],
    countries: [],
    pipeline: [],
  }
}

function PeriodBlock({ label, period }: { label: string; period: LedgerTillPeriod }) {
  return (
    <li>
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{label}</p>
      <p className="mt-3 font-display text-4xl font-light md:text-5xl">
        {formatGbpExact(period.heldPence)}
      </p>
      <p className="mt-2 text-[13px] font-light text-ink-soft">
        {period.count === 0
          ? 'No paid cuts'
          : `${String(period.count).padStart(2, '0')} reserved · net ${formatGbpExact(period.netPence)} · VAT ${formatGbpExact(period.vatPence)}`}
      </p>
      {period.returnedPence > 0 ? (
        <p className="mt-1 text-[13px] font-light text-stone">
          {formatGbpExact(period.returnedPence)} returned of {formatGbpExact(period.billedPence)} billed
        </p>
      ) : null}
    </li>
  )
}

function Hairline({ share }: { share: number }) {
  const width = Math.max(share * 100, share > 0 ? 1.2 : 0)
  return (
    <div className="relative h-8">
      <div className="absolute top-1/2 right-0 left-0 h-px bg-rule" />
      {width > 0 ? (
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-ink"
          style={{ width: `${width}%` }}
        />
      ) : null}
    </div>
  )
}

export function LedgerTill() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [till, setTill] = useState<LedgerTill | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=figures', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as LedgerTill & { error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The figures could not be read.')
          return
        }
        setTill({
          ...emptyTill(),
          ...data,
          month: data.month ?? emptyPeriod(),
          lastMonth: data.lastMonth ?? emptyPeriod(),
          allTime: data.allTime ?? emptyPeriod(),
          weeks: data.weeks ?? [],
          pieces: data.pieces ?? [],
          sizes: data.sizes ?? [],
          countries: data.countries ?? [],
          pipeline: data.pipeline ?? [],
        })
      } catch {
        if (!cancelled) setError('The figures could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  if (error && !till) {
    return (
      <p className="mt-16 text-[15px] font-light text-ink" role="alert">
        {error}
      </p>
    )
  }

  if (!till) {
    return <p className="mt-16 text-[15px] font-light text-ink-soft">Reading the till.</p>
  }

  const weekMax = Math.max(...till.weeks.map((row) => row.heldPence), 0)
  const pieceMax = Math.max(...till.pieces.map((row) => row.pence), 0)
  const sizeMax = Math.max(...till.sizes.map((row) => row.units), 0)
  const countryMax = Math.max(...till.countries.map((row) => row.heldPence), 0)
  const average =
    till.allTime.count > 0 ? Math.round(till.allTime.heldPence / till.allTime.count) : 0
  const pipelineByStage = new Map(till.pipeline.map((row) => [asWorkStage(row.stage), row]))

  return (
    <div className="mt-16">
      {error ? (
        <p className="mb-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <LedgerFold title="The till">
        <ul className="grid gap-10 sm:grid-cols-3">
          <PeriodBlock label="This month" period={till.month} />
          <PeriodBlock label="Last month" period={till.lastMonth} />
          <PeriodBlock label="All time" period={till.allTime} />
        </ul>
        <ul className="mt-12 grid gap-10 border-t border-rule pt-10 sm:grid-cols-3">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">A typical cut</p>
            <p className="mt-3 font-display text-4xl font-light">
              {till.allTime.count === 0 ? '—' : formatGbpExact(average)}
            </p>
            <p className="mt-2 text-[13px] font-light text-ink-soft">Held, after returns, divided by paid reservations.</p>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Still in the house</p>
            <p className="mt-3 font-display text-4xl font-light">{formatGbpExact(till.openHeldPence)}</p>
            <p className="mt-2 text-[13px] font-light text-ink-soft">
              {String(till.openCount).padStart(2, '0')} not yet left · not returned
            </p>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Who reserved</p>
            <p className="mt-3 font-display text-4xl font-light">
              {String(till.buyers).padStart(2, '0')}
            </p>
            <p className="mt-2 text-[13px] font-light text-ink-soft">
              {till.returning === 0
                ? 'No second cut yet'
                : `${String(till.returning).padStart(2, '0')} came back`}
            </p>
          </li>
        </ul>
      </LedgerFold>

      <LedgerFold title="The weeks">
        {till.weeks.every((row) => row.count === 0) ? (
          <p className="text-[15px] font-light text-ink-soft">No paid cuts in these twelve weeks.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-ink">
            {till.weeks.map((row) => (
              <li key={row.week} className="grid gap-3 py-5 sm:grid-cols-12 sm:items-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-2">
                  {formatLedgerWeek(row.week)}
                </p>
                <div className="sm:col-span-7">
                  <Hairline share={weekMax > 0 ? row.heldPence / weekMax : 0} />
                </div>
                <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                  {formatGbpExact(row.heldPence)}
                  <span className="mt-1 block text-[13px] text-ink-soft">
                    {String(row.count).padStart(2, '0')} reserved
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </LedgerFold>

      <LedgerFold title="The line">
        {till.pieces.length === 0 ? (
          <p className="text-[15px] font-light text-ink-soft">No cuts reserved yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-ink">
            {till.pieces.map((row) => {
              const product = getProduct(row.productId)
              const name = product ? productLineName(product) : row.productId
              return (
                <li key={row.productId} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-5">
                    <Link
                      to={`/admin/cuts#cut-${row.productId}`}
                      className="font-display text-2xl font-light transition-opacity hover:opacity-70"
                    >
                      {name}
                    </Link>
                    {product ? (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone">
                        {product.cut} · {product.colour}
                      </p>
                    ) : null}
                  </div>
                  <div className="sm:col-span-4">
                    <Hairline share={pieceMax > 0 ? row.pence / pieceMax : 0} />
                  </div>
                  <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                    {formatGbpExact(row.pence)}
                    <span className="mt-1 block text-[13px] text-ink-soft">
                      {String(row.units).padStart(2, '0')} cuts
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </LedgerFold>

      <LedgerFold title="Sizes" defaultOpen={false}>
        {till.sizes.length === 0 ? (
          <p className="text-[15px] font-light text-ink-soft">No sizes written yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-ink">
            {till.sizes.map((row) => (
              <li key={row.size} className="grid gap-3 py-5 sm:grid-cols-12 sm:items-center">
                <p className="font-display text-2xl font-light sm:col-span-3">{row.size}</p>
                <div className="sm:col-span-6">
                  <Hairline share={sizeMax > 0 ? row.units / sizeMax : 0} />
                </div>
                <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                  {String(row.units).padStart(2, '0')} cuts
                </p>
              </li>
            ))}
          </ul>
        )}
      </LedgerFold>

      <LedgerFold title="Where it went" defaultOpen={false}>
        {till.countries.length === 0 ? (
          <p className="text-[15px] font-light text-ink-soft">No box addresses yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-ink">
            {till.countries.map((row) => (
              <li key={row.country || 'none'} className="grid gap-3 py-5 sm:grid-cols-12 sm:items-center">
                <p className="font-display text-2xl font-light sm:col-span-5">
                  {row.country ? shippingCountryName(row.country) || row.country : 'No country kept'}
                </p>
                <div className="sm:col-span-4">
                  <Hairline share={countryMax > 0 ? row.heldPence / countryMax : 0} />
                </div>
                <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                  {formatGbpExact(row.heldPence)}
                  <span className="mt-1 block text-[13px] text-ink-soft">
                    {String(row.count).padStart(2, '0')} reserved
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </LedgerFold>

      <LedgerFold title="Still moving">
        <ul className="divide-y divide-rule border-y border-ink">
          {workStages.map((stage) => {
            const row = pipelineByStage.get(stage)
            const count = row?.count ?? 0
            const held = row?.heldPence ?? 0
            return (
              <li key={stage}>
                <Link
                  to={`/admin/work?stage=${stage}`}
                  className="grid gap-3 py-6 transition-opacity hover:opacity-70 sm:grid-cols-12 sm:items-baseline"
                >
                  <p className="font-display text-2xl font-light sm:col-span-5">{workCopy[stage].label}</p>
                  <p className="text-[13px] font-light text-ink-soft sm:col-span-4">{workCopy[stage].line}</p>
                  <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                    {formatGbpExact(held)}
                    <span className="mt-1 block text-[13px] text-ink-soft">
                      {String(count).padStart(2, '0')}
                    </span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </LedgerFold>
    </div>
  )
}
