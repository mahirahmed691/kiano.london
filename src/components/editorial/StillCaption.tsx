import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  kicker: string
  title: string
  to?: string
  children?: ReactNode
}

export function StillCaption({ kicker, title, to, children }: Props) {
  const copy = (
    <>
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{kicker}</p>
      <p className="mt-2 font-display text-3xl font-light md:text-4xl">{title}</p>
      {children}
    </>
  )

  return (
    <figcaption className="scrim-night-caption absolute inset-x-0 bottom-0 px-6 pb-10 pt-16 md:px-12 lg:px-16">
      {to ? (
        <Link to={to} className="inline-block text-ivory transition-opacity hover:opacity-80">
          {copy}
        </Link>
      ) : (
        <div className="text-ivory">{copy}</div>
      )}
    </figcaption>
  )
}
