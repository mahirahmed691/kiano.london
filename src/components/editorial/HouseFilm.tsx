import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  src?: string
  poster: string
  alt: string
  className?: string
  objectPosition?: string
  priority?: boolean
}

let activeFilm: HTMLVideoElement | null = null

export function HouseFilm({
  src,
  poster,
  alt,
  className,
  objectPosition = 'center',
  priority = false,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const visibleRef = useRef(false)
  const heldRef = useRef(false)
  const [reduce, setReduce] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setReady(false)
    heldRef.current = false
  }, [src])

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video || reduce || !src) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = false

    const tryPlay = () => {
      if (!visibleRef.current || heldRef.current) return
      if (activeFilm && activeFilm !== video) activeFilm.pause()
      activeFilm = video
      void video.play().catch(() => undefined)
    }

    const onPlaying = () => setReady(true)
    const onEnded = () => {
      heldRef.current = true
      video.pause()
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.04)
      }
      setReady(true)
      if (activeFilm === video) activeFilm = null
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = (entry?.intersectionRatio ?? 0) >= 0.4
        visibleRef.current = visible
        if (visible) {
          if (video.readyState === 0) video.load()
          tryPlay()
        } else if (!heldRef.current) {
          video.pause()
          if (activeFilm === video) activeFilm = null
        }
      },
      { threshold: [0, 0.4, 0.75] },
    )
    observer.observe(frame)

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
      observer.disconnect()
      video.pause()
      if (activeFilm === video) activeFilm = null
    }
  }, [reduce, src])

  const plateClass = 'absolute inset-0 size-full object-cover'

  return (
    <div ref={frameRef} className={className}>
      <div className="relative size-full overflow-hidden bg-night">
        <img
          src={poster}
          alt={alt}
          className={plateClass}
          style={{ objectPosition }}
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        {src && !reduce ? (
          <video
            ref={videoRef}
            className={cn(
              plateClass,
              'bg-night transition-opacity duration-500',
              ready ? 'opacity-100' : 'opacity-0',
            )}
            style={{ objectPosition }}
            src={src}
            muted
            loop={false}
            playsInline
            preload={priority ? 'auto' : 'none'}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  )
}
