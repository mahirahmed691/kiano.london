import { LedgerFold } from '@/components/admin/LedgerFold'
import { Body, Display } from '@/components/ui/Heading'
import {
  houseDataNotes,
  houseFeatures,
  houseIntegrations,
  houseScope,
  houseVisualAudit,
} from '@/data/house-board'

function statusCopy(status: 'complete' | 'partial' | 'missing') {
  if (status === 'complete') return 'Kept'
  if (status === 'partial') return 'In hand'
  return 'Not yet'
}

export function AdminLinePage() {
  const ranked = [...houseFeatures].sort((a, b) => b.completion - a.completion)

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Ranked by how finished it is.
      </Display>
      <Body className="mt-6">
        The line of work, the hooks, what the numbers can say, and what still belongs
        to the house.
      </Body>

      <LedgerFold eyebrow="01 · The line of work" title="Features" className="mt-16">
        <ol className="divide-y divide-rule border-y border-ink">
          {ranked.map((feature, index) => (
            <li key={feature.name} className="grid gap-4 py-8 lg:grid-cols-12 lg:items-baseline">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{feature.name}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {statusCopy(feature.status)} · {feature.completion}
                </p>
              </div>
              <p className="text-[15px] font-light leading-relaxed text-ink-soft lg:col-span-7">
                {feature.note}
              </p>
            </li>
          ))}
        </ol>
      </LedgerFold>

      <LedgerFold eyebrow="02 · Hooks" title="What is wired, and what is not." defaultOpen={false}>
        <ul className="space-y-12">
          {houseIntegrations.map((item) => (
            <li key={item.name} className="grid gap-4 border-t border-rule pt-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{item.name}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {item.state}
                </p>
                <p className="mt-4 text-[13px] font-light text-ink-soft">{item.hook}</p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[15px] font-light leading-relaxed text-ink-soft">{item.events}</p>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-soft">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </LedgerFold>

      <LedgerFold eyebrow="03 · The count" title="What the numbers can say." defaultOpen={false}>
        <div className="grid gap-12 lg:grid-cols-3">
          {houseDataNotes.map((note) => (
            <div key={note.title}>
              <h3 className="font-display text-2xl font-light">{note.title}</h3>
              <Body className="mt-4">{note.copy}</Body>
            </div>
          ))}
        </div>
      </LedgerFold>

      <LedgerFold
        eyebrow="The screen"
        title="Visual reading, site and phone."
        defaultOpen={false}
      >
        <ul className="space-y-10">
          {houseVisualAudit.map((item) => (
            <li key={item.surface} className="grid gap-3 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-3">
                {item.surface}
                <span className="mt-2 block">{item.rank}</span>
              </p>
              <p className="text-[15px] font-light leading-relaxed text-ink-soft lg:col-span-8">
                {item.finding}
              </p>
            </li>
          ))}
        </ul>
      </LedgerFold>

      <LedgerFold eyebrow="Next" title="Scope that still belongs to the house." defaultOpen={false}>
        <ol className="space-y-5">
          {houseScope.map((line, index) => (
            <li key={line} className="flex gap-6 text-[15px] font-light leading-relaxed text-ink-soft">
              <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {String(index + 1).padStart(2, '0')}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </LedgerFold>
    </>
  )
}
