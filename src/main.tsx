import Signing from '@pages/Signing.tsx';
import Verification from '@pages/Verification.tsx';
import { setupStore } from '@store/store.ts';
import '@styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/signing',
    element: <Signing />,
  },
  {
    path: '/verification',
    element: <Verification />,
  },
  {
    path: '*',
    element: <Navigate to='/signing' replace />,
  },
]);

const store = setupStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
