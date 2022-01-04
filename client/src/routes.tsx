import { IRoutesConfig } from 'auth-react-router';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '@components/shared/Loading/Loading';

// public
const HomePage = lazy(() => import('@pages/Home/HomePage'));

// private
const UploadDocumentPage = lazy(
  () => import('@pages/DocumentUpload/DocumentUploadPage'),
);
const ProfilePage = lazy(() => import('@pages/Profile/ProfilePage'));

// common
const SharedDocumentsPage = lazy(
  () => import('@pages/SharedDocuments/SharedDocumentsPage'),
);
const NotFoundPage = lazy(() => import('@pages/NotFound/NotFoundPage'));


export const routes: IRoutesConfig = {
  publicRedirectRoute: '/home',
  privateRedirectRoute: '/profile',
  defaultFallback: <Loading />,
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