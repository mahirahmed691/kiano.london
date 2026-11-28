import { Link } from 'react-router-dom'
import { Body } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { careLine } from '@/data/packing'
import { getProduct, productLineName, productPath } from '@/data/products'
import { orderReference, returnPath } from '@/lib/checkout'
import { cn } from '@/lib/cn'
import { houseCardFromOrder } from '@/lib/house-card'
import { asLetterKind, asLetterStatus, letterLine } from '@/lib/letters'
import { formatGbp } from '@/lib/money'
import {
  asWorkStage,
  dispatchLine,
  formatNamedWeek,
  isFullyReturned,
  isPartReturned,
  workCopy,
} from '@/lib/work'

export type HeldOrder = {
  id: string
  createdAt: string
  amountPence: number
  currency: string
  status: string
  stage?: string
  refundedPence?: number
  returned?: boolean
  carrier?: string
  tracking?: string
  trackingHref?: string
  readyWeek?: string
  stageNote?: string
  note?: string
  dispatch?: string
  lines: {
    productId: string
    size: number
    quantity: number
    amountPence: number
    description: string
  }[]
}

export type HeldLetter = {
  id: number
  kind: 'visit' | 'return' | 'wait'
  status: string
  namedFor?: string
  reply?: string
  productId?: string
  size?: number | null
  reference?: string
  createdAt: string
}

function formatOrderDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function HeldCuts({
  orders,
  letters,
  empty,
}: {
  orders: HeldOrder[]
  letters: HeldLetter[]
  empty?: string
}) {
  if (orders.length === 0) {
    return (
      <div className="mt-10">
        <Body>{empty ?? 'No orders yet.'}</Body>
        <HeldLetters letters={letters} />
        <div className="mt-8">
          <Button to="/shop">The Shop</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ul className="mt-12 divide-y divide-rule border-t border-ink">
        {orders.map((order) => (
          <li key={order.id} className="py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {formatOrderDate(order.createdAt)} · {orderReference(order.id)}
              </p>
              <p className="font-display text-2xl font-light">{formatGbp(order.amountPence)}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {order.lines.map((line, index) => {
                const product = getProduct(line.productId)
                return (
                  <li key={`${order.id}-${line.productId}-${line.size}-${index}`}>
                    <Link
                      to={product ? productPath(product) : '/shop'}
                      className="text-[15px] font-light text-ink transition-opacity hover:opacity-70"
                    >
                      {line.description}
                      {line.quantity > 1 ? ` × ${line.quantity}` : ''}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 font-display text-3xl font-light md:text-4xl">
              {isFullyReturned(order.amountPence, order.refundedPence ?? 0)
                ? 'The reservation has been returned.'
                : `${workCopy[asWorkStage(order.stage)].memberTitle}.`}
            </p>
            {isFullyReturned(order.amountPence, order.refundedPence ?? 0) ? null : (
              <OrderProgress stage={asWorkStage(order.stage)} />
            )}
            <p className="mt-3 text-[14px] font-light text-ink-soft">
              {isFullyReturned(order.amountPence, order.refundedPence ?? 0)
                ? 'The reservation has been returned.'
                : isPartReturned(order.amountPence, order.refundedPence ?? 0)
                  ? `The reservation has been returned in part · ${formatGbp(order.refundedPence ?? 0)}.`
                  : asWorkStage(order.stage) === 'sent'
                    ? dispatchLine(order.carrier ?? '', order.tracking ?? '')
                    : workCopy[asWorkStage(order.stage)].line}
            </p>
            {!isFullyReturned(order.amountPence, order.refundedPence ?? 0) && order.readyWeek ? (
              <p className="mt-2 text-[14px] font-light text-ink-soft">
                The house names the week of {formatNamedWeek(order.readyWeek)}.
              </p>
            ) : null}
            {!isFullyReturned(order.amountPence, order.refundedPence ?? 0) && order.stageNote ? (
              <p className="mt-2 text-[14px] font-light text-ink">{order.stageNote}</p>
            ) : null}
            {order.note ? (
              <p className="mt-4 text-[15px] font-light leading-relaxed text-ink">{order.note}</p>
            ) : null}
            {!isFullyReturned(order.amountPence, order.refundedPence ?? 0) &&
            (asWorkStage(order.stage) === 'packed' || asWorkStage(order.stage) === 'sent') ? (
              <p className="mt-2 text-[14px] font-light text-ink-soft">{careLine}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                to={`/order/invoice?session_id=${encodeURIComponent(order.id)}`}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
              >
                Print the receipt
              </Link>
              <Link
                to={`/order/card?session_id=${encodeURIComponent(order.id)}`}
                state={{ card: houseCardFromOrder(order) }}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
              >
                The house card
              </Link>
              {order.lines[0]?.productId ? (
                <Link
                  to={
                    order.lines[0].size
                      ? `/visit?piece=${encodeURIComponent(order.lines[0].productId)}&size=${order.lines[0].size}`
                      : `/visit?piece=${encodeURIComponent(order.lines[0].productId)}`
                  }
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                >
                  Enquire to visit
                </Link>
              ) : null}
              <Link
                to={returnPath({
                  reference: orderReference(order.id),
                  productId: order.lines[0]?.productId,
                  size: order.lines[0]?.size,
                })}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
              >
                Write if it must return
              </Link>
              {order.trackingHref && asWorkStage(order.stage) === 'sent' ? (
                <a
                  href={order.trackingHref}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                >
                  Follow it
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <HeldLetters letters={letters} />
    </>
  )
}

function HeldLetters({ letters }: { letters: HeldLetter[] }) {
  if (letters.length === 0) return null

  return (
    <div className="mt-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Messages</p>
      <ul className="mt-6 divide-y divide-rule border-t border-ink">
        {letters.map((letter) => {
          const product = letter.productId ? getProduct(letter.productId) : undefined
          const piece = product
            ? productLineName(product)
            : letter.kind === 'wait'
              ? 'A size'
              : letter.kind === 'return'
              ? 'An order'
              : 'A visit'
          const kind = asLetterKind(letter.kind)
          const status = asLetterStatus(letter.status)
          const line = letterLine({
            kind,
            status,
            namedFor: letter.namedFor,
            reply: letter.reply,
          })
          const extra =
            letter.kind !== 'wait' &&
            (status === 'named' || status === 'agreed') &&
            letter.reply?.trim()
              ? letter.reply.trim()
              : ''
          return (
            <li key={letter.id} className="py-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {formatOrderDate(letter.createdAt)}
                {letter.reference ? ` · ${letter.reference}` : ''}
              </p>
              <p className="mt-3 font-display text-2xl font-light">{piece}</p>
              {letter.size ? (
                <p className="mt-1 text-[15px] font-light text-ink-soft">Size {letter.size}</p>
              ) : null}
              <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-soft">{line}</p>
              {extra ? (
                <p className="mt-2 text-[15px] font-light leading-relaxed text-ink">{extra}</p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Reserved → On the table → Packed → Left the house. "Held for cloth" is a pause inside the first step. */
const progressSteps = ['reserved', 'cutting', 'packed', 'sent'] as const

function OrderProgress({ stage }: { stage: ReturnType<typeof asWorkStage> }) {
  const at = stage === 'cloth' ? 0 : progressSteps.indexOf(stage as (typeof progressSteps)[number])
  const index = Math.max(0, at)
  const fill = (index / (progressSteps.length - 1)) * 100

  return (
    <div className="mt-8 max-w-xl" aria-label={`Progress: ${workCopy[stage].label}`}>
      <div className="relative mx-[5px] h-px bg-rule">
        <div
          className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${fill}%` }}
        />
      </div>
      <ol className="-mt-[6px] grid grid-cols-4">
        {progressSteps.map((step, i) => {
          const reached = i <= index
          const current = i === index
          return (
            <li
              key={step}
              className={cn(
                'flex flex-col',
                i === 0 && 'items-start',
                i > 0 && i < progressSteps.length - 1 && 'items-center text-center',
                i === progressSteps.length - 1 && 'items-end text-right',
              )}
              aria-current={current ? 'step' : undefined}
            >
              <span
                className={cn(
                  'block size-[11px] rounded-full border',
                  reached ? 'border-ink bg-ink' : 'border-rule bg-ivory',
                  current && 'ring-4 ring-ink/10',
                )}
              />
              <span
                className={cn(
                  'mt-3 text-[10px] uppercase leading-snug tracking-[0.2em]',
                  reached ? 'text-ink' : 'text-stone',
                )}
              >
                {workCopy[step].label}
              </span>
              {current && stage === 'cloth' ? (
                <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-bronze">
                  Waiting on cloth
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
