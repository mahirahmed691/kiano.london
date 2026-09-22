import { useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Monogram } from '@/components/brand/Monogram'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { clerkEnabled } from '@/lib/clerk'
import { WordPlates } from '@/components/notices/WordPlates'
import { formatNoticeWhen } from '@/lib/word'
import { useWord } from '@/lib/word-state'

export function WordDrawer() {
  const { notices, unread, open, setOpen, markRead, markAllRead } = useWord()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <div className={cn('fixed inset-0 z-[60]', open ? 'visible' : 'invisible')}>
      <button
        type="button"
        aria-label="Close word from the house"
        className={cn(
          'absolute inset-0 bg-night/40 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-rule bg-ivory text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
        aria-label="Word from the house"
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-5">
          <div className="flex items-center gap-3">
            <Monogram decorative className="h-5 w-auto" />
            <p className="text-[11px] uppercase tracking-[0.22em]">
              Word{unread ? ` · ${String(unread).padStart(2, '0')}` : ''}
            </p>
          </div>
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        {notices.length === 0 ? (
          clerkEnabled ? (
            <WordEmptyAuth onClose={() => setOpen(false)} />
          ) : (
            <WordEmptyGuest onClose={() => setOpen(false)} />
          )
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-2">
              {notices.map((notice) => {
                const inner = (
                  <>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                      {formatNoticeWhen(notice.createdAt)}
                      {notice.audience === 'admin' ? ' · Ledger' : ''}
                    </p>
                    <p
                      className={cn(
                        'mt-2 font-display text-2xl font-light',
                        notice.read && 'opacity-55',
                      )}
                    >
                      {notice.title}
                    </p>
                    <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-soft">
                      {notice.body}
                    </p>
                  </>
                )

                return (
                  <li key={notice.id} className="border-b border-rule py-6 first:pt-4">
                    <WordPlates
                      notice={notice}
                      className="mb-4"
                      onOpen={() => {
                        if (!notice.read) void markRead(notice.id)
                        setOpen(false)
                      }}
                    />
                    {notice.href ? (
                      <Link
                        to={notice.href}
                        className="block transition-opacity hover:opacity-70"
                        onClick={() => {
                          if (!notice.read) void markRead(notice.id)
                          setOpen(false)
                        }}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={() => {
                          if (!notice.read) void markRead(notice.id)
                        }}
                      >
                        {inner}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
            {unread ? (
              <div className="border-t border-rule px-6 py-4">
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
                  onClick={() => void markAllRead()}
                >
                  Mark all seen
                </button>
              </div>
            ) : null}
          </>
        )}
      </aside>
    </div>
  )
}

function WordEmptyAuth({ onClose }: { onClose: () => void }) {
  const { isSignedIn } = useAuth()
  if (!isSignedIn) {
    return (
      <div className="flex flex-1 flex-col justify-center px-8">
        <p className="font-display text-3xl font-light">Word follows the account.</p>
        <p className="mt-4 max-w-xs text-[14px] font-light leading-relaxed text-ink-soft">
          Sign in with the email used at checkout. A reserved cut, and when it moves, will sit
          here.
        </p>
        <div className="mt-8">
          <Button to="/sign-in" onClick={onClose}>
            Sign in
          </Button>
        </div>
      </div>
    )
  }

  return <WordEmptyGuest onClose={onClose} />
}

function WordEmptyGuest({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-8">
      <p className="font-display text-3xl font-light">Nothing is waiting.</p>
      <p className="mt-4 max-w-xs text-[14px] font-light leading-relaxed text-ink-soft">
        When a cut is reserved, or the house has word for the ledger, it will sit here.
      </p>
      <div className="mt-8">
        <Button to="/account" onClick={onClose}>
          Account
        </Button>
      </div>
    </div>
  )
}
