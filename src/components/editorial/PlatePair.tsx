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
  const primary = (
    <ImageFrame
      src={plate.src}
      alt={plate.alt}
      objectPosition={plate.objectPosition}
      className="aspect-[3/4] w-full"
      eager={eager}
    />
  )

  return (
    <div className={cn(className)}>
      {plate.to ? (
        <Link to={plate.to} className="block">
          {primary}
        </Link>
      ) : (
        primary
      )}
    </div>
  )
}
