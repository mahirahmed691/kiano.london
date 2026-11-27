import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ThobeSize } from '@/data/products'
import { sizeChart } from '@/data/sizing'
import { cn } from '@/lib/cn'
import { feetToCm, findSize, type Build, type FitPreference } from '@/lib/fit-finder'
import { writeStoredSize } from '@/lib/house-profile'

type Props = {
  onChoose: (size: ThobeSize) => void
  onClose: () => void
  className?: string
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T | ''
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-[10px] uppercase tracking-[0.24em] text-stone">{label}</legend>
      <div className="mt-3 grid grid-cols-3 gap-px bg-rule">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'py-3 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300',
              value === option.value ? 'bg-ink text-ivory' : 'bg-ivory hover:bg-ivory-deep',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function FitFinder({ onChoose, onClose, className }: Props) {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm')
  const [cm, setCm] = useState('')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [build, setBuild] = useState<Build | ''>('')
  const [fit, setFit] = useState<FitPreference | ''>('')

  const height = unit === 'cm' ? Number(cm) : feetToCm(Number(feet), Number(inches || 0))
  const answer = useMemo(
    () => (height && build && fit ? findSize(height, build, fit) : null),
    [height, build, fit],
  )
  const row = answer ? sizeChart.find((r) => r.size === answer.size) : undefined
  const field =
    'w-full border-0 border-b border-ink bg-transparent py-2 text-[16px] font-light outline-none tabular-nums'

  return (
    <div className={cn('fade-in border border-rule bg-ivory p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-2xl font-light">Find your size.</p>
        <button
          type="button"
          className="text-[10px] uppercase tracking-[0.24em] text-stone transition-opacity hover:opacity-70"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <p className="mt-2 text-[13px] font-light leading-relaxed text-stone">
        Three answers. For certainty, measure a thobe you already own.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor={unit === 'cm' ? 'fit-cm' : 'fit-feet'}
              className="text-[10px] uppercase tracking-[0.24em] text-stone"
            >
              Your height
            </label>
            <button
              type="button"
              className="text-[10px] uppercase tracking-[0.24em] underline underline-offset-4"
              onClick={() => setUnit(unit === 'cm' ? 'ft' : 'cm')}
            >
              {unit === 'cm' ? 'Use feet' : 'Use cm'}
            </button>
          </div>
          {unit === 'cm' ? (
            <div className="mt-2 flex items-baseline gap-2">
              <input
                id="fit-cm"
                inputMode="numeric"
                placeholder="178"
                value={cm}
                onChange={(event) => setCm(event.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                className={field}
              />
              <span className="text-[13px] font-light text-stone">cm</span>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-6">
              <div className="flex items-baseline gap-2">
                <input
                  id="fit-feet"
                  inputMode="numeric"
                  placeholder="5"
                  aria-label="Feet"
                  value={feet}
                  onChange={(event) => setFeet(event.target.value.replace(/[^\d]/g, '').slice(0, 1))}
                  className={field}
                />
                <span className="text-[13px] font-light text-stone">ft</span>
              </div>
              <div className="flex items-baseline gap-2">
                <input
                  inputMode="numeric"
                  placeholder="10"
                  aria-label="Inches"
                  value={inches}
                  onChange={(event) => setInches(event.target.value.replace(/[^\d]/g, '').slice(0, 2))}
                  className={field}
                />
                <span className="text-[13px] font-light text-stone">in</span>
              </div>
            </div>
          )}
        </div>

        <Choice
          label="Your build"
          value={build}
          onChange={setBuild}
          options={[
            { value: 'slim', label: 'Slim' },
            { value: 'regular', label: 'Regular' },
            { value: 'broad', label: 'Broad' },
          ]}
        />
        <Choice
          label="How you like it"
          value={fit}
          onChange={setFit}
          options={[
            { value: 'close', label: 'Closer' },
            { value: 'as-cut', label: 'As cut' },
            { value: 'easy', label: 'Easier' },
          ]}
        />
      </div>

      <div className="mt-8 min-h-[5.5rem] border-t border-rule pt-6" aria-live="polite">
        {answer && row ? (
          <div key={answer.size} className="fade-in">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-stone">We suggest</p>
                <p className="mt-1 font-display text-5xl font-light leading-none">{answer.size}</p>
              </div>
              <button
                type="button"
                className="whitespace-nowrap bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ink/85"
                onClick={() => {
                  writeStoredSize(answer.size)
                  onChoose(answer.size)
                  onClose()
                }}
              >
                Choose {answer.size}
              </button>
            </div>
            <p className="mt-3 text-[12px] font-light text-stone tabular-nums">
              Chest {row.chest} cm · Length {row.length} cm · Shoulder {row.shoulder} cm
            </p>
            {answer.note ? (
              <p className="mt-2 text-[13px] font-light leading-relaxed text-ink">{answer.note}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-[13px] font-light text-stone">
            {height && (height < 140 || height > 215)
              ? 'That height is outside what we can suggest from. Write to us.'
              : 'Your size appears here.'}{' '}
            <Link to="/size-guide" className="underline underline-offset-4">
              The full size guide
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
