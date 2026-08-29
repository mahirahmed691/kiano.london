import type { CheckoutOrder } from '@/lib/checkout'
import { orderReference } from '@/lib/checkout'
import type { LedgerInvoice } from '@/lib/ledger'
import { splitVat } from '@/lib/vat'

export function invoiceFromOrder(order: CheckoutOrder): LedgerInvoice | null {
  if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'no_payment_required') return null
  const split = splitVat(order.amountTotal)
  return {
    id: 0,
    number: order.invoice?.number ?? `KL-${orderReference(order.id)}`,
    orderId: order.id,
    email: order.customerEmail ?? '',
    customerName: order.customerName ?? order.customerEmail ?? '',
    issuedAt: order.invoice?.issuedAt ?? new Date().toISOString(),
    netPence: order.invoice?.netPence ?? split.netPence,
    vatPence: order.invoice?.vatPence ?? split.vatPence,
    grossPence: order.invoice?.grossPence ?? split.grossPence,
    currency: order.currency,
    shipping: order.shipping,
    refundedPence: 0,
    lines: order.lines.map((line) => ({
      productId: line.productId ?? '',
      size: line.size ?? 0,
      quantity: line.quantity,
      description: line.description,
      ...splitVat(line.amount),
    })),
  }
}
