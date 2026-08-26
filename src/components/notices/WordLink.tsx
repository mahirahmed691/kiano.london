import { useAuth } from '@clerk/react'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { useWord } from '@/lib/word-state'

type Props = {
  className?: string
  onClick?: () => void
}

function WordLinkInner({ className, onClick }: Props) {
  const { isSignedIn } = useAuth()
  const { unread, setOpen } = useWord()
  if (!isSignedIn) return null

  return (
    <button
      type="button"
      className={className}
      aria-label={unread ? `Word from the house, ${unread} unread` : 'Word from the house'}
      onClick={() => {
        onClick?.()
        setOpen(true)
      }}
    >
      Word{unread ? ` ${String(unread).padStart(2, '0')}` : ''}
    </button>
  )
}

export function WordLink({ className, onClick }: Props) {
  if (!clerkEnabled) return null
  return (
    <WordLinkInner
      onClick={onClick}
      className={cn('transition-opacity hover:opacity-70', className)}
    />
  )
}
