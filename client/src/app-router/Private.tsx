import { FC, Suspense, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { IRouteProps } from './routes';
import Loading from '@components/shared/Loading/Loading';

export const Private: FC<IRouteProps> = ({ component, isAuth }): ReactElement =>
  !isAuth ? (
    <Navigate to='/home' />
  ) : (
    <Suspense fallback={<Loading />}>{component}</Suspense>
  );
