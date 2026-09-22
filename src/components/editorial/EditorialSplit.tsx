import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Reveal } from '@/components/ui/Reveal'

type Props = {
  image: string
  imageAlt: string
  objectPosition?: string
  imageOn?: 'left' | 'right'
  children: ReactNode
  className?: string
}

export function EditorialSplit({
  image,
  imageAlt,
  objectPosition,
  imageOn = 'left',
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28',
        className,
      )}
    >
      <Reveal className={cn(imageOn === 'right' && 'lg:order-2')}>
        <ImageFrame
          src={image}
          alt={imageAlt}
          objectPosition={objectPosition}
          className="aspect-[4/5] w-full md:aspect-[5/6]"
        />
      </Reveal>
      <Reveal delay={120} className={cn(imageOn === 'right' && 'lg:order-1')}>
        {children}
      </Reveal>
    </div>
  )
}
