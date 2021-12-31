import { ReactElement, FC, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { IRouteProps } from './routes';
import Loading from '@components/shared/Loading/Loading';

export const Public: FC<IRouteProps> = ({ component, isAuth }): ReactElement =>
  isAuth ? (
    <Navigate to='/profile' />
  ) : (
    <Suspense fallback={<Loading />}>{component}</Suspense>
  );
