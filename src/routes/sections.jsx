import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { isLoggedIn } from 'src/utils/auth';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const OrderPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const PaymentPage = lazy(() => import('src/pages/payment'));
export const UploadPage = lazy(() => import('src/pages/upload'));
export const SuccessPage = lazy(() => import('src/pages/success'));
export const CancelPage = lazy(() => import('src/pages/cancel'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const loggedIn = isLoggedIn();
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: loggedIn ? <IndexPage /> : <Navigate to="/login" replace />, index: true },
        { path: 'user', element: loggedIn ? <OrderPage /> : <Navigate to="/login" replace /> },
      ],
    },
    {
      path: 'login',
      element: loggedIn ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: 'register',
      element: loggedIn ? <Navigate to="/" replace /> : <RegisterPage />,
    },
    {
      path: 'upload',
      element: loggedIn ? <UploadPage /> : <Navigate to="/login" replace />,
    },
    {
      path: 'payment',
      element: loggedIn ? <PaymentPage /> : <Navigate to="/login" replace />,
    },
    {
      path: 'success',
      element: <SuccessPage />,
    },
    {
      path: 'cancel',
      element: <CancelPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
