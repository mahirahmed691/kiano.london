import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  eyebrow?: string
  children: ReactNode
  defaultOpen?: boolean
  id?: string
  className?: string
}

export function LedgerFold({
  title,
  eyebrow,
  children,
  defaultOpen = true,
  id,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section id={id} className={cn('border-t border-rule pt-10', className)}>
      {eyebrow ? (
        <p className="text-[11px] font-normal uppercase tracking-[0.28em] text-stone">{eyebrow}</p>
      ) : null}
      <h2 className={eyebrow ? 'mt-3' : undefined}>
        <button
          type="button"
          className="flex w-full items-baseline justify-between gap-6 text-left print:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="font-display text-3xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-4xl">
            {title}
          </span>
          <span aria-hidden="true" className="font-display text-3xl font-light leading-none">
            {open ? '−' : '+'}
          </span>
        </button>
        <span className="hidden font-display text-3xl font-light leading-[1.05] tracking-[-0.02em] text-ink print:block md:text-4xl">
          {title}
        </span>
      </h2>
      <div id={panelId} className={cn('mt-8', !open && 'hidden print:block')}>
        {children}
      </div>
    </section>
  )
}
