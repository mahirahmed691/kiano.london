import { cn } from '@/lib/cn'

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
  objectPosition?: string
  caption?: string
}

export function ImageFrame({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
  objectPosition = 'center',
  caption,
}: Props) {
  return (
    <figure className={cn(className)}>
      <div className="img-zoom h-full w-full overflow-hidden bg-ivory-deep ring-1 ring-ink/10">
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={cn('size-full object-cover', imgClassName)}
          style={{ objectPosition }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-[10px] uppercase tracking-[0.28em] text-stone">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
