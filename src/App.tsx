import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/components/auth/AppProviders'
import { Layout } from '@/components/layout/Layout'
import { CartProvider } from '@/lib/cart'
import { WordProvider } from '@/lib/word-state'
import { QuickAddProvider } from '@/lib/quickAdd'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AccountPage } from '@/pages/AccountPage'
import { AdminAccountsPage } from '@/pages/AdminAccountsPage'
import { AdminCutsPage } from '@/pages/AdminCutsPage'
import { AdminDiaryPage } from '@/pages/AdminDiaryPage'
import { AdminFieldPage } from '@/pages/AdminFieldPage'
import { AdminFiguresPage } from '@/pages/AdminFiguresPage'
import { AdminInvoicePage } from '@/pages/AdminInvoicePage'
import { AdminInvoicesPage } from '@/pages/AdminInvoicesPage'
import { AdminLinePage } from '@/pages/AdminLinePage'
import { AdminListPage } from '@/pages/AdminListPage'
import { AdminMembersPage } from '@/pages/AdminMembersPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminPricesPage } from '@/pages/AdminPricesPage'
import { AdminWorkCardPage } from '@/pages/AdminWorkCardPage'
import { AdminWorkPage } from '@/pages/AdminWorkPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { CraftsmanshipDetailsPage } from '@/pages/CraftsmanshipDetailsPage'
import { CraftsmanshipPage } from '@/pages/CraftsmanshipPage'
import { CookiesPage } from '@/pages/CookiesPage'
import { HomePage } from '@/pages/HomePage'
import { LettersConfirmedPage } from '@/pages/LettersConfirmedPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderCardPage } from '@/pages/OrderCardPage'
import { OrderConfirmedPage } from '@/pages/OrderConfirmedPage'
import { OrderInvoicePage } from '@/pages/OrderInvoicePage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { ProductPage } from '@/pages/ProductPage'
import { ReservationPage } from '@/pages/ReservationPage'
import { ReturnsPage } from '@/pages/ReturnsPage'
import { ShopPage } from '@/pages/ShopPage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { StoryPage } from '@/pages/StoryPage'
import { VisitPage } from '@/pages/VisitPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <WordProvider>
          <CartProvider>
            <QuickAddProvider>
              <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:id" element={<ProductPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/collection/:id" element={<ProductPage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
                <Route path="/craftsmanship-details" element={<CraftsmanshipDetailsPage />} />
                <Route path="/visit" element={<VisitPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/confirmed" element={<OrderConfirmedPage />} />
                <Route path="/order/invoice" element={<OrderInvoicePage />} />
                <Route path="/order/card" element={<OrderCardPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminPage />} />
                  <Route path="figures" element={<AdminFiguresPage />} />
                  <Route path="cuts" element={<AdminCutsPage />} />
                  <Route path="prices" element={<AdminPricesPage />} />
                  <Route path="accounts" element={<AdminAccountsPage />} />
                  <Route path="invoices" element={<AdminInvoicesPage />} />
                  <Route path="invoices/:number" element={<AdminInvoicePage />} />
                  <Route path="work" element={<AdminWorkPage />} />
                  <Route path="work/card" element={<AdminWorkCardPage />} />
                  <Route path="members" element={<AdminMembersPage />} />
                  <Route path="list" element={<AdminListPage />} />
                  <Route path="field" element={<AdminFieldPage />} />
                  <Route path="diary" element={<AdminDiaryPage />} />
                  <Route path="line" element={<AdminLinePage />} />
                </Route>
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/letters/confirmed" element={<LettersConfirmedPage />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            </QuickAddProvider>
          </CartProvider>
        </WordProvider>
      </AppProviders>
    </BrowserRouter>
  )
}
