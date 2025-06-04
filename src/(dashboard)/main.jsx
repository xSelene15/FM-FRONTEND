import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Layout from './layouts/dashboard.jsx';
import DashboardPage from './pages/index.jsx';
import OrdersPage from './pages/orders.jsx';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        Component: Layout,
        children: [
          {
            index: true, // /dashboard
            Component: DashboardPage,
          },
          {
            path: 'orders', // /dashboard/orders
            Component: OrdersPage,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);