import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// HomePage Structure
import Layout from './layouts/Layout';
import ProductPage from './pages/LandingPages/ProductPage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

// Account / Admin Pages Structure
import OrdersPage from './pages/AccountPages/OrdersPage';
import ProfilePage from './pages/AccountPages/ProfilePage';
import AdminDashboardPage from './pages/AdminPages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminPages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminPages/AdminProductsPage';
import AdminReviewsPage from './pages/AdminPages/AdminReviewsPage';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';
import ProtectedRoute from './components/ProtectedRoute';

import NotFoundPage from './pages/NotFoundPage';


const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductPage />,
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute roles={['buyer', 'admin']}>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute roles={['buyer', 'admin']}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/orders',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/products',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/reviews',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminReviewsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: 'auth', 
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;