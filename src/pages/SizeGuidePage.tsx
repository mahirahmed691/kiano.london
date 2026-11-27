import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FitFinder } from '@/components/product/FitFinder'
import type { ThobeSize } from '@/data/products'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SizeGuidePage() {
  usePageMeta(getShareMeta('/size-guide'))
  const [finding, setFinding] = useState(false)
  const [kept, setKept] = useState<ThobeSize | null>(null)

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <Eyebrow>Size guide</Eyebrow>
        <Display as="h1" className="mt-4 text-4xl md:text-5xl">
          Size guide.
        </Display>
        <Body className="mt-6">
          Garment measurements for each size. If you are between sizes, or would like a fitting,{' '}
          <Link to="/visit" className="underline underline-offset-4">
            book an atelier visit
          </Link>
          .
        </Body>
        <div className="mt-10">
          {finding ? (
            <FitFinder
              className="max-w-md"
              onChoose={(size) => setKept(size)}
              onClose={() => setFinding(false)}
            />
          ) : (
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 transition-opacity hover:opacity-70"
              onClick={() => setFinding(true)}
            >
              Not sure? Find your size in three answers
            </button>
          )}
          {kept && !finding ? (
            <p className="mt-4 text-[14px] font-light text-ink" role="status">
              Size {kept} is kept. It will be chosen first on every piece.
            </p>
          ) : null}
        </div>
        <SizeGuide className="mt-12" />
      </Container>
    </Section>
  )
}
