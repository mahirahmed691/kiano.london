import {
  channelsCopyFor,
  fieldReading,
  formatPriceBand,
  mergeFieldNotes,
  priceAxisMax,
  type CompetitorHouse,
  type CompetitorLedgerNote,
} from '@/data/competitors'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'

function BandPlot({ house, max }: { house: CompetitorHouse; max: number }) {
  const low = house.priceLowPence
  const high = house.priceHighPence
  const published = house.priceStatus !== 'unpublished' && low != null && high != null && max > 0

  return (
    <div className="relative h-8">
      <div className="absolute top-1/2 right-0 left-0 h-px bg-rule" />
      {published ? (
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-ink"
          style={{
            left: `${(low / max) * 100}%`,
            width: `${Math.max(((high - low) / max) * 100, 1.2)}%`,
          }}
        />
      ) : (
        <div className="absolute top-1/2 right-0 left-0 h-px border-t border-dashed border-stone/50 bg-transparent" />
      )}
    </div>
  )
}

function HouseBlock({ house, max }: { house: CompetitorHouse; max: number }) {
  return (
    <article
      className={
        house.isKiano
          ? 'border-y border-ink py-10'
          : 'border-b border-rule py-10'
      }
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:items-baseline">
        <div className="lg:col-span-4">
          {house.isKiano ? (
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">This house</p>
          ) : null}
          <p className="font-display text-3xl font-light">{house.name}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">{house.origin}</p>
          {house.url ? (
            <a
              href={house.url}
              className="mt-3 inline-block text-[13px] font-light text-ink-soft underline decoration-rule underline-offset-4 transition-opacity hover:opacity-70"
            >
              The shop
            </a>
          ) : null}
        </div>
        <div className="lg:col-span-8">
          <p className="font-display text-4xl font-light md:text-5xl">
            {formatPriceBand(house)}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
            {house.priceStatus === 'converted' ? 'Converted to sterling' : null}
            {house.priceStatus === 'published' ? 'Sterling as published' : null}
            {house.priceStatus === 'unpublished' ? 'No public unit' : null}
          </p>
          <BandPlot house={house} max={max} />
        </div>
      </div>

      <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Channel</dt>
          <dd className="mt-2 text-[15px] font-light text-ink-soft">{channelsCopyFor(house)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Garment</dt>
          <dd className="mt-2 text-[15px] font-light text-ink-soft">{house.garmentLabel}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Lead</dt>
          <dd className="mt-2 text-[15px] font-light text-ink-soft">{house.lead}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Fit</dt>
          <dd className="mt-2 text-[15px] font-light text-ink-soft">{house.fitLabel}</dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Cuts</p>
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-soft">{house.cuts}</p>
        </div>
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Packing</p>
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-soft">{house.scentLabel}</p>
        </div>
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Against this house</p>
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink">{house.vs}</p>
        </div>
      </div>

      <p className="mt-8 max-w-prose text-[14px] font-light leading-relaxed text-stone">
        {house.priceNote} {house.sourced ? `Source: ${house.sourced}.` : ''}
      </p>
    </article>
  )
}

export function CompetitorField({ notes = [] }: { notes?: CompetitorLedgerNote[] }) {
  const houses = mergeFieldNotes(notes)
  const max = priceAxisMax(houses)
  const ranked = [...houses].sort((a, b) => {
    if (a.isKiano) return -1
    if (b.isKiano) return 1
    const aHigh = a.priceHighPence ?? -1
    const bHigh = b.priceHighPence ?? -1
    return bHigh - aHigh
  })

  return (
    <div>
      <Reveal>
        <Eyebrow>04 · The field</Eyebrow>
        <Display as="h2" className="mt-4 text-4xl md:text-5xl">
          Other houses of the column.
        </Display>
        <Body className="mt-6">{fieldReading}</Body>
      </Reveal>

      <div className="mt-12 hidden border-t border-ink lg:grid lg:grid-cols-12 lg:gap-4 lg:py-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-3">House</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">Sterling</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">Channel</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-3">Lead</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">Fit</p>
      </div>
      <ul className="hidden divide-y divide-rule border-b border-ink lg:block">
        {ranked.map((house) => (
          <li key={house.id} className="py-6">
            <div className="grid grid-cols-12 items-baseline gap-4">
              <div className="col-span-3">
                <p className="font-display text-2xl font-light">{house.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone">{house.origin}</p>
              </div>
              <p className="col-span-2 font-display text-2xl font-light">{formatPriceBand(house)}</p>
              <p className="col-span-2 text-[14px] font-light text-ink-soft">{channelsCopyFor(house)}</p>
              <p className="col-span-3 text-[14px] font-light text-ink-soft">{house.lead}</p>
              <p className="col-span-2 text-[14px] font-light text-ink-soft">{house.fitLabel}</p>
            </div>
            <BandPlot house={house} max={max} />
          </li>
        ))}
      </ul>
      <p className="mt-3 hidden text-[11px] uppercase tracking-[0.22em] text-stone lg:block">
        Hairline is the published band, left to right against the dearest high in the field.
      </p>

      <div className="mt-8 lg:mt-16">
        {ranked.map((house) => (
          <HouseBlock key={house.id} house={house} max={max} />
        ))}
      </div>
    </div>
  )
}
