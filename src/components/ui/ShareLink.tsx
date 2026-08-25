import { useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  text: string
  path: string
  className?: string
}

export function ShareLink({ title, text, path, className }: Props) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = `${window.location.origin}${path}`
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
    } catch (caught) {
      if (caught instanceof Error && caught.name === 'AbortError') return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        'group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70',
        className,
      )}
      onClick={() => void share()}
    >
      <span className="border-b border-current pb-0.5">{copied ? 'Link copied' : 'Share this piece'}</span>
    </button>
  )
}
