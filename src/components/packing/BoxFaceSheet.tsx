import { packingNote } from '@/data/packing'
import { site } from '@/data/site'
import { formatOrderAddress, orderReference } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'

export function BoxFaceSheet({ order }: { order: LedgerOrder }) {
  const address = order.shipping ? formatOrderAddress(order.shipping) : []
  const who = order.customerName || order.shipping?.name || order.email

  return (
    <article className="box-face mx-auto max-w-xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.box-face)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .box-face { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">The box</p>
      <p className="mt-6 font-display text-3xl font-light md:text-4xl">{site.fullName}</p>

      {address.length > 0 ? (
        <p className="mt-14 font-display text-4xl font-light leading-[1.15] md:text-5xl">
          {address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : (
        <>
          <p className="mt-14 font-display text-4xl font-light md:text-5xl">{who}</p>
          <p className="mt-6 text-[15px] font-light text-ink-soft">No box address on this reservation.</p>
        </>
      )}

      <ul className="mt-16 text-[15px] font-light text-ink">
        {order.lines.map((line, index) => (
          <li key={`${line.productId}-${index}`}>
            {line.description} · {line.size}
            {line.quantity > 1 ? ` · ${line.quantity}` : ''}
          </li>
        ))}
      </ul>

      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-stone">
        Reference · {orderReference(order.id)}
      </p>
      <p className="mt-6 text-[14px] font-light leading-relaxed text-stone">{packingNote}</p>
    </article>
  )
}
