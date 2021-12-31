import React from 'react';
import notFound from '@assets/lottie-animations/not-found.json';
import LottieAnimation from '@components/shared/LottieAnimation/LottieAnimation';

const NotFoundPage = () => (
  <LottieAnimation width={'60%'} lotti={notFound} loop={false} speed={0.5} />
);

export default NotFoundPage;
