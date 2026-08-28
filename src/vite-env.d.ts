/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string
  readonly VITE_ADMIN_EMAILS?: string
  readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __KIANO_NATIVE?: boolean
  __KIANO_EXPO_PUSH?: string
  ReactNativeWebView?: { postMessage: (message: string) => void }
}
