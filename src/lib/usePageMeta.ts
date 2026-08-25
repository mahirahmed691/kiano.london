import { useEffect } from 'react'
import { applyPageMeta } from '@/lib/seo'
import { type PageMeta } from '@/lib/share'

export function usePageMeta({ title, description, path, image, imageAlt, robots }: PageMeta) {
  useEffect(() => {
    applyPageMeta({ title, description, path, image, imageAlt, robots })
  }, [title, description, path, image, imageAlt, robots])
}
