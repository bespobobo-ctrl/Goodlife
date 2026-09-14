import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, size = 14, showScore = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} fill="#f59e0b" color="#f59e0b" />
      ))}
      {showScore && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
          ({rating})
        </span>
      )}
    </div>
  );
}
