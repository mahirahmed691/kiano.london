export function formatGbp(pence: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(pence / 100)
}

export function formatGbpExact(pence: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pence / 100)
}

/** £79 for whole pounds, £82.95 when there are pence. */
export function formatGbpSmart(pence: number) {
  return pence % 100 === 0 ? formatGbp(pence) : formatGbpExact(pence)
}
