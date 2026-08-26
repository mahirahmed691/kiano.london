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
  const invoicePrint =
    pathname.startsWith('/admin/invoices/') || pathname === '/order/invoice'
  const quiet =
    pathname === '/checkout' || pathname === '/order/confirmed' || invoicePrint

  return (
    <>
      <ScrollToTop />
      <HouseSchema />
      <div className={invoicePrint ? 'print:hidden' : undefined}>
        <Header />
      </div>
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
