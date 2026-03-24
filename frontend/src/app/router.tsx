import { lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

const AdsListPage = lazy(() =>
  import('@/features/ads-list-page/page').then((m) => ({
    default: m.AdsListPage,
  })),
)
const AdDetailsPage = lazy(() =>
  import('@/features/ad-details-page/page').then((m) => ({
    default: m.AdDetailsPage,
  })),
)
const AdEditPage = lazy(() =>
  import('@/features/ad-edit-page/page').then((m) => ({
    default: m.AdEditPage,
  })),
)

const router = createBrowserRouter([
  { path: '/', element: <Navigate replace to='/ads' /> },
  { path: '/ads', element: <AdsListPage /> },
  { path: '/ads/:id', element: <AdDetailsPage /> },
  { path: '/ads/:id/edit', element: <AdEditPage /> },
  { path: '*', element: <Navigate replace to='/ads' /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
