import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { QuickAddDialog } from '@/components/product/QuickAddDialog'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HouseAppBridge } from '@/components/layout/HouseAppBridge'
import { LineHeld } from '@/components/layout/LineHeld'
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
    pathname.startsWith('/admin/invoices/') ||
    pathname === '/admin/work/card' ||
    pathname === '/admin/work/table' ||
    pathname === '/admin/work/box' ||
    pathname === '/order/invoice' ||
    pathname === '/order/card'
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
      {invoicePrint ? null : (
        <div className="print:hidden">
          <LineHeld />
        </div>
      )}
      <main
        id="main-content"
        className={cn('page-enter', app && 'shell-app-main')}
        key={pathname}
      >
        <Outlet />
      </main>
      {app || quiet ? null : (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
      <QuickAddDialog />
      <CartDrawer />
      <WordDrawer />
      <HouseNotices />
    </>
  )
}
