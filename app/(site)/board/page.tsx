import type { Metadata } from 'next'
import { BoardPage } from '@/components/board/board-page'
import { PageHero } from '@/components/site/page-hero'

export const metadata: Metadata = {
  title: 'Org Board',
  description:
    'The Ashen Wings org board. Organisations, coaches, analysts, casters and stores post their requirements — featured posts sit on top.',
}

export default function BoardPageRoute() {
  return (
    <>
      <PageHero eyebrow="Org Board" title={<>Find your <span className="text-ember">lineup.</span></>} position="50% 30%">
        One board for the whole MLBB scene. Organisations post what they need, coaches and casters offer their craft, stores list
        what they sell. Featured posts sit on top.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <BoardPage />
      </section>
    </>
  )
}
