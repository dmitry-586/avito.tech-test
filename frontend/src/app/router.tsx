import { lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

const ListPage = lazy(() =>
  import('@/features/list-page/page').then((m) => ({
    default: m.ListPage,
  })),
)
const DetailsPage = lazy(() =>
  import('@/features/details-page/page').then((m) => ({
    default: m.DetailsPage,
  })),
)
const EditPage = lazy(() =>
  import('@/features/edit-page/page').then((m) => ({
    default: m.EditPage,
  })),
)

const router = createBrowserRouter([
  { path: '/', element: <Navigate replace to='/ads' /> },
  { path: '/ads', element: <ListPage /> },
  { path: '/ads/:id', element: <DetailsPage /> },
  { path: '/ads/:id/edit', element: <EditPage /> },
  { path: '*', element: <Navigate replace to='/ads' /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
