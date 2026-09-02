'use client';

import { useEffect, useRef, useState } from 'react';

function Counter({ target, label }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 900;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.round(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div 
      ref={ref} 
      className="glass-panel rounded-xl py-10 px-6 text-center group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1" 
      data-reveal
    >
      <div className="relative">
        {/* Background glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          <span className="block text-5xl sm:text-6xl font-extrabold bg-gradient-to-br from-gold to-gold/70 bg-clip-text text-transparent tabular-nums">
            {value}
          </span>
          <span className="block mt-3 text-xs tracking-widest text-muted/80 group-hover:text-gold/80 uppercase font-semibold transition-colors duration-300">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

// Counts are computed from real published records — never hardcoded —
// so this section can't drift into "fake stats" territory.
export default function Stats({ certificatesCount, projectsCount, skillGroupsCount, experienceCount }) {
  const items = [
    { target: certificatesCount, label: 'Certificates' },
    { target: projectsCount, label: 'Projects' },
    { target: skillGroupsCount, label: 'Expertise Areas' },
    { target: experienceCount, label: 'Roles & Programs' },
  ];

  return (
    <section className="section" id="stats" data-section="stats">
      <div className="section-inner">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((i, idx) => (
            <div key={i.label} data-reveal style={{ animationDelay: `${idx * 50}ms` }}>
              <Counter target={i.target} label={i.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
