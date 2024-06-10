import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Translation } from 'react-i18next';
import NotFoundPage from './views/404';
import DatasPage from './views/datas';
import TagsPage from './views/tags';
import { LanguageProvider } from './context/language-context.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: (<LanguageProvider>
          <App></App>
        </LanguageProvider>),
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
                element: <TagsPage></TagsPage>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
