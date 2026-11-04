import { useEffect } from 'react'
import { WovenLabel } from '@/components/brand/WovenLabel'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'

type Props = {
  open: boolean
  onClose: () => void
}

export function SubscribeDialog({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = window.requestAnimationFrame(() => {
      document.getElementById('letters-popup-email')?.focus()
    })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
      window.cancelAnimationFrame(focus)
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[58] ${open ? 'visible' : 'pointer-events-none invisible'}`}
    >
      <button
        type="button"
        aria-label="Close the list"
        className={`absolute inset-0 bg-night/45 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[var(--app-tab,0px)] md:items-center md:p-8 md:pb-8">
        <div
          className={`pointer-events-auto max-h-[92svh] w-full overflow-y-auto border-t border-rule bg-ivory text-ink transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[min(52rem,calc(100vw-3rem))] md:border ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="letters-title"
          aria-hidden={!open}
        >
          <div className="grid md:grid-cols-2">
            <div className="relative hidden bg-ivory-deep md:block">
              <img
                src="/images/jubbah-black.jpg"
                alt="Urban Emirati in black, worn at full length."
                className="h-full min-h-[28rem] w-full object-cover object-[center_18%]"
              />
              <WovenLabel size="md" colour="Black" className="absolute bottom-5 left-5" />
            </div>
            <div className="px-6 py-8 md:px-10 md:py-12">
              <div className="flex items-start justify-between gap-4">
                <Eyebrow>The list</Eyebrow>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
              <Display id="letters-title" as="h2" className="mt-4 text-4xl md:text-5xl">
                The next cut.
              </Display>
              <Body className="mt-5">
                Cloth, a name, and when a piece can be reserved. A few letters a year. Nothing sold.
                Nothing scented.
              </Body>
              <div className="mt-10">
                <SubscribeForm idPrefix="letters-popup" source="popup" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
