'use client';

import { useEffect, useRef } from 'react';

export default function GlobalBackground() {
  const cursorGlowRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Cursor-reactive lighting is a desktop-with-a-mouse affordance only —
    // there's no cursor on touch devices, so skip attaching the listener
    // there entirely rather than paying for dead event handling.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    function apply(xPct, yPct) {
      const el = cursorGlowRef.current;
      if (!el) return;
      el.style.setProperty('--cursor-x', `${xPct}%`);
      el.style.setProperty('--cursor-y', `${yPct}%`);
    }

    function handleMouseMove(e) {
      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => apply(xPct, yPct));
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-bg" />

      {/* Primary ambient glow - animated */}
      <div
        className="absolute inset-0 animate-ambientGlow"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, rgba(122, 38, 56, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 20%, rgba(186, 163, 106, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(122, 38, 56, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Secondary shifting gradient - animated */}
      <div
        className="absolute inset-0 animate-subtleShift"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(186, 163, 106, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(122, 38, 56, 0.03) 0%, transparent 40%)
          `,
        }}
      />

      {/* Floating light orbs - subtle ambient effect */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-[0.03] animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(186,163,106,1), transparent)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-[0.03] animate-pulse pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(122,38,56,1), transparent)' }}
      />

      {/* Grid overlay - subtle depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(186, 163, 106, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(186, 163, 106, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 65% 35%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 65% 35%, black 20%, transparent 75%)',
        }}
      />

      {/* Mouse-reactive subtle glow (desktop only, updated via CSS var so
          the whole tree never re-renders on mousemove) */}
      <div
        ref={cursorGlowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          '--cursor-x': '50%',
          '--cursor-y': '50%',
          background:
            'radial-gradient(circle at var(--cursor-x) var(--cursor-y), rgba(186,163,106,0.02), transparent 60%)',
        }}
      />
    </div>
  );
}
