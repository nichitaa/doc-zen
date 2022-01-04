import LayoutWrapper from '@layout/LayoutWrapper';
import { AppRouter, Routes } from 'auth-react-router';
import { routes } from './routes';
import { useAuth0 } from '@auth0/auth0-react';

export const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <LayoutWrapper>
      <AppRouter routes={routes} isAuth={isAuthenticated}>
        <Routes />
      </AppRouter>
    </LayoutWrapper>
  );
};
