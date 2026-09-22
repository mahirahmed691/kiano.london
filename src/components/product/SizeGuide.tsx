import { sizeChart, sizeMeasures, sizeNote, sizeNoteAr } from '@/data/sizing'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  compact?: boolean
}

export function SizeGuide({ className, compact = false }: Props) {
  return (
    <div className={cn(className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">House size chart for the Emirati thobe, sizes 52 to 60</caption>
        <thead>
          <tr className="border-b border-rule text-[11px] uppercase tracking-[0.18em] text-stone">
            <th className="py-3 pr-4 font-normal">Size</th>
            <th className="py-3 pr-4 font-normal">Chest</th>
            <th className="py-3 pr-4 font-normal">Length</th>
            <th className="py-3 font-normal">Shoulder</th>
          </tr>
        </thead>
        <tbody>
          {sizeChart.map((row) => (
            <tr key={row.size} className="border-b border-rule/70">
              <td className="py-3 pr-4 font-display text-xl font-light">{row.size}</td>
              <td className="py-3 pr-4 text-[14px] font-light text-ink-soft">{row.chest}</td>
              <td className="py-3 pr-4 text-[14px] font-light text-ink-soft">{row.length}</td>
              <td className="py-3 text-[14px] font-light text-ink-soft">{row.shoulder}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn('mt-8 grid gap-6', compact ? '' : 'sm:grid-cols-3')}>
        {sizeMeasures.map((item) => (
          <div key={item.title}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{item.title}</p>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-soft">{item.copy}</p>
            <p
              lang="ar"
              dir="rtl"
              className="mt-2 w-fit font-arabic text-[15px] font-light leading-relaxed text-ink-soft"
            >
              {item.copyAr}
            </p>
          </div>
        ))}
      </div>
      {compact ? null : (
        <>
          <p className="mt-8 max-w-xl text-[13px] font-light leading-relaxed text-stone">{sizeNote}</p>
          <p
            lang="ar"
            dir="rtl"
            className="mt-3 w-fit max-w-xl font-arabic text-[15px] font-light leading-relaxed text-stone"
          >
            {sizeNoteAr}
          </p>
        </>
      )}
    </div>
  )
}
