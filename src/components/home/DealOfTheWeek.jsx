import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { ProductService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function DealOfTheWeek({ onQuickView, onSelectCategory }) {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dim' || resolvedTheme === 'midnight';
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 45, secs: 22 });

  useEffect(() => {
    ProductService.getDealProducts().then(setDeals);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <section style={{ padding: '2.5rem 0', background: 'var(--bg-body)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section Header with Countdown Timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem' }}>{t.dealOfTheWeek}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.dealSubtitle}</p>
          </div>

          {/* Live Timer Box */}
          <div className="timer-badge">
            <div className="timer-box">
              <div className="timer-num">{timeLeft.days}</div>
              <div className="timer-label">{t.days}</div>
            </div>
            <div className="timer-box">
              <div className="timer-num">{timeLeft.hours}</div>
              <div className="timer-label">{t.hours}</div>
            </div>
            <div className="timer-box">
              <div className="timer-num">{timeLeft.mins}</div>
              <div className="timer-label">{t.mins}</div>
            </div>
            <div className="timer-box">
              <div className="timer-num">{timeLeft.secs}</div>
              <div className="timer-label">{t.secs}</div>
            </div>
          </div>
        </div>

        {/* 4 Deal Product Cards */}
        <div className="deal-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* 2 Middle Promo Banners (Black Friday & Dell Laptop) */}
        <div className="deal-promo-banners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          
          {/* Banner 1: Black Friday */}
          <div
            onClick={() => handleBannerClick('laptops')}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, var(--bg-card) 100%)'
                : 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
              border: isDark ? '1px solid var(--border-light)' : '1px solid #bae6fd',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--badge-blue)', fontWeight: 800, textTransform: 'uppercase' }}>{t.get40Discount}</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: 'var(--text-dark)' }}>{t.blackFriday}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{t.getOffer} →</span>
            </div>
            <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80" alt="Monitor" style={{ width: '160px', height: '120px', objectFit: 'contain' }} />
          </div>

          {/* Banner 2: Dell Laptop */}
          <div
            onClick={() => handleBannerClick('laptops')}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, var(--bg-card) 100%)'
                : 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)',
              border: isDark ? '1px solid var(--border-light)' : '1px solid #fde68a',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--badge-amber)', fontWeight: 800, textTransform: 'uppercase' }}>{t.officialDellDeal}</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: 'var(--text-dark)' }}>{t.dellOffer}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{t.getDiscount} →</span>
            </div>
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80" alt="Dell Laptop" style={{ width: '160px', height: '120px', objectFit: 'contain' }} />
          </div>

        </div>

      </div>
    </section>
  );
}
