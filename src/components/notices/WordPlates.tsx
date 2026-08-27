import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { noticePlates, type HouseNotice } from '@/lib/word'

type Props = {
  notice: HouseNotice
  className?: string
  onOpen?: () => void
}

export function WordPlates({ notice, className, onOpen }: Props) {
  const plates = noticePlates(notice)
  if (plates.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {plates.map((plate) => (
        <li key={plate.productId}>
          <Link
            to={plate.href}
            className="img-zoom block aspect-[3/4] w-[4.5rem] overflow-hidden bg-ivory-deep sm:w-20"
            onClick={onOpen}
          >
            <img
              src={plate.src}
              alt={plate.alt}
              className="size-full object-cover"
              style={
                plate.objectPosition ? { objectPosition: plate.objectPosition } : undefined
              }
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
