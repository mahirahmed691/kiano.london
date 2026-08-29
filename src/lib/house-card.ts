import { orderReference, type CheckoutOrder } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'

export type HouseCardPiece = {
  name: string
  size: number
  quantity: number
}

export type HouseCard = {
  reference: string
  pieces: HouseCardPiece[]
  line: string
}

export function houseCardFromOrder(order: {
  id: string
  note?: string | null
  lines: { description: string; size?: number | null; quantity: number }[]
}): HouseCard {
  return {
    reference: orderReference(order.id),
    pieces: order.lines.map((line) => ({
      name: line.description,
      size: line.size ?? 0,
      quantity: line.quantity,
    })),
    line: (order.note ?? '').trim(),
  }
}

export function houseCardFromCheckout(order: CheckoutOrder): HouseCard {
  return houseCardFromOrder({
    id: order.id,
    note: order.note,
    lines: order.lines.map((line) => ({
      description: line.description,
      size: line.size,
      quantity: line.quantity,
    })),
  })
}

export function houseCardFromLedger(order: LedgerOrder): HouseCard {
  return houseCardFromOrder(order)
}

export function isHouseCard(value: unknown): value is HouseCard {
  if (!value || typeof value !== 'object') return false
  const card = value as HouseCard
  return typeof card.reference === 'string' && Array.isArray(card.pieces)
}
