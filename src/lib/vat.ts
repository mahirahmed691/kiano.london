/** UK VAT 20% inclusive. VAT = round(gross × 20/120). Carriage is included and £0. */
export const VAT_RATE = 20
export const VAT_FRACTION = 20 / 120

export function vatFromGross(grossPence: number) {
  if (!Number.isFinite(grossPence) || grossPence <= 0) return 0
  return Math.round(grossPence * VAT_FRACTION)
}

export function splitVat(grossPence: number) {
  const safe = Number.isFinite(grossPence) ? Math.max(0, Math.round(grossPence)) : 0
  const vatPence = vatFromGross(safe)
  return { grossPence: safe, vatPence, netPence: safe - vatPence }
}

export const vatMethodNote =
  'UK VAT 20% inclusive. For each paid line, VAT is round(gross × 20/120) and net is the remainder. Carriage is included and £0. This is a simple tax invoice, not a Making Tax Digital return.'
