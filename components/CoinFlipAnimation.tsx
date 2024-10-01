import React from 'react';
import ThreeDCoinFlip from './ThreeDCoinFlip';

interface CoinFlipAnimationProps {
  onFlipComplete: (result: 'heads' | 'tails') => void;
}

const CoinFlipAnimation: React.FC<CoinFlipAnimationProps> = ({ onFlipComplete }) => {
  return (
    <div className="flex flex-col items-center">
      <ThreeDCoinFlip onFlipComplete={onFlipComplete} />
    </div>
  );
};

export default CoinFlipAnimation;