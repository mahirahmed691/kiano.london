
export function formatLedgerDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export type StockKind = 'sale' | 'restock' | 'adjust'

export type StockMovement = {
  id: number
  productId: string
  size: number
  kind: StockKind
  quantityDelta: number
  quantityAfter: number
  note: string
  adminEmail: string
  orderId: string
  createdAt: string
}

export type LedgerInvoiceLine = {
  productId: string
  size: number
  quantity: number
  description: string
  netPence: number
  vatPence: number
  grossPence: number
}

export type LedgerInvoice = {
  id: number
  number: string
  orderId: string
  email: string
  customerName: string
  issuedAt: string
  netPence: number
  vatPence: number
  grossPence: number
  currency: string
  shipping: {
    name: string | null
    line1: string | null
    line2: string | null
    city: string | null
    region: string | null
    postalCode: string | null
    country: string | null
  } | null
  lines: LedgerInvoiceLine[]
}

export type LedgerOrder = {
  id: string
  email: string
  customerName: string
  clerkUserId: string
  status: string
  amountPence: number
  currency: string
  createdAt: string
  invoiceNumber: string
  stage?: string
  refundedPence?: number
  carrier?: string
  tracking?: string
  readyWeek?: string
  trackingHref?: string
  stageNote?: string
  note?: string
  shipping: LedgerInvoice['shipping']
  lines: {
    productId: string
    size: number
    quantity: number
    amountPence: number
    description: string
  }[]
}

export type LedgerJournalRow = {
  date: string
  reference: string
  description: string
  email: string
  netPence: number
  vatPence: number
  grossPence: number
}

export type LedgerPeriod = {
  netPence: number
  vatPence: number
  grossPence: number
  count: number
}

export type LedgerTillPeriod = LedgerPeriod & {
  billedPence: number
  returnedPence: number
  heldPence: number
}

export type LedgerTillWeek = {
  week: string
  count: number
  heldPence: number
}

export type LedgerTillPiece = {
  productId: string
  units: number
  pence: number
}

export type LedgerTillSize = {
  size: number
  units: number
}

export type LedgerTillCountry = {
  country: string
  count: number
  heldPence: number
}

export type LedgerTillStage = {
  stage: string
  count: number
  heldPence: number
}

export type LedgerTill = {
  month: LedgerTillPeriod
  lastMonth: LedgerTillPeriod
  allTime: LedgerTillPeriod
  openHeldPence: number
  openCount: number
  buyers: number
  returning: number
  weeks: LedgerTillWeek[]
  pieces: LedgerTillPiece[]
  sizes: LedgerTillSize[]
  countries: LedgerTillCountry[]
  pipeline: LedgerTillStage[]
}

export function formatLedgerWeek(iso: string) {
  const stored = iso.slice(0, 10)
  const date = new Date(`${stored}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

export type LedgerMember = {
  email: string
  name: string
  orders: number
  lastPaidAt: string
  lastOrderId: string
  createdAt: string
}

export type LedgerSubscriber = {
  email: string
  confirmed: boolean
  source: string
  createdAt: string
  confirmedAt: string
}

export type PriceRow = {
  productId: string
  name: string
  cut: string
  colour: string
  pricePence: number
  netPence: number
  vatPence: number
  grossPence: number
}

