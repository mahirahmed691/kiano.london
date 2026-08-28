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

export function houseCardFromCheckout(order: CheckoutOrder): HouseCard {
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

export function houseCardFromLedger(order: LedgerOrder): HouseCard {
  return {
    reference: orderReference(order.id),
    pieces: order.lines.map((line) => ({
      name: line.description,
      size: line.size,
      quantity: line.quantity,
    })),
    line: (order.note ?? '').trim(),
  }
}
