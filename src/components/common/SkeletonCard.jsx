import React from 'react';

export default function SkeletonCard({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="product-card"
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid var(--border-light)'
          }}
        >
          {/* Image Skeleton */}
          <div style={{
            width: '100%',
            height: '160px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />

          {/* Text Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              width: '60%', height: '14px', borderRadius: '4px',
              background: '#e2e8f0'
            }} />
            <div style={{
              width: '90%', height: '18px', borderRadius: '4px',
              background: '#cbd5e1'
            }} />
            <div style={{
              width: '40%', height: '22px', borderRadius: '4px',
              background: '#94a3b8', marginTop: '0.25rem'
            }} />
          </div>

          {/* Button Skeleton */}
          <div style={{
            width: '100%', height: '38px', borderRadius: 'var(--radius-sm)',
            background: '#e2e8f0', marginTop: 'auto'
          }} />
        </div>
      ))}
    </>
  );
}
