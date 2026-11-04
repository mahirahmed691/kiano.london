import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { trustPoints } from '@/data/policies'
import { cn } from '@/lib/cn'

export function TrustBar({ className }: { className?: string }) {
  return (
    <section aria-label="Delivery, returns and checkout" className={cn('border-y border-rule bg-ivory', className)}>
      <Container>
        <ul className="grid gap-x-8 gap-y-6 py-8 sm:grid-cols-2 lg:grid-cols-5">
          {trustPoints.map((point) => (
            <li key={point.title}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink">{point.title}</p>
              <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-soft">{point.detail}</p>
            </li>
          ))}
        </ul>
        <p className="border-t border-rule py-4 text-[12px] font-light text-ink-soft">
          <Link to="/delivery" className="underline underline-offset-4 hover:opacity-70">
            Delivery
          </Link>
          <span aria-hidden="true"> · </span>
          <Link to="/returns" className="underline underline-offset-4 hover:opacity-70">
            Returns
          </Link>
          <span aria-hidden="true"> · </span>
          <Link to="/visit" className="underline underline-offset-4 hover:opacity-70">
            Book an atelier visit
          </Link>
        </p>
      </Container>
    </section>
  )
}
