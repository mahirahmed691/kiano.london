import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Display, Body } from '@/components/ui/Heading'
import { usePageMeta } from '@/lib/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page not found — Cavendish House',
    description: 'This page does not exist on the Cavendish House website.',
    path: '/404',
  })

  return (
    <section className="flex min-h-[80svh] items-center pt-24">
      <Container>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">404</p>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          This room is empty.
        </Display>
        <Body className="mt-6">The page you asked for is not in the house.</Body>
        <Link
          to="/"
          className="mt-10 inline-flex text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
        >
          Return home
        </Link>
      </Container>
    </section>
  )
}
