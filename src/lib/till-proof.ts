/**
 * The one-pound proof opens the live till for a payment test. It is closed unless
 * VITE_TILL_PROOF_OPEN=1 is set at build time (pair it with TILL_PROOF_OPEN=1 on the server).
 */
export const tillProofOpen = import.meta.env.VITE_TILL_PROOF_OPEN === '1'
