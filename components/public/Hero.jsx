'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero({ profile }) {
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const [typedLength, setTypedLength] = useState(0);

  const name = profile?.full_name || 'Tumusime Sam';
  const displayName = name.toUpperCase();
  const labels =
    profile?.hero_labels?.length > 0
      ? profile.hero_labels
      : ['AI & Machine Learning Enthusiast', 'ICT & Networking Foundation', 'Cloud · IoT · Cybersecurity'];
  const bioShort =
    profile?.headline ||
    'I design, implement and manage reliable network infrastructures and intelligent systems.';

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTypedLength(displayName.length);
      return;
    }

    setTypedLength(0);
    let currentLength = 0;
    const timer = window.setInterval(() => {
      currentLength += 1;
      setTypedLength(currentLength);
      if (currentLength >= displayName.length) window.clearInterval(timer);
    }, 62);

    return () => window.clearInterval(timer);
  }, [displayName]);

  // Cursor-responsive lighting + subtle parallax on the portrait.
  // Writes directly to element styles via refs (no React state), so
  // mousemove never triggers a re-render — desktop-only (pointer: fine).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    function apply(x, y) {
      const portrait = portraitRef.current;
      const glow = glowRef.current;
      if (portrait) {
        portrait.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(0)`;
      }
      if (glow) {
        glow.style.setProperty('--glow-x', `${50 + x * 38}%`);
        glow.style.setProperty('--glow-y', `${50 + y * 38}%`);
      }
    }

    function handleMouseMove(e) {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => apply(x, y));
    }

    function handleMouseLeave() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => apply(0, 0));
    }

    stage.addEventListener('mousemove', handleMouseMove, { passive: true });
    stage.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-start pt-[clamp(7rem,12vh,9rem)] pb-16 lg:pb-20 overflow-hidden"
      id="hero"
      data-section="home"
    >
      <div className="relative grid w-full items-start gap-10 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-2 lg:px-[8vw]">
        {/* Text Content */}
        <div className="hero-content-reveal flex max-w-2xl flex-col justify-center lg:items-start lg:pb-10">
          <div className="hero-eyebrow-reveal font-mono text-xs tracking-[0.25em] text-gold mb-6 uppercase font-semibold">
            ✦ ICT · AI · NETWORKING
          </div>

          <h1 className="text-[clamp(2.8rem,14vw,3.5rem)] font-extrabold leading-[0.93] tracking-[-0.04em] text-balance sm:text-[clamp(3.5rem,6vw,6rem)]">
            <span aria-label={displayName} className="hero-name block text-text">
              {displayName.slice(0, typedLength).split('').map((character, index) => (
                <span key={`${character}-${index}`} className={index >= displayName.indexOf(' ') ? 'text-gold' : ''}>
                  {character}
                </span>
              ))}
              <span className={`hero-cursor ${typedLength >= displayName.length ? 'hero-cursor-done' : ''}`} aria-hidden="true" />
            </span>
          </h1>

          <div
            data-animate
            data-delay="200"
            className="mt-8 flex max-w-md flex-col gap-2 text-[15px] sm:text-[16px] leading-relaxed text-muted"
          >
            {labels.map((l) => (
              <span key={l} className="flex items-center gap-2">
                <span className="text-gold">→</span> {l}
              </span>
            ))}
          </div>

          <p data-animate data-delay="300" className="mt-8 max-w-md text-muted leading-relaxed text-[15px]">
            {bioShort}
          </p>

          <div data-animate data-delay="400" className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-accent hover:bg-accent-hover border border-accent hover:border-accent-hover text-text text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore My Work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-gold/30 text-text hover:border-gold hover:bg-gold/5 text-sm font-semibold transition-all duration-300 hover:shadow-glow-soft"
            >
              Get in Touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v10H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 3l6 5 6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Portrait — a large, unboxed cutout integrated into the environment */}
        <div
          ref={stageRef}
          className="portrait-entrance relative flex justify-center lg:justify-end lg:min-h-[min(78vh,760px)]"
          style={{ perspective: '1400px' }}
        >
          {/* Ambient light field behind the figure */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-[78%] w-[65%] rounded-full bg-gradient-to-b from-gold/25 via-accent/10 to-transparent opacity-50 blur-[90px]" />
          </div>

          {/* Cursor-reactive rim light, sits behind the cutout */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none transition-[background] duration-150"
            style={{
              '--glow-x': '50%',
              '--glow-y': '50%',
              background:
                'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(186,163,106,0.30), transparent 55%)',
            }}
          />

          <div
            ref={portraitRef}
            className="relative w-[min(88vw,440px)] sm:w-[min(58vw,520px)] lg:w-[min(48vw,680px)] transition-transform duration-300 ease-out will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* The cutout itself — no card, no border, no rounded box.
                A drop-shadow filter grounds it in the scene instead of a
                boxed card shadow, so the figure reads as part of the
                environment rather than a photo trapped in a frame. */}
            <img
              src={profile?.portrait_url || '/assets/samu-cutout.png'}
              alt={name}
              className="relative z-10 w-full h-auto object-contain select-none"
              style={{
                filter:
                  'drop-shadow(0 35px 45px rgba(0,0,0,0.55)) drop-shadow(0 0 40px rgba(186,163,106,0.10)) saturate(1.05) contrast(1.06)',
              }}
              draggable={false}
            />

            {/* Soft contact shadow grounding the figure */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[65%] h-8 bg-black/40 blur-2xl rounded-full" />
          </div>

          {/* Interactive indicator — subtle, desktop-only in spirit */}
          <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] tracking-widest text-gold/40 font-mono">
            INTERACTIVE
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] tracking-widest text-muted/70 hover:text-gold transition-colors duration-300"
      >
        <span>SCROLL</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-float">
          <path d="M8 2v12M3 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
