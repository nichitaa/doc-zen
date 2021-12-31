import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

interface IRoute {
  path: string;
  component: React.ReactElement;
}

interface IRoutes {
  public: IRoute[];
  private: IRoute[];
  common: IRoute[];
}

export interface IRouteProps {
  component: React.ReactElement;
  isAuth: boolean;
}

// public
const HomePage = lazy(() => import('../pages/Home/HomePage'));

// private
const UploadDocumentPage = lazy(
  () => import('@pages/DocumentUpload/DocumentUploadPage')
);
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));

// common
const SharedDocumentsPage = lazy(
  () => import('../pages/SharedDocuments/SharedDocumentsPage')
);
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

export const routes: IRoutes = {
  public: [
    {
      path: '/home',
      component: <HomePage />,
    },
  ],
  private: [
    {
      path: '/upload',
      component: <UploadDocumentPage />,
    },
    {
      path: '/profile',
      component: <ProfilePage />,
    },
  ],
  common: [
    {
      path: '/',
      component: <Navigate to={'/home'} />, // redirect to home
    },
    {
      path: '/shared',
      component: <SharedDocumentsPage />,
    },
    {
      path: '*',
      component: <NotFoundPage />,
    },
  ],
};
