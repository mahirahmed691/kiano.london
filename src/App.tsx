import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/components/auth/AppProviders'
import { Layout } from '@/components/layout/Layout'
import { CartProvider } from '@/lib/cart'
import { QuickAddProvider } from '@/lib/quickAdd'
import { AccountPage } from '@/pages/AccountPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { CraftsmanshipDetailsPage } from '@/pages/CraftsmanshipDetailsPage'
import { CraftsmanshipPage } from '@/pages/CraftsmanshipPage'
import { CookiesPage } from '@/pages/CookiesPage'
import { HomePage } from '@/pages/HomePage'
import { LettersConfirmedPage } from '@/pages/LettersConfirmedPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderConfirmedPage } from '@/pages/OrderConfirmedPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { ProductPage } from '@/pages/ProductPage'
import { ShopPage } from '@/pages/ShopPage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { StoryPage } from '@/pages/StoryPage'
import { VisitPage } from '@/pages/VisitPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
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
                <Route path="/account" element={<AccountPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/letters/confirmed" element={<LettersConfirmedPage />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </QuickAddProvider>
        </CartProvider>
      </AppProviders>
    </BrowserRouter>
  )
}
