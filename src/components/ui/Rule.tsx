import { cn } from '@/lib/cn'
import { useInViewOnce } from '@/components/ui/Reveal'

export function Rule({ className }: { className?: string }) {
  const { ref, visible } = useInViewOnce()

  return (
    <div ref={ref}>
      <hr className={cn('rule-draw border-0 bg-rule h-px w-full', visible && 'is-visible', className)} />
    </div>
  )
}
