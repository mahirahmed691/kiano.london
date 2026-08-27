import { useSearchParams } from 'react-router-dom'
import type { ProductColour } from '@/data/products'

export type ColourFilterValue = 'All' | ProductColour

export function useColourFilter(allowed: readonly ProductColour[]) {
  const [params, setParams] = useSearchParams()
  const raw = params.get('colour')
  const colour: ColourFilterValue =
    raw && (allowed as readonly string[]).includes(raw) ? (raw as ProductColour) : 'All'

  function setColour(next: ColourFilterValue) {
    const nextParams = new URLSearchParams(params)
    if (next === 'All') nextParams.delete('colour')
    else nextParams.set('colour', next)
    setParams(nextParams, { replace: true })
  }

  return [colour, setColour] as const
}
