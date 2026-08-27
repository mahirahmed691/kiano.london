import { useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'

export function HouseAppBridge() {
  const app = useHouseApp()
  const { count, open: bagOpen } = useCart()
  const { unread, open: wordOpen } = useWord()

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
      JSON.stringify({
        type: 'kiano-chrome',
        bag: count,
        word: unread,
        bagOpen,
        wordOpen,
      }),
    )
  }, [app, bagOpen, count, unread, wordOpen])

  return null
}
