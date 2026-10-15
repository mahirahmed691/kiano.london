import { Link } from 'react-router-dom'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { type InstagramPlate } from '@/data/instagram-plates'
import { colourOfPiece } from '@/data/products'
import { plateDestination } from '@/lib/instagram-plates'
import { cn } from '@/lib/cn'

type Props = {
  plate: InstagramPlate
  eager?: boolean
  className?: string
}

export function PlatePair({ plate, eager = false, className }: Props) {
  const to = plateDestination(plate)
  const primary = (
    <ImageFrame
      src={plate.src}
      alt={plate.alt}
      objectPosition={plate.objectPosition}
      className="aspect-[3/4] w-full"
      eager={eager}
      colour={colourOfPiece(plate.id)}
    />
  )

  return (
    <div className={cn(className)}>
      {to ? (
        <Link to={to} className="block">
          {primary}
        </Link>
      ) : (
        primary
      )}
    </div>
  )
}
