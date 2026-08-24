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
      <div className="img-zoom h-full w-full overflow-hidden bg-ivory-deep">
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
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.18em] text-stone">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
