import { FC, useEffect, useState } from 'react';
import { Controls, Player } from '@lottiefiles/react-lottie-player';

interface MainProps {
  lotti: any;
  loop: boolean;
  speed: number;
  width?: string;
  height?: string;
}

const LottieAnimation: FC<MainProps> = ({
                                          lotti,
                                          loop,
                                          speed,
                                          width,
                                          height,
                                        }) => {
  const [_, setSpeedLottie] = useState(1);

  useEffect(() => {
    setSpeedLottie(speed);
  }, [speed]);

  return (
    <Player
      autoplay
      loop={loop}
      src={lotti}
      style={{
        width: width ? width : '100%',
        height: height ? height : '100%',
      }}
    >
      <Controls
        visible={false}
        buttons={['play', 'repeat', 'frame', 'debug']}
      />
    </Player>
  );
};

export default LottieAnimation;
