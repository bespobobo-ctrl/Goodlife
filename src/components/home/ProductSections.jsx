import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import SkeletonCard from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';
import { ProductService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProductSections({ onQuickView, onSelectCategory }) {
  const { lang, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dim' || resolvedTheme === 'midnight';
  const [activeFilter, setActiveFilter] = useState('all');
  const [accessories, setAccessories] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    Promise.all([
      ProductService.getPCAccessories(),
      ProductService.getRecentlyAdded(activeFilter)
    ]).then(([accData, recentData]) => {
      if (isMounted) {
        setAccessories(accData);
        setRecentlyAdded(recentData);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [activeFilter]);

  const handleNav = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <section style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* SECTION 1: New Computer Accessories */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t.newAccessories}</h2>

          <div className="product-layout-grid-left" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
            {/* Left Promo Card 50% Off */}
            <div style={{
              background: isDark ? 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, var(--bg-card) 100%)' : 'linear-gradient(135deg, #fff3c4 0%, #fffbeb 100%)',
              border: isDark ? '1px solid var(--border-light)' : '1px solid #fde68a',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 800 }}>{t.specialOffer}</span>
                <h3 style={{ fontSize: '1.6rem', marginTop: '0.5rem', lineHeight: 1.2 }}>
                  {t.discount50}
                </h3>
              </div>

              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&q=80"
                alt="PC Accessories"
                style={{ width: '100%', height: '160px', objectFit: 'contain', margin: '1rem 0' }}
              />

              <button
                onClick={() => handleNav('laptops')}
                style={{
                  background: 'var(--primary-blue)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {t.shopNow} →
              </button>
            </div>

            {/* Right PC Accessories Product Grid (3 Items) */}
            <div className="product-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {loading ? (
                <SkeletonCard count={3} />
              ) : accessories.length === 0 ? (
                <EmptyState message={lang === 'uz' ? 'Aksessuarlar topilmadi' : 'Аксессуары не найдены'} />
              ) : (
                accessories.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Recently Added Products */}
        <div>
          {/* Header with Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem' }}>{t.recentlyAdded}</h2>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: lang === 'uz' ? 'Barchasi' : 'Все' },
                { id: 'featured', label: t.featured },
                { id: 'popular', label: t.popular },
                { id: 'lowPrice', label: t.lowPrice }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    border: activeFilter === tab.id ? '1px solid var(--primary-blue)' : '1px solid var(--border-light)',
                    background: activeFilter === tab.id ? 'var(--primary-blue-light)' : 'var(--bg-card)',
                    color: activeFilter === tab.id ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid with Side Promos */}
          <div className="product-layout-grid-right" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
            
            {/* Products Grid (6 Items) */}
            <div className="product-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {loading ? (
                <SkeletonCard count={6} />
              ) : recentlyAdded.length === 0 ? (
                <EmptyState onReset={() => setActiveFilter('all')} />
              ) : (
                recentlyAdded.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
                ))
              )}
            </div>

            {/* Right Side 2 Vertical Promo Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Promo Card 1: Home Appliance 40% Off */}
              <div
                onClick={() => handleNav('washing')}
                style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                  border: '1px solid #bae6fd',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                  {t.discount40}
                </h4>
                <img src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&q=80" alt="Washing Machine" style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '0.5rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{t.getDiscount} →</span>
              </div>

              {/* Promo Card 2: Apple iMac 10% Off */}
              <div
                onClick={() => handleNav('apple')}
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
                  border: '1px solid #e9d5ff',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', color: '#6b21a8', marginBottom: '0.5rem' }}>
                  {t.discount10}
                </h4>
                <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80" alt="Apple iMac" style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '0.5rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{t.getDiscount} →</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
