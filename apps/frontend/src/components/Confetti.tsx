import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  return (
    <ReactConfetti
      width={windowDimension.width}
      height={windowDimension.height}
      numberOfPieces={200}
      recycle={false}
      colors={['#FFD700', '#FF6B4A', '#4B0082', '#800080']} /* Gold, Coral, Deep Purple, Purple */
      gravity={0.3}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000, /* Ensures confetti is above other content */
      }}
    />
  );
};

export default Confetti;