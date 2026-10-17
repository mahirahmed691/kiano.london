import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from '@/lib/cart'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'

export function HouseAppBridge() {
  const app = useHouseApp()
  const { pathname } = useLocation()
  const quiet = pathname.startsWith('/checkout') || pathname.startsWith('/order')
  const { count, open: bagOpen } = useCart()
  const { unread, open: wordOpen } = useWord()

  useEffect(() => {
    if (!app) {
      document.documentElement.classList.remove('shell-app', 'shell-quiet')
      return
    }
    document.documentElement.classList.add('shell-app')
    document.documentElement.classList.toggle('shell-quiet', quiet)
    return () => document.documentElement.classList.remove('shell-app', 'shell-quiet')
  }, [app, quiet])

  useEffect(() => {
    if (!app) return
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'kiano-chrome',
        bag: count,
        word: unread,
        bagOpen,
        wordOpen,
        path: pathname,
      }),
    )
  }, [app, bagOpen, count, pathname, unread, wordOpen])

  return null
}
