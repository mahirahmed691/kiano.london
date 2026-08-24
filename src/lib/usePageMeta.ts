import { useEffect } from 'react'
import { applyPageMeta, type PageMeta } from '@/lib/seo'

export function usePageMeta({ title, description, path, image }: PageMeta) {
  useEffect(() => {
    applyPageMeta({ title, description, path, image })
  }, [title, description, path, image])
}
