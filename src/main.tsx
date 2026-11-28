import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from '@/App'
import '@/styles/index.css'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Lift the house intro once the first screen has painted.
requestAnimationFrame(() =>
  requestAnimationFrame(() => (window as { __klIntroReady?: () => void }).__klIntroReady?.()),
)
