import { site } from '@/data/site'
import { formatOrderAddress, orderReference } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { asWorkStage, isFullyReturned, workCopy, workStages } from '@/lib/work'

function openHouseOrders(orders: LedgerOrder[]) {
  return orders.filter((order) => {
    if (isFullyReturned(order.amountPence, order.refundedPence ?? 0)) return false
    return asWorkStage(order.stage ?? 'reserved') !== 'sent'
  })
}

export function WorkTableSheet({ orders }: { orders: LedgerOrder[] }) {
  const open = openHouseOrders(orders)
  const byStage = workStages
    .filter((stage) => stage !== 'sent')
    .map((stage) => ({
      stage,
      orders: open.filter((order) => asWorkStage(order.stage ?? 'reserved') === stage),
    }))
    .filter((group) => group.orders.length > 0)

  return (
    <article className="work-table mx-auto max-w-3xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.work-table)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .work-table { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Cuts in the house</p>
      <p className="mt-6 font-display text-4xl font-light md:text-5xl">{site.fullName}</p>
      <p className="mt-4 text-[15px] font-light text-ink-soft">
        {open.length === 0
          ? 'None waiting on the table.'
          : `${String(open.length).padStart(2, '0')} still here`}
      </p>

      {byStage.map((group) => (
        <section key={group.stage} className="mt-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {workCopy[group.stage].label}
          </p>
          <ul className="mt-6 divide-y divide-rule border-y border-ink">
            {group.orders.map((order) => {
              const address = order.shipping ? formatOrderAddress(order.shipping) : []
              return (
                <li key={order.id} className="grid gap-6 py-8 sm:grid-cols-12">
                  <div className="sm:col-span-7">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                      {formatLedgerDate(order.createdAt)} · {orderReference(order.id)}
                    </p>
                    <p className="mt-3 font-display text-3xl font-light">
                      {order.customerName || order.email}
                    </p>
                    {order.customerName && order.customerName !== order.email ? (
                      <p className="mt-2 text-[15px] font-light text-ink-soft">{order.email}</p>
                    ) : null}
                    <ul className="mt-4 text-[15px] font-light text-ink">
                      {order.lines.map((line, index) => (
                        <li key={`${line.productId}-${index}`}>
                          {line.description} · {line.size}
                          {line.quantity > 1 ? ` · ${line.quantity}` : ''}
                        </li>
                      ))}
                    </ul>
                    {order.note ? (
                      <p className="mt-4 text-[15px] font-light leading-relaxed text-ink">{order.note}</p>
                    ) : null}
                  </div>
                  <div className="sm:col-span-5">
                    {address.length > 0 ? (
                      <p className="text-[15px] font-light leading-relaxed text-ink-soft">
                        {address.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p className="text-[15px] font-light text-ink-soft">No box address.</p>
                    )}
                    {order.readyWeek ? (
                      <p className="mt-4 text-[13px] font-light text-stone">Week named</p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </article>
  )
}
