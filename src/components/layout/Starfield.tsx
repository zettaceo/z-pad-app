'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const count = window.innerWidth < 768 ? 50 : 120;
    const generated: Star[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generated);
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute bg-white rounded-full"
            style={{
              width: s.size,
              height: s.size,
              top: `${s.y}%`,
              left: `${s.x}%`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient orbs — clamped to avoid horizontal bleed */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 -top-[150px] -left-[100px] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.35), transparent 70%)',
          filter: 'blur(100px)',
          animation: 'float 20s ease-in-out infinite',
          transform: 'translateZ(0)',
        }}
        aria-hidden="true"
      />
      <div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 top-[40%] -right-[100px] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25), transparent 70%)',
          filter: 'blur(100px)',
          animation: 'float 25s ease-in-out infinite reverse',
          transform: 'translateZ(0)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
