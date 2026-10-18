import confetti from 'canvas-confetti';

export const fireGreenConfetti = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0B3B2C', '#10B981', '#34D399', '#A7F3D0']
    });
  } catch {}
};
