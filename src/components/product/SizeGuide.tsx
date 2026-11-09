import { useId, useMemo, useState } from 'react'
import {
  formatMeasure,
  measureToCm,
  readCut,
  sizeChart,
  sizeMeasures,
  sizeNote,
  sizeRow,
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

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-2 font-display text-2xl font-light text-ink outline-none transition-colors duration-300 focus:border-ink'

const plate = {
  width: 160,
  height: 320,
  shoulder: { x1: 58, x2: 102, y: 46 },
  chest: { x1: 46, x2: 114, y: 118 },
  length: { x: 80, y1: 62, y2: 300 },
}

function displayNumber(cm: number, unit: MeasureUnit): string {
  if (unit === 'in') return (cm / 2.54).toFixed(1)
  const rounded = Math.round(cm * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function parseDraft(raw: string, unit: MeasureUnit): number | null {
  const trimmed = raw.trim().replace(',', '.')
  if (!trimmed) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value) || value <= 0) return null
  const cm = measureToCm(value, unit)
  return cm >= 20 ? cm : null
}

export function SizeGuide({ className, compact = false, chosen, onChoose }: Props) {
  const uid = useId()
  const [unit, setUnit] = useState<MeasureUnit>('cm')
  const [active, setActive] = useState<MeasureKey>('chest')
  const [cm, setCm] = useState<Partial<Record<MeasureKey, number>>>({})
  const [draft, setDraft] = useState<Record<MeasureKey, string>>({
    chest: '',
    length: '',
    shoulder: '',
  })
  const reading = useMemo(() => readCut(cm), [cm])
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

  function switchUnit(next: MeasureUnit) {
    setUnit(next)
    setDraft({
      chest: cm.chest == null ? '' : displayNumber(cm.chest, next),
      length: cm.length == null ? '' : displayNumber(cm.length, next),
      shoulder: cm.shoulder == null ? '' : displayNumber(cm.shoulder, next),
    })
  }

  function onDraft(key: MeasureKey, raw: string) {
    setActive(key)
    setDraft((current) => ({ ...current, [key]: raw }))
    const next = parseDraft(raw, unit)
    setCm((current) => {
      if (next == null) {
        if (current[key] == null) return current
        const cleared = { ...current }
        delete cleared[key]
        return cleared
      }
      if (current[key] === next) return current
      return { ...current, [key]: next }
    })
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
          marks={{
            chest: formatMeasure(row.chest, unit),
            length: formatMeasure(row.length, unit),
            shoulder: formatMeasure(row.shoulder, unit),
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
                  onClick={() => switchUnit(value)}
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
          <p className="mt-4 text-[13px] font-light leading-relaxed text-ink-soft">
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
            {reading?.copy ?? 'Measure a thobe you own, or choose a size to read the cut.'}
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

      <fieldset className="mt-10">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-stone">From a thobe you own</legend>
        <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-6">
          {sizeMeasures.map((item) => (
            <div key={item.key}>
              <label htmlFor={`${uid}-${item.key}`} className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {item.title}
              </label>
              <input
                id={`${uid}-${item.key}`}
                inputMode="decimal"
                autoComplete="off"
                value={draft[item.key]}
                onFocus={() => setActive(item.key)}
                onChange={(event) => onDraft(item.key, event.target.value)}
                className={fieldClass}
              />
            </div>
          ))}
        </div>
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
  marks,
  onPick,
}: {
  active: MeasureKey
  marks: Record<MeasureKey, string>
  onPick: (key: MeasureKey) => void
}) {
  const lines: {
    key: MeasureKey
    x1: number
    y1: number
    x2: number
    y2: number
  }[] = [
    {
      key: 'length',
      x1: plate.length.x,
      y1: plate.length.y1,
      x2: plate.length.x,
      y2: plate.length.y2,
    },
    {
      key: 'chest',
      x1: plate.chest.x1,
      y1: plate.chest.y,
      x2: plate.chest.x2,
      y2: plate.chest.y,
    },
    {
      key: 'shoulder',
      x1: plate.shoulder.x1,
      y1: plate.shoulder.y,
      x2: plate.shoulder.x2,
      y2: plate.shoulder.y,
    },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[13.5rem]">
      <svg
        viewBox={`0 0 ${plate.width} ${plate.height}`}
        className="h-auto w-full text-ink"
        aria-hidden="true"
      >
        <path
          d="M58 58 L28 70 L18 152 L38 146 L48 92 L46 304 L114 304 L112 92 L122 146 L142 152 L132 70 L102 58 L94 70 L80 76 L66 70 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="miter"
        />
        <path d="M68 60 Q80 74 92 60" fill="none" stroke="currentColor" strokeWidth="1" />
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
        const spot =
          key === 'shoulder'
            ? { x: (plate.shoulder.x1 + plate.shoulder.x2) / 2, y: plate.shoulder.y }
            : key === 'chest'
              ? { x: (plate.chest.x1 + plate.chest.x2) / 2, y: plate.chest.y }
              : { x: plate.length.x, y: (plate.length.y1 + plate.length.y2) / 2 }
        return (
          <span
            key={key}
            className={cn(
              'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-ivory px-1 text-[10px] tracking-[0.08em] transition-colors duration-500 motion-reduce:transition-none',
              active === key ? 'text-ink' : 'text-stone',
            )}
            style={{
              left: `${(spot.x / plate.width) * 100}%`,
              top: `${(spot.y / plate.height) * 100}%`,
            }}
          >
            {marks[key]}
          </span>
        )
      })}
    </div>
  )
}
