'use client';

import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#skills', label: 'Skills', id: 'skills' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#projects', label: 'Projects', id: 'projects' },
  { href: '#certificates', label: 'Certificates', id: 'certificates' },
  { href: '#awards', label: 'Awards', id: 'awards' },
  { href: '#cv', label: 'CV', id: 'cv' },
  { href: '#contact', label: 'Contact', id: 'contact' },
];

export default function Nav({ name, cvUrl }) {
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setMenuMounted(true);
      return undefined;
    }

    const timer = window.setTimeout(() => setMenuMounted(false), 300);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4" aria-label="Main navigation">
      <div
        className={`w-full max-w-6xl flex items-center justify-between gap-6 rounded-xl px-6 py-4 transition-all duration-300 ${
          scrolled ? 'glass-panel shadow-card backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        {/* Logo/Brand */}
        <a 
          href="#" 
          className="text-sm font-bold tracking-[0.2em] text-text shrink-0 hover:text-gold transition-colors duration-300"
        >
          {(name || 'TUMUSIME SAM').toUpperCase()}
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                data-section={l.id}
                className="nav-link text-[13px] tracking-wide text-muted hover:text-gold px-3 py-2 rounded-md transition-all duration-200 relative group"
              >
                {l.label}
                {/* Underline effect */}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right side - CV and Mobile Menu */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href={cvUrl || '#contact'}
            target={cvUrl ? '_blank' : undefined}
            rel="noreferrer"
            className="hidden sm:inline-flex text-xs font-semibold px-5 py-2.5 rounded-lg border border-gold/30 hover:border-gold text-text hover:text-gold hover:bg-gold/5 transition-all duration-300"
          >
            {cvUrl ? 'CV ↗' : 'Contact'}
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] group"
          >
            <span
              className={`block h-[1.5px] w-5 bg-text group-hover:bg-gold transition-all duration-300 ${
                open ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span 
              className={`block h-[1.5px] w-5 bg-text group-hover:bg-gold transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`} 
            />
            <span
              className={`block h-[1.5px] w-5 bg-text group-hover:bg-gold transition-all duration-300 ${
                open ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuMounted && <div
        className={`lg:hidden fixed inset-0 top-[72px] glass-panel transition-all duration-300 z-40 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className="nav-link text-lg font-medium text-text/90 hover:text-gold transition-colors duration-200"
              data-section={l.id}
            >
              {l.label}
            </a>
          ))}

          {/* Mobile CV Button */}
          {cvUrl ? (
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-sm font-semibold px-6 py-3 rounded-lg border border-gold/30 hover:border-gold text-text hover:text-gold hover:bg-gold/5 transition-all duration-300"
            >
              Download CV ↗
            </a>
          ) : (
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 text-sm font-semibold px-6 py-3 rounded-lg border border-gold/30 hover:border-gold text-text hover:text-gold hover:bg-gold/5 transition-all duration-300"
            >
              Get in Touch
            </a>
          )}
        </div>
      </div>}
    </nav>
  );
}
