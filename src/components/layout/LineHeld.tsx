import { useHouseApp } from '@/lib/shell'
import { useLineHeld } from '@/lib/online'

export function LineHeld() {
  const held = useLineHeld()
  const app = useHouseApp()

  if (!held) return null

  return (
    <p
      role="status"
      className="fixed inset-x-0 z-40 border-b border-ivory/10 bg-night px-5 py-2.5 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/50 md:px-12"
      style={{
        top: app ? 'env(safe-area-inset-top, 0px)' : 'var(--header-offset)',
      }}
    >
      The line is held on this device. The till needs a connection.
    </p>
  )
}
