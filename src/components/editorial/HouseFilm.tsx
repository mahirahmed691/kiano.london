import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  src: string
  poster: string
  alt: string
  className?: string
  objectPosition?: string
  priority?: boolean
}

export function HouseFilm({
  src,
  poster,
  alt,
  className,
  objectPosition = 'center',
  priority = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = videoRef.current
    if (!node || reduce) return

    const tryPlay = () => {
      void node.play().catch(() => undefined)
    }

    node.addEventListener('canplay', tryPlay)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
        else node.pause()
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    tryPlay()
    return () => {
      node.removeEventListener('canplay', tryPlay)
      observer.disconnect()
    }
  }, [reduce, src])

  const mediaClass = cn('size-full object-cover', className)

  if (reduce) {
    return (
      <img
        src={poster}
        alt={alt}
        className={mediaClass}
        style={{ objectPosition }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className={mediaClass}
      style={{ objectPosition }}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? 'auto' : 'metadata'}
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
