import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { londonTime, londonTimeLabel } from '@/lib/london-clock'

const INDEXES = [0, 3, 6, 9].map((hour) => {
  const angle = (hour * Math.PI) / 6
  const inner = 11.2
  const outer = 13.55
  return {
    x1: 16 + Math.sin(angle) * inner,
    y1: 16 - Math.cos(angle) * inner,
    x2: 16 + Math.sin(angle) * outer,
    y2: 16 - Math.cos(angle) * outer,
  }
})

type Props = {
  className?: string
}

export function HouseClock({ className }: Props) {
  const [now, setNow] = useState(() => new Date())
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduceMotion(motion.matches)
    syncMotion()
    motion.addEventListener('change', syncMotion)
    return () => motion.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    const tick = () => setNow(new Date())
    const interval = window.setInterval(tick, reduceMotion ? 30_000 : 1_000)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  const { hourAngle, minuteAngle, secondAngle, stamp } = londonTime(now)
  const label = londonTimeLabel(now)

  return (
    <time
      dateTime={stamp}
      title="London"
      aria-label={`London, ${label}`}
      className={cn('inline-flex shrink-0 select-none items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="h-[1.375rem] w-[1.375rem] md:h-[1.5rem] md:w-[1.5rem]"
        shapeRendering="geometricPrecision"
      >
        <circle cx="16" cy="16" r="14.9" stroke="currentColor" strokeWidth="0.48" />
        {INDEXES.map((index) => (
          <line
            key={`${index.x1}-${index.y1}`}
            x1={index.x1}
            y1={index.y1}
            x2={index.x2}
            y2={index.y2}
            stroke="currentColor"
            strokeLinecap="butt"
            strokeWidth="0.72"
          />
        ))}
        <g transform={`rotate(${hourAngle} 16 16)`}>
          <polygon fill="currentColor" points="15.52,17.55 16.48,17.55 16.28,8.45 15.72,8.45" />
        </g>
        <g transform={`rotate(${minuteAngle} 16 16)`}>
          <polygon fill="currentColor" points="15.76,18.15 16.24,18.15 16.16,6.05 15.84,6.05" />
        </g>
        {reduceMotion ? null : (
          <g transform={`rotate(${secondAngle} 16 16)`}>
            <line
              x1="16"
              y1="18.85"
              x2="16"
              y2="5.85"
              stroke="currentColor"
              strokeLinecap="butt"
              strokeWidth="0.26"
              opacity="0.28"
            />
          </g>
        )}
        <circle cx="16" cy="16" r="0.58" fill="currentColor" />
      </svg>
    </time>
  )
}
