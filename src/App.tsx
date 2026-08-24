import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CollectionPage } from '@/pages/CollectionPage'
import { CraftsmanshipDetailsPage } from '@/pages/CraftsmanshipDetailsPage'
import { CraftsmanshipPage } from '@/pages/CraftsmanshipPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { StoryPage } from '@/pages/StoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
          <Route path="/craftsmanship-details" element={<CraftsmanshipDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
