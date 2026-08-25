import { useEffect } from 'react'
import { applyPageMeta } from '@/lib/seo'
import { type PageMeta } from '@/lib/share'

export function usePageMeta({ title, description, path, image, imageAlt }: PageMeta) {
  useEffect(() => {
    applyPageMeta({ title, description, path, image, imageAlt })
  }, [title, description, path, image, imageAlt])
}
