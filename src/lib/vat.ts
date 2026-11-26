/**
 * The seller (Prolific Digital Tech Ltd) is not VAT-registered, so no VAT is charged or shown.
 * When it registers, set VAT_REGISTERED to true and add site.trader.vatNumber.
 * Registered: UK VAT 20% inclusive, VAT = round(gross × 20/120). Carriage is included and £0.
 */
export const VAT_REGISTERED: boolean = false
export const VAT_RATE = VAT_REGISTERED ? 20 : 0
export const VAT_FRACTION = VAT_RATE / (100 + VAT_RATE)

export function vatFromGross(grossPence: number) {
  if (!VAT_REGISTERED) return 0
  if (!Number.isFinite(grossPence) || grossPence <= 0) return 0
  return Math.round(grossPence * VAT_FRACTION)
}

export function splitVat(grossPence: number) {
  const safe = Number.isFinite(grossPence) ? Math.max(0, Math.round(grossPence)) : 0
  const vatPence = vatFromGross(safe)
  return { grossPence: safe, vatPence, netPence: safe - vatPence }
}

export const vatMethodNote = VAT_REGISTERED
  ? 'UK VAT 20% inclusive. For each paid line, VAT is round(gross × 20/120) and net is the remainder. Carriage is included and £0. This is a simple tax invoice, not a Making Tax Digital return.'
  : 'The seller is not registered for VAT. No VAT is charged. Carriage is included and £0.'
