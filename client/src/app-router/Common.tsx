import { ReactElement, FC, Suspense } from 'react';
import Loading from '@components/shared/Loading/Loading';

export const Common: FC<{ component: ReactElement }> = ({
  component,
}): ReactElement => <Suspense fallback={<Loading />}>{component}</Suspense>;
