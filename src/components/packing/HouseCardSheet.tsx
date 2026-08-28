import { careLine, packingNote } from '@/data/packing'
import { site } from '@/data/site'
import type { HouseCard } from '@/lib/house-card'

export function HouseCardSheet({ card }: { card: HouseCard }) {
  return (
    <article className="house-card mx-auto max-w-lg">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.house-card)), .no-print { display: none !important; }
          body, #root { background: #F2EBDC !important; color: #1B1714 !important; }
          .house-card { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">House card</p>
      <p className="mt-6 font-display text-4xl font-light md:text-5xl">{site.fullName}</p>
      <ul className="mt-12 divide-y divide-rule border-y border-ink">
        {card.pieces.map((piece, index) => (
          <li key={`${piece.name}-${index}`} className="py-6">
            <p className="font-display text-3xl font-light">{piece.name}</p>
            {piece.size > 0 || piece.quantity > 1 ? (
              <p className="mt-2 text-[13px] font-light uppercase tracking-[0.18em] text-stone">
                {[
                  piece.size > 0 ? `Size ${piece.size}` : null,
                  piece.quantity > 1 ? String(piece.quantity) : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {card.line ? (
        <p className="mt-12 text-[16px] font-light leading-relaxed text-ink">{card.line}</p>
      ) : null}
      <p className="mt-12 text-[15px] font-light leading-relaxed text-ink-soft">{careLine}</p>
      <p className="mt-6 text-[14px] font-light leading-relaxed text-stone">{packingNote}</p>
      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-stone">
        Reference · {card.reference}
      </p>
    </article>
  )
}
