import { useId, useRef, useState } from 'react'
import {
  formatMeasure,
  measureSpan,
  measureToCm,
  readCut,
  sizeChart,
  sizeMeasures,
  sizeNote,
  sizeRow,
  sketchOf,
  type MeasureKey,
  type MeasureUnit,
} from '@/data/sizing'
import type { ThobeSize } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  compact?: boolean
  chosen?: ThobeSize | ''
  onChoose?: (size: ThobeSize) => void
}

function tapeSpan(key: MeasureKey, unit: MeasureUnit) {
  const span = measureSpan[key]
  if (unit === 'cm') return { min: span.min, max: span.max, step: 1 }
  return {
    min: Math.round((span.min / 2.54) * 10) / 10,
    max: Math.round((span.max / 2.54) * 10) / 10,
    step: 0.1,
  }
}

export function SizeGuide({ className, compact = false, chosen, onChoose }: Props) {
  const uid = useId()
  const [unit, setUnit] = useState<MeasureUnit>('cm')
  const [active, setActive] = useState<MeasureKey>('chest')
  const [anchor, setAnchor] = useState(() => sizeRow(chosen || 56))
  const [moved, setMoved] = useState<Partial<Record<MeasureKey, number>>>({})
  const touched = moved.chest != null || moved.length != null || moved.shoulder != null
  if (!touched && anchor.size !== (chosen || 56)) setAnchor(sizeRow(chosen || 56))
  const tapeCm = {
    chest: moved.chest ?? anchor.chest,
    length: moved.length ?? anchor.length,
    shoulder: moved.shoulder ?? anchor.shoulder,
  }
  const tapeRef = useRef(tapeCm)
  const movedRef = useRef(moved)
  const reading = touched ? readCut(tapeCm) : null
  const tape = reading?.size ?? null
  const [view, setView] = useState<{
    held: ThobeSize
    tape: ThobeSize | null
    kept: ThobeSize | '' | undefined
  }>(() => ({ held: chosen || 56, tape: null, kept: chosen }))

  const nextHeld = tape ?? (chosen || 56)
  if (view.tape !== tape) {
    setView({ held: nextHeld, tape, kept: chosen })
  } else if (view.kept !== chosen) {
    setView({ held: chosen || view.held, tape, kept: chosen })
  }

  const held = view.tape !== tape ? nextHeld : view.kept !== chosen ? chosen || view.held : view.held
  const row = sizeRow(held)
  const activeMeasure = sizeMeasures.find((item) => item.key === active) ?? sizeMeasures[0]

  function hold(size: ThobeSize) {
    setView({ held: size, tape, kept: chosen })
    onChoose?.(size)
  }

  function onSlide(key: MeasureKey, displayValue: number) {
    const asCm = measureToCm(displayValue, unit)
    const next = { ...moved, [key]: asCm }
    const nextTape = {
      chest: next.chest ?? anchor.chest,
      length: next.length ?? anchor.length,
      shoulder: next.shoulder ?? anchor.shoulder,
    }
    tapeRef.current = nextTape
    movedRef.current = next
    setMoved(next)
    setActive(key)
  }

  function give() {
    const hasTape =
      movedRef.current.chest != null ||
      movedRef.current.length != null ||
      movedRef.current.shoulder != null
    if (!hasTape) return
    const named = readCut(tapeRef.current)?.size
    if (named && onChoose && named !== chosen) onChoose(named)
  }

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          'grid items-start gap-8',
          compact ? 'grid-cols-[6.75rem_minmax(0,1fr)] gap-5' : 'md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-16',
        )}
      >
        <CutPlate
          active={active}
          measures={tapeCm}
          marks={{
            chest: formatMeasure(tapeCm.chest, unit),
            length: formatMeasure(tapeCm.length, unit),
            shoulder: formatMeasure(tapeCm.shoulder, unit),
          }}
          onPick={setActive}
        />
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-5xl font-light leading-none">{held}</p>
            <div className="flex gap-4 text-[10px] uppercase tracking-[0.28em]">
              {(['cm', 'in'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={unit === value}
                  onClick={() => setUnit(value)}
                  className={cn(
                    'border-b pb-1 transition-colors duration-300',
                    unit === value ? 'border-ink text-ink' : 'border-transparent text-stone',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-stone">The cut</p>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-soft">
            {formatMeasure(row.chest, unit)} chest
            <span className="mx-2 text-rule" aria-hidden="true">
              /
            </span>
            {formatMeasure(row.length, unit)} length
            <span className="mx-2 text-rule" aria-hidden="true">
              /
            </span>
            {formatMeasure(row.shoulder, unit)} shoulder
          </p>
          <div role="radiogroup" aria-label="Where to measure" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {sizeMeasures.map((item) => (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={active === item.key}
                onClick={() => setActive(item.key)}
                className={cn(
                  'border-b pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300',
                  active === item.key ? 'border-ink text-ink' : 'border-transparent text-stone',
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
          <p className="mt-4 max-w-md text-[13px] font-light leading-relaxed text-ink-soft">
            {activeMeasure.copy}
          </p>
          <p aria-live="polite" className="mt-4 max-w-md text-[13px] font-light leading-relaxed text-stone">
            {reading?.copy ?? 'Move the tape to a thobe you own.'}
          </p>
          {onChoose && reading?.size && reading.size !== chosen ? (
            <button
              type="button"
              onClick={() => onChoose(reading.size as ThobeSize)}
              className="mt-4 text-[10px] uppercase tracking-[0.28em]"
            >
              <span className="border-b border-current pb-0.5">Keep {reading.size}</span>
            </button>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-10 space-y-8">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-stone">From a thobe you own</legend>
        {sizeMeasures.map((item) => {
          const span = tapeSpan(item.key, unit)
          const shown = unit === 'cm' ? tapeCm[item.key] : Number((tapeCm[item.key] / 2.54).toFixed(1))
          const fill = ((shown - span.min) / (span.max - span.min)) * 100
          return (
            <div key={item.key}>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${uid}-${item.key}`} className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  {item.title}
                </label>
                <span className="font-display text-3xl font-light leading-none">
                  {formatMeasure(tapeCm[item.key], unit)}
                </span>
              </div>
              <input
                id={`${uid}-${item.key}`}
                className="house-tape mt-3"
                type="range"
                min={span.min}
                max={span.max}
                step={span.step}
                value={shown}
                aria-valuetext={formatMeasure(tapeCm[item.key], unit)}
                onFocus={() => setActive(item.key)}
                onChange={(event) => onSlide(item.key, Number(event.target.value))}
                onPointerUp={give}
                onKeyUp={give}
                style={{
                  ['--tape-fill' as string]: `linear-gradient(to right, var(--color-ink) ${fill}%, var(--color-rule) ${fill}%)`,
                }}
              />
              <div className="relative mt-2 h-4">
                {sizeChart.map((entry) => {
                  const mark = unit === 'cm' ? entry[item.key] : entry[item.key] / 2.54
                  const left = ((mark - span.min) / (span.max - span.min)) * 100
                  const nearest = sizeChart.reduce((best, candidate) =>
                    Math.abs(candidate[item.key] - tapeCm[item.key]) <
                    Math.abs(best[item.key] - tapeCm[item.key])
                      ? candidate
                      : best,
                  )
                  return (
                    <button
                      key={entry.size}
                      type="button"
                      className={cn(
                        'absolute -translate-x-1/2 text-[10px] tracking-[0.08em]',
                        nearest.size === entry.size ? 'text-ink' : 'text-stone',
                      )}
                      style={{ left: `${left}%` }}
                      aria-label={`Set ${item.title.toLowerCase()} to size ${entry.size}, ${formatMeasure(entry[item.key], unit)}`}
                      onClick={() => {
                        const display =
                          unit === 'cm' ? entry[item.key] : Number((entry[item.key] / 2.54).toFixed(1))
                        onSlide(item.key, display)
                        give()
                      }}
                    >
                      {entry.size}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </fieldset>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">House size chart for the Emirati thobe, sizes 52 to 60</caption>
          <thead>
            <tr className="border-b border-rule text-[11px] uppercase tracking-[0.18em] text-stone">
              <th className="py-3 pr-4 font-normal">Size</th>
              {sizeMeasures.map((item) => (
                <th key={item.key} className="py-3 pr-4 font-normal last:pr-0">
                  <button
                    type="button"
                    aria-pressed={active === item.key}
                    onClick={() => setActive(item.key)}
                    className={cn(
                      'uppercase tracking-[0.18em] transition-colors duration-300',
                      active === item.key ? 'text-ink' : 'text-stone',
                    )}
                  >
                    {item.title}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((entry) => {
              const onPiece = chosen === entry.size
              const readingRow = held === entry.size
              return (
                <tr
                  key={entry.size}
                  onClick={() => hold(entry.size)}
                  className={cn(
                    'cursor-pointer border-b border-rule/70 transition-colors duration-300',
                    readingRow ? 'text-ink' : 'text-ink-soft',
                  )}
                >
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      aria-pressed={readingRow}
                      aria-label={`Size ${entry.size}. Chest ${formatMeasure(entry.chest, unit)}. Length ${formatMeasure(entry.length, unit)}. Shoulder ${formatMeasure(entry.shoulder, unit)}.`}
                      onClick={() => hold(entry.size)}
                      className={cn(
                        'inline-flex h-9 w-9 items-center justify-center font-display text-xl font-light',
                        onPiece && 'bg-ink text-ivory',
                        !onPiece && readingRow && 'bg-ivory-deep text-ink',
                      )}
                    >
                      {entry.size}
                    </button>
                  </td>
                  {sizeMeasures.map((item) => (
                    <td
                      key={item.key}
                      className={cn(
                        'py-3 pr-4 text-[14px] font-light last:pr-0',
                        active === item.key && readingRow ? 'text-ink' : '',
                      )}
                    >
                      {formatMeasure(entry[item.key], unit)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {compact ? null : (
        <p className="mt-8 max-w-xl text-[13px] font-light leading-relaxed text-stone">{sizeNote}</p>
      )}
    </div>
  )
}

function CutPlate({
  active,
  measures,
  marks,
  onPick,
}: {
  active: MeasureKey
  measures: { chest: number; length: number; shoulder: number }
  marks: Record<MeasureKey, string>
  onPick: (key: MeasureKey) => void
}) {
  const sketch = sketchOf(measures)
  const lines = sketch.lines

  return (
    <div className="relative mx-auto w-full max-w-[13.5rem]">
      <svg
        viewBox={`0 0 ${sketch.width} ${sketch.height}`}
        className="h-auto w-full text-ink"
        aria-hidden="true"
      >
        <path d={sketch.body} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" />
        <path d={sketch.collar} fill="none" stroke="currentColor" strokeWidth="1" />
        {lines
          .slice()
          .sort((a, b) => Number(a.key === active) - Number(b.key === active))
          .map((line) => {
            const on = line.key === active
            const horizontal = line.y1 === line.y2
            return (
              <g key={line.key} onClick={() => onPick(line.key)} className="cursor-pointer">
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="transparent"
                  strokeWidth="16"
                />
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="currentColor"
                  strokeWidth={on ? 1.25 : 0.75}
                  className={cn(
                    'transition-colors duration-500 motion-reduce:transition-none',
                    on ? 'text-ink' : 'text-stone/45',
                  )}
                />
                {horizontal ? (
                  <>
                    <line
                      x1={line.x1}
                      y1={line.y1 - 3.5}
                      x2={line.x1}
                      y2={line.y1 + 3.5}
                      stroke="currentColor"
                      strokeWidth={on ? 1.25 : 0.75}
                      className={on ? 'text-ink' : 'text-stone/45'}
                    />
                    <line
                      x1={line.x2}
                      y1={line.y1 - 3.5}
                      x2={line.x2}
                      y2={line.y1 + 3.5}
                      stroke="currentColor"
                      strokeWidth={on ? 1.25 : 0.75}
                      className={on ? 'text-ink' : 'text-stone/45'}
                    />
                  </>
                ) : (
                  <>
                    <line
                      x1={line.x1 - 3.5}
                      y1={line.y1}
                      x2={line.x1 + 3.5}
                      y2={line.y1}
                      stroke="currentColor"
                      strokeWidth={on ? 1.25 : 0.75}
                      className={on ? 'text-ink' : 'text-stone/45'}
                    />
                    <line
                      x1={line.x1 - 3.5}
                      y1={line.y2}
                      x2={line.x1 + 3.5}
                      y2={line.y2}
                      stroke="currentColor"
                      strokeWidth={on ? 1.25 : 0.75}
                      className={on ? 'text-ink' : 'text-stone/45'}
                    />
                  </>
                )}
              </g>
            )
          })}
      </svg>
      {(Object.keys(marks) as MeasureKey[]).map((key) => {
        const line = lines.find((item) => item.key === key) ?? lines[0]
        const spot = { x: (line.x1 + line.x2) / 2, y: (line.y1 + line.y2) / 2 }
        return (
          <span
            key={key}
            className={cn(
              'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-ivory px-1 text-[10px] tracking-[0.08em] transition-colors duration-500 motion-reduce:transition-none',
              active === key ? 'text-ink' : 'text-stone',
            )}
            style={{
              left: `${(spot.x / sketch.width) * 100}%`,
              top: `${(spot.y / sketch.height) * 100}%`,
            }}
          >
            {marks[key]}
          </span>
        )
      })}
    </div>
  )
}
