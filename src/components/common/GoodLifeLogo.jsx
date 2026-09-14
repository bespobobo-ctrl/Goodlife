import React from 'react';

export default function GoodLifeLogo({ size = 42, showText = true, subtitle = "MAISHIY TEXNIKA" }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>

          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.2" />
          </filter>
        </defs>

        <path
          d="M 50 12 L 20 38 V 78 C 20 81 23 84 26 84 H 36"
          stroke="url(#orangeGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 50 12 L 80 38 V 78 C 80 81 77 84 74 84 H 64"
          stroke="url(#blueGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        <circle
          cx="50"
          cy="56"
          r="20"
          stroke="url(#orangeGrad)"
          strokeWidth="6"
          fill="none"
        />

        <path
          d="M 38 56 L 47 65 L 68 40"
          stroke="url(#blueGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: size > 40 ? '1.4rem' : '1.1rem',
            fontWeight: '800',
            color: '#1d4ed8',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            GOOD LIFE
          </span>
          {subtitle && (
            <span style={{
              fontSize: size > 40 ? '0.7rem' : '0.6rem',
              fontWeight: '700',
              color: '#334155',
              letterSpacing: '0.12em',
              marginTop: '2px',
              textTransform: 'uppercase'
            }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
