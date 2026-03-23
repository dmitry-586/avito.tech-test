import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AdDetailsPage } from '@/features/ad-details-page/page'
import { AdsListPage } from '@/features/ads-list-page/page'

export const appRouter = createBrowserRouter([
  {
    element: <Navigate replace to='/ads' />,
    path: '/',
  },
  {
    element: <AdsListPage />,
    path: '/ads',
  },
  {
    element: <AdDetailsPage />,
    path: '/ads/:id',
  },
  {
    element: <Navigate replace to='/ads' />,
    path: '*',
  },
])
