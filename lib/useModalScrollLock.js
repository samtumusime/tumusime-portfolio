'use client';

import { useEffect } from 'react';

let activeLocks = 0;
let originalStyles = null;

export default function useModalScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    if (activeLocks === 0) {
      const { body } = document;
      const scrollY = window.scrollY;
      originalStyles = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
        scrollY,
      };
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    activeLocks += 1;

    return () => {
      activeLocks -= 1;
      if (activeLocks > 0 || !originalStyles) return;

      const { body } = document;
      body.style.position = originalStyles.position;
      body.style.top = originalStyles.top;
      body.style.width = originalStyles.width;
      body.style.overflow = originalStyles.overflow;
      body.style.paddingRight = originalStyles.paddingRight;
      window.scrollTo(0, originalStyles.scrollY);
      originalStyles = null;
    };
  }, [locked]);
}