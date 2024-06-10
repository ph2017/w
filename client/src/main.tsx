import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Translation } from 'react-i18next';
import NotFoundPage from './views/404';
import DatasPage from './views/datas';;

const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        errorElement: <NotFoundPage></NotFoundPage>,
        children: [
            {
                path: '',
                element: (
                    <div>
                        <Translation>{t => <h3>{t('home')}</h3>}</Translation>
                    </div>
                ),
            },
            {
                path: 'datas',
                element: <DatasPage></DatasPage>,
            },
            {
                path: 'tags',
                element: <div>tag</div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
