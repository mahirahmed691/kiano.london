import { useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'

export function HouseAppBridge() {
  const app = useHouseApp()
  const { count } = useCart()
  const { unread } = useWord()

  useEffect(() => {
    if (!app) {
      document.documentElement.classList.remove('shell-app')
      return
    }
    document.documentElement.classList.add('shell-app')
    return () => document.documentElement.classList.remove('shell-app')
  }, [app])

  useEffect(() => {
    if (!app) return
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'kiano-chrome', bag: count, word: unread }),
    )
  }, [app, count, unread])

  return null
}
