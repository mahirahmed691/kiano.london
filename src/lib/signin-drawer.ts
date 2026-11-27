import { useSyncExternalStore } from 'react'

let open = false
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function setSignInOpen(next: boolean) {
  if (open === next) return
  open = next
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSignInOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  )
}
