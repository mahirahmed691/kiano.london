import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { londonTime, londonTimeLabel } from '@/lib/london-clock'

const TICKS = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI) / 6
  const cardinal = index % 3 === 0
  const inner = cardinal ? 10.55 : 12.05
  const outer = 13.95
  return {
    cardinal,
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
      className={cn('inline-flex items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="h-[1.375rem] w-[1.375rem] md:h-[1.5rem] md:w-[1.5rem]"
      >
        <circle
          cx="16"
          cy="16"
          r="14.7"
          stroke="currentColor"
          strokeWidth="0.95"
        />
        {TICKS.map((tick) => (
          <line
            key={`${tick.x1}-${tick.y1}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="currentColor"
            strokeLinecap="butt"
            strokeWidth={tick.cardinal ? 0.95 : 0.55}
            opacity={tick.cardinal ? 1 : 0.7}
          />
        ))}
        <g transform={`rotate(${hourAngle} 16 16)`}>
          <line
            x1="16"
            y1="18.15"
            x2="16"
            y2="8.2"
            stroke="currentColor"
            strokeLinecap="butt"
            strokeWidth="1.45"
          />
        </g>
        <g transform={`rotate(${minuteAngle} 16 16)`}>
          <line
            x1="16"
            y1="18.7"
            x2="16"
            y2="5.85"
            stroke="currentColor"
            strokeLinecap="butt"
            strokeWidth="0.85"
          />
        </g>
        {reduceMotion ? null : (
          <g transform={`rotate(${secondAngle} 16 16)`}>
            <line
              x1="16"
              y1="19.4"
              x2="16"
              y2="5.4"
              stroke="currentColor"
              strokeLinecap="butt"
              strokeWidth="0.42"
              opacity="0.45"
            />
          </g>
        )}
        <circle cx="16" cy="16" r="0.95" fill="currentColor" />
      </svg>
    </time>
  )
}
