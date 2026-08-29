import { cn } from '@/lib/cn'

export function LedgerFilter<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (next: T) => void
  options: ReadonlyArray<{ id: T; label: string; count?: number }>
  label: string
}) {
  return (
    <div className="no-print">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{label}</p>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                'text-[11px] uppercase tracking-[0.22em] transition-opacity',
                option.id === value ? 'text-ink' : 'text-stone hover:opacity-70',
              )}
            >
              {option.label}
              {option.count != null ? ` · ${String(option.count).padStart(2, '0')}` : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
