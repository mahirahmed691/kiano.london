import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CartProvider } from '@/lib/cart'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { CraftsmanshipDetailsPage } from '@/pages/CraftsmanshipDetailsPage'
import { CraftsmanshipPage } from '@/pages/CraftsmanshipPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderConfirmedPage } from '@/pages/OrderConfirmedPage'
import { ProductPage } from '@/pages/ProductPage'
import { ShopPage } from '@/pages/ShopPage'
import { StoryPage } from '@/pages/StoryPage'
import { VisitPage } from '@/pages/VisitPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
