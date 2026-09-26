import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'
import Svg, { Circle, G, Line, Polygon } from 'react-native-svg'

import { londonTime, londonTimeLabel } from '../src/lib/london-clock'
import { color } from './theme'

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
  inverted?: boolean
}

export function HouseClock({ inverted = false }: Props) {
  const [now, setNow] = useState(() => new Date())
  const [reduceMotion, setReduceMotion] = useState(false)
  const ink = inverted ? color.ivory : color.ink
  const { hourAngle, minuteAngle, secondAngle } = londonTime(now)
  const label = londonTimeLabel(now)

  useEffect(() => {
    const apply = (value: boolean) => setReduceMotion(value)
    void AccessibilityInfo.isReduceMotionEnabled().then(apply)
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', apply)
    return () => sub.remove()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), reduceMotion ? 30_000 : 1_000)
    return () => clearInterval(interval)
  }, [reduceMotion])

  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 32 32"
      accessible
      accessibilityRole="image"
      accessibilityLabel={`London, ${label}`}
    >
      <Circle cx="16" cy="16" r="14.9" stroke={ink} strokeWidth="0.48" fill="none" />
      {INDEXES.map((index) => (
        <Line
          key={`${index.x1}-${index.y1}`}
          x1={index.x1}
          y1={index.y1}
          x2={index.x2}
          y2={index.y2}
          stroke={ink}
          strokeLinecap="butt"
          strokeWidth="0.72"
        />
      ))}
      <G rotation={hourAngle} origin="16, 16">
        <Polygon fill={ink} points="15.52,17.55 16.48,17.55 16.28,8.45 15.72,8.45" />
      </G>
      <G rotation={minuteAngle} origin="16, 16">
        <Polygon fill={ink} points="15.76,18.15 16.24,18.15 16.16,6.05 15.84,6.05" />
      </G>
      {reduceMotion ? null : (
        <G rotation={secondAngle} origin="16, 16">
          <Line
            x1="16"
            y1="18.85"
            x2="16"
            y2="5.85"
            stroke={ink}
            strokeLinecap="butt"
            strokeWidth="0.26"
            opacity="0.28"
          />
        </G>
      )}
      <Circle cx="16" cy="16" r="0.58" fill={ink} />
    </Svg>
  )
}
