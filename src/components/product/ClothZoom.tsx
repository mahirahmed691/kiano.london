import { useEffect, useRef } from 'react'

type Props = {
  src: string
  alt: string
  objectPosition?: string
  onClose: () => void
}

type Point = { x: number; y: number }

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function ClothZoom({ src, alt, objectPosition = 'center', onClose }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const scale = useRef(1)
  const x = useRef(0)
  const y = useRef(0)
  const pointers = useRef(new Map<number, Point>())
  const pinch = useRef({ distance: 0, scale: 1 })
  const lastTap = useRef(0)

  function apply() {
    const node = imgRef.current
    if (!node) return
    node.style.transform = `translate3d(${x.current}px, ${y.current}px, 0) scale(${scale.current})`
  }

  function clamp() {
    scale.current = Math.min(4, Math.max(1, scale.current))
    if (scale.current === 1) {
      x.current = 0
      y.current = 0
    }
  }

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    const surface = frameRef.current
    if (!surface) return

    function point(event: PointerEvent): Point {
      return { x: event.clientX, y: event.clientY }
    }

    function onDown(event: PointerEvent) {
      surface!.setPointerCapture(event.pointerId)
      pointers.current.set(event.pointerId, point(event))
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        pinch.current = { distance: distance(a, b), scale: scale.current }
      }
    }

    function onMove(event: PointerEvent) {
      if (!pointers.current.has(event.pointerId)) return
      const previous = pointers.current.get(event.pointerId)
      pointers.current.set(event.pointerId, point(event))
      if (!previous) return

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        const next = distance(a, b)
        if (pinch.current.distance > 0) {
          scale.current = pinch.current.scale * (next / pinch.current.distance)
          clamp()
          apply()
        }
        return
      }

      if (scale.current > 1) {
        x.current += event.clientX - previous.x
        y.current += event.clientY - previous.y
        apply()
      }
    }

    function onUp(event: PointerEvent) {
      pointers.current.delete(event.pointerId)
      if (pointers.current.size < 2) pinch.current.distance = 0
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.92 : 1.08
      scale.current *= delta
      clamp()
      apply()
    }

    function onDouble(event: MouseEvent) {
      event.preventDefault()
      if (scale.current > 1) {
        scale.current = 1
        x.current = 0
        y.current = 0
      } else {
        scale.current = 2.4
      }
      apply()
    }

    function onPointerTap(event: PointerEvent) {
      if (event.pointerType === 'mouse') return
      const now = Date.now()
      if (now - lastTap.current < 320) {
        if (scale.current > 1) {
          scale.current = 1
          x.current = 0
          y.current = 0
        } else {
          scale.current = 2.4
        }
        apply()
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    }

    surface.addEventListener('pointerdown', onDown)
    surface.addEventListener('pointermove', onMove)
    surface.addEventListener('pointerup', onUp)
    surface.addEventListener('pointercancel', onUp)
    surface.addEventListener('wheel', onWheel, { passive: false })
    surface.addEventListener('dblclick', onDouble)
    surface.addEventListener('pointerup', onPointerTap)
    return () => {
      surface.removeEventListener('pointerdown', onDown)
      surface.removeEventListener('pointermove', onMove)
      surface.removeEventListener('pointerup', onUp)
      surface.removeEventListener('pointercancel', onUp)
      surface.removeEventListener('wheel', onWheel)
      surface.removeEventListener('dblclick', onDouble)
      surface.removeEventListener('pointerup', onPointerTap)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close looking closer"
        className="absolute inset-0 bg-night/80"
        onClick={onClose}
      />
      <div
        ref={frameRef}
        className="absolute inset-0 touch-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          className="pointer-events-none absolute inset-0 m-auto max-h-full max-w-full object-contain will-change-transform"
          style={{ objectPosition, transformOrigin: 'center center' }}
        />
      </div>
      <button
        type="button"
        className="absolute top-28 right-6 z-10 text-[11px] uppercase tracking-[0.22em] text-ivory md:top-32"
        onClick={onClose}
      >
        Close
      </button>
      <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/55">
        Pinch or scroll to look closer
      </p>
    </div>
  )
}
