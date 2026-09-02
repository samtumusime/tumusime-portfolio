'use client';

import { useEffect } from 'react';

// Handles three light-weight, purely-visual behaviors for the public site:
// 1) fades/slides [data-reveal] and [data-animate] elements in as they enter view
// 2) fills the top scroll-progress bar
// 3) highlights the active nav link based on which section is in view
export default function ScrollEffects() {
  useEffect(() => {
    const revealTargets = document.querySelectorAll('[data-reveal], [data-animate]');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            if (delay) entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    const progressBar = document.getElementById('scrollProgressBar');
    const onScroll = () => {
      if (!progressBar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: '-15% 0px -55% 0px' }
    );
    sections.forEach((s) => sectionObserver.observe(s));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
