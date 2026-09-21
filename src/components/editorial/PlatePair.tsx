import { Link } from 'react-router-dom'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { type InstagramPlate } from '@/data/instagram-plates'
import { cn } from '@/lib/cn'

type Props = {
  plate: InstagramPlate
  eager?: boolean
  className?: string
}

export function PlatePair({ plate, eager = false, className }: Props) {
  const second = plate.children?.[0]
  const primary = (
    <ImageFrame
      src={plate.src}
      alt={plate.alt}
      objectPosition={plate.objectPosition}
      className="aspect-[3/4] w-full"
      eager={eager}
    />
  )
  const wrapped = plate.to ? (
    <Link to={plate.to} className="block">
      {primary}
    </Link>
  ) : (
    primary
  )

  if (!second) {
    return <div className={className}>{wrapped}</div>
  }

  return (
    <div className={cn('grid gap-4 md:gap-6', className)}>
      {wrapped}
      <div className="md:w-4/5 md:justify-self-end">
        <ImageFrame
          src={second.src}
          alt={second.alt}
          objectPosition={second.objectPosition}
          className="aspect-[3/4] w-full"
        />
      </div>
    </div>
  )
}
