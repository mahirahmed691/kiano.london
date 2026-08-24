import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <Header key={pathname} />
      <main id="main-content" className="page-enter" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
