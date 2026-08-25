import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { QuickAddDialog } from '@/components/product/QuickAddDialog'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HouseNotices } from '@/components/notices/HouseNotices'
import { HouseSchema } from '@/components/seo/HouseSchema'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  const quiet = pathname === '/checkout' || pathname === '/order/confirmed'

  return (
    <>
      <ScrollToTop />
      <HouseSchema />
      <Header />
      <main id="main-content" className="page-enter" key={pathname}>
        <Outlet />
      </main>
      {quiet ? null : <Footer />}
      <QuickAddDialog />
      <CartDrawer />
      <HouseNotices />
    </>
  )
}
