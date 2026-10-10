import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CursorGlow() {
  const { reduceEffects } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceEffects) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reduceEffects, visible]);

  if (reduceEffects || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-30 transition-transform duration-75 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.04) 40%, transparent 70%)',
        borderRadius: '50%'
      }}
      aria-hidden="true"
    />
  );
}
