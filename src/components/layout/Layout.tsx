import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { QuickAddDialog } from '@/components/product/QuickAddDialog'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HouseAppBridge } from '@/components/layout/HouseAppBridge'
import { HouseNotices } from '@/components/notices/HouseNotices'
import { WordDrawer } from '@/components/notices/WordDrawer'
import { HouseSchema } from '@/components/seo/HouseSchema'
import { useHouseApp } from '@/lib/shell'
import { cn } from '@/lib/cn'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  const app = useHouseApp()
  const invoicePrint =
    pathname.startsWith('/admin/invoices/') || pathname === '/order/invoice'
  const quiet =
    pathname === '/checkout' || pathname === '/order/confirmed' || invoicePrint

  return (
    <>
      <ScrollToTop />
      <HouseSchema />
      <HouseAppBridge />
      {app || invoicePrint ? null : (
        <div className="print:hidden">
          <Header />
        </div>
      )}
      <main
        id="main-content"
        className={cn('page-enter', app && 'shell-app-main')}
        key={pathname}
      >
        <Outlet />
      </main>
      {app || quiet ? null : <Footer />}
      <QuickAddDialog />
      <CartDrawer />
      <WordDrawer />
      {app ? null : <HouseNotices />}
    </>
  )
}
