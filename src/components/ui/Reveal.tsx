import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function useInViewOnce() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 12% of the block, or a quarter of the screen for blocks too tall to ever reach 12%.
        const screen = entry.rootBounds?.height ?? window.innerHeight
        if (
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.12 || entry.intersectionRect.height >= screen * 0.25)
        ) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: [0, 0.05, 0.12], rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: Props) {
  const { ref, visible } = useInViewOnce()

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
