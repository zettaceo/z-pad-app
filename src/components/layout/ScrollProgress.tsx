'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      setPct(scrolled * 100);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 z-[55] shadow-[0_0_12px_rgba(0,212,255,0.7)] transition-[width] duration-100"
      style={{ width: `${pct}%` }}
      aria-hidden="true"
    />
  );
}
