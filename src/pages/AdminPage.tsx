import { Link } from 'react-router-dom'
import { useLedger } from '@/components/admin/ledger-state'
import { Body, Display } from '@/components/ui/Heading'
import { ledgerNav } from '@/data/admin-nav'
import { houseFeatures } from '@/data/house-board'
import { getProduct, productLineName } from '@/data/products'
import { formatGbp } from '@/lib/money'
import type { Ledger } from '@/components/admin/ledger-state'

function heldCutName(productId: string) {
  const product = getProduct(productId)
  return product ? productLineName(product) : productId
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

  const newLetters = ledger.newLetters ?? 0
  const diaryValue =
    newLetters > 0
      ? `${String(newLetters).padStart(2, '0')} new · ${String(ledger.appointmentCount ?? 0).padStart(2, '0')}`
      : String(ledger.appointmentCount ?? 0).padStart(2, '0')

  const figures: Array<{ label: string; value: string; to?: string }> = [
    { label: 'Reserved', value: String(ledger.orders).padStart(2, '0'), to: '/admin/invoices' },
    { label: 'Held', value: formatGbp(ledger.reservedPence), to: '/admin/accounts' },
    {
      label: 'Cuts remaining',
      value: String(ledger.cutsRemaining),
      to: '/admin/cuts',
    },
    {
      label: 'Sizes held',
      value: String(ledger.sizesHeld).padStart(2, '0'),
      to: '/admin/cuts',
    },
    {
      label: 'Members',
      value: String(ledger.members).padStart(2, '0'),
      to: '/admin/members',
    },
    {
      label: 'The list',
      value: `${ledger.listConfirmed} confirmed · ${ledger.listHeld} held`,
      to: '/admin/list',
    },
    {
      label: 'The diary',
      value: diaryValue,
      to: '/admin/diary',
    },
    {
      label: 'The work',
      value: `${String(ledger.workCutting ?? 0).padStart(2, '0')} cutting · ${String(ledger.workPacked ?? 0).padStart(2, '0')} packed`,
      to: '/admin/work',
    },
  ]

  return (
    <>
      <ul className="mt-12 grid gap-8 border-t border-ink pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure) => {
          const body = (
            <>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{figure.label}</p>
              <p className="mt-3 font-display text-3xl font-light md:text-4xl">{figure.value}</p>
            </>
          )

          return (
            <li key={figure.label}>
              {figure.to ? (
                <Link to={figure.to} className="block transition-opacity hover:opacity-70">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          )
        })}
      </ul>
      {ledger.heldCuts.length > 0 ? (
        <div className="mt-12 border-t border-rule pt-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">At none</p>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {ledger.heldCuts.map((cut) => (
              <li key={`${cut.productId}-${cut.size}`}>
                <Link
                  to="/admin/cuts"
                  className="flex items-baseline justify-between gap-6 py-4 transition-opacity hover:opacity-70"
                >
                  <p className="text-[15px] font-light">{heldCutName(cut.productId)}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{cut.size}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

export function AdminPage() {
  const { ledger, error } = useLedger()
  const mean = Math.round(
    houseFeatures.reduce((sum, feature) => sum + feature.completion, 0) / houseFeatures.length,
  )
  const rooms = ledgerNav.filter((item) => item.to !== '/admin')

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl lg:text-7xl">
        The house board.
      </Display>
      <Body className="mt-6">
        The rooms of the house, counted. Mean completion {mean} of 100.
      </Body>
      <LedgerFigures ledger={ledger} error={error} />

      <ul className="mt-16 divide-y divide-rule border-y border-ink">
        {rooms.map((room) => (
          <li key={room.to}>
            <Link
              to={room.to}
              className="grid gap-2 py-7 transition-opacity hover:opacity-70 lg:grid-cols-12 lg:items-baseline"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-3">
                {room.label}
              </p>
              <p className="font-display text-2xl font-light lg:col-span-8">{room.line}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
