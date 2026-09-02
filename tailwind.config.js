/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F1411',
        surface: '#161D19',
        'surface-2': '#1D2620',
        'surface-hover': '#232D27',
        text: '#F1EBDD',
        muted: '#9C9A8F',
        accent: '#7C2638',
        'accent-hover': '#9A3548',
        gold: '#BAA36A',
        'gold-soft': 'rgba(186,163,106,0.14)',
        border: 'rgba(186,163,106,0.14)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 10px 40px rgba(0,0,0,0.35)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.45)',
        glow: '0 0 60px rgba(186,163,106,0.12)',
        'glow-soft': '0 0 40px rgba(186,163,106,0.08)',
        'glow-accent': '0 0 50px rgba(122,38,56,0.15)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(186,163,106,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(186,163,106,0.06) 1px, transparent 1px)',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
        400: '400ms',
        500: '500ms',
      },
      keyframes: {
        fadeUp: { 
          '0%': { opacity: 0, transform: 'translateY(18px)' }, 
          '100%': { opacity: 1, transform: 'translateY(0)' } 
        },
        fadeIn: { 
          '0%': { opacity: 0 }, 
          '100%': { opacity: 1 } 
        },
        floatSlow: { 
          '0%,100%': { transform: 'translateY(0)' }, 
          '50%': { transform: 'translateY(-10px)' } 
        },
        shimmer: { 
          '0%': { backgroundPosition: '-200% 0' }, 
          '100%': { backgroundPosition: '200% 0' } 
        },
        glideIn: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(186,163,106,0.08)' },
          '50%': { boxShadow: '0 0 60px rgba(186,163,106,0.16)' }
        },
        ambientGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '1.15' }
        },
        subtleShift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s cubic-bezier(.16,1,.3,1) both',
        fadeIn: 'fadeIn 0.6s ease both',
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        glideIn: 'glideIn 0.8s cubic-bezier(.16,1,.3,1)',
        slideInLeft: 'slideInLeft 0.6s cubic-bezier(.16,1,.3,1)',
        slideInRight: 'slideInRight 0.6s cubic-bezier(.16,1,.3,1)',
        scaleIn: 'scaleIn 0.5s cubic-bezier(.16,1,.3,1)',
        float: 'float 4s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        ambientGlow: 'ambientGlow 12s ease-in-out infinite',
        subtleShift: 'subtleShift 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
