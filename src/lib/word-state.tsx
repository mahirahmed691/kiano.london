import { useAuth } from '@clerk/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clerkEnabled } from '@/lib/clerk'
import type { HouseNotice } from '@/lib/word'

type WordContextValue = {
  notices: HouseNotice[]
  unread: number
  open: boolean
  setOpen: (open: boolean) => void
  refresh: () => Promise<void>
  markRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
}

const WordContext = createContext<WordContextValue | null>(null)

const empty: WordContextValue = {
  notices: [],
  unread: 0,
  open: false,
  setOpen: () => undefined,
  refresh: async () => undefined,
  markRead: async () => undefined,
  markAllRead: async () => undefined,
}

function expoPushToken() {
  if (typeof window === 'undefined') return ''
  return window.__KIANO_EXPO_PUSH?.trim() ?? ''
}

function askNativeForPush() {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'kiano-request-push' }))
}

function WordProviderInner({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const [notices, setNotices] = useState<HouseNotice[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setNotices([])
      setUnread(0)
      return
    }
    try {
      const token = await getToken()
      const response = await fetch('/api/notices', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = (await response.json()) as {
        notices?: HouseNotice[]
        unread?: number
      }
      if (!response.ok) return
      setNotices(data.notices ?? [])
      setUnread(data.unread ?? 0)
    } catch {
      // The drawer can stay quiet if the house cannot be reached.
    }
  }, [getToken, isSignedIn])

  const markRead = useCallback(
    async (id: number) => {
      setNotices((current) =>
        current.map((notice) => (notice.id === id ? { ...notice, read: true } : notice)),
      )
      setUnread((current) => Math.max(0, current - 1))
      try {
        const token = await getToken()
        await fetch('/api/notices', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ id }),
        })
      } catch {
        void refresh()
      }
    },
    [getToken, refresh],
  )

  const markAllRead = useCallback(async () => {
    setNotices((current) => current.map((notice) => ({ ...notice, read: true })))
    setUnread(0)
    try {
      const token = await getToken()
      await fetch('/api/notices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ all: true }),
      })
    } catch {
      void refresh()
    }
  }, [getToken, refresh])

  useEffect(() => {
    const openWord = () => setOpen(true)
    window.addEventListener('kiano-open-word', openWord)
    return () => window.removeEventListener('kiano-open-word', openWord)
  }, [])

  useEffect(() => {
    void refresh()
    if (!isSignedIn) return
    const onFocus = () => void refresh()
    const timer = window.setInterval(() => void refresh(), 45_000)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [isSignedIn, refresh])

  useEffect(() => {
    if (!isSignedIn) return

    async function keepDevice(token: string) {
      if (!token) return
      const session = await getToken()
      await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { Authorization: `Bearer ${session}` } : {}),
        },
        body: JSON.stringify({
          token,
          platform: window.__KIANO_EXPO_PUSH ? 'native' : '',
        }),
      })
    }

    const existing = expoPushToken()
    if (existing) {
      void keepDevice(existing)
    } else if (window.ReactNativeWebView) {
      askNativeForPush()
    }

    const onPush = () => {
      void keepDevice(expoPushToken())
    }
    window.addEventListener('kiano-expo-push', onPush)
    return () => window.removeEventListener('kiano-expo-push', onPush)
  }, [getToken, isSignedIn])

  const value = useMemo(
    () => ({
      notices,
      unread,
      open,
      setOpen,
      refresh,
      markRead,
      markAllRead,
    }),
    [notices, unread, open, refresh, markRead, markAllRead],
  )

  return <WordContext.Provider value={value}>{children}</WordContext.Provider>
}

export function WordProvider({ children }: { children: ReactNode }) {
  if (!clerkEnabled) return children
  return <WordProviderInner>{children}</WordProviderInner>
}

export function useWord() {
  return useContext(WordContext) ?? empty
}
