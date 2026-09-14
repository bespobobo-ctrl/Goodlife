import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

export default function HotOfferBanner({ onSelectCategory }) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dim' || resolvedTheme === 'midnight';
  const [hotOffers, setHotOffers] = useState([]);

  useEffect(() => {
    ProductService.getHotOffers().then(setHotOffers);
  }, []);

  const handleNav = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <section style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Hot Summer Offer Header */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t.hotSummerOffer}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Left Column 2 Stacked VR & Summer Banners */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Banner 1: Virtual Gaming VR Headset */}
              <div
                onClick={() => handleNav('gaming')}
                style={{
                  background: isDark ? 'linear-gradient(135deg, rgba(249,115,22,0.18) 0%, var(--bg-card) 100%)' : 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 800 }}>{t.limitedTime}</span>
                  <h3 style={{ fontSize: '1.5rem', margin: '0.4rem 0' }}>{t.vrHeadset}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNav('gaming');
                    }}
                    style={{
                      background: 'var(--primary-blue)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                  >
                    {t.shopNow} →
                  </button>
                </div>
                <img src="https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=250&q=80" alt="VR Headset" style={{ width: '130px', height: '110px', objectFit: 'contain' }} />
              </div>

              {/* Banner 2: Summer Biggest Selling Offer */}
              <div
                onClick={() => handleNav('washing')}
                style={{
                  background: isDark ? 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, var(--bg-card) 100%)' : 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
                  border: isDark ? '1px solid var(--border-light)' : '1px solid #bae6fd',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--badge-blue)', fontWeight: 800 }}>{t.bigDiscount}</span>
                  <h3 style={{ fontSize: '1.5rem', margin: '0.4rem 0' }}>{t.summerBiggest}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{t.shopNow} →</span>
                </div>
                <img src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=250&q=80" alt="Summer Appliance" style={{ width: '130px', height: '110px', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Right Column: 4 Mini Product List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {hotOffers.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-dark)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <img src={item.image} alt={item.name[lang]} style={{ width: '100%', height: '80px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                  
                  <div>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '0.3rem', height: '2.4rem', overflow: 'hidden' }}>
                      {item.name[lang]}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                      <div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{formatPrice(item.price)}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.3rem' }}>{formatPrice(item.oldPrice)}</span>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: 'var(--primary-blue-light)',
                          color: 'var(--primary-blue)',
                          border: 'none',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* FULL WIDTH PROMO BANNER (BOTTOM) */}
        <div style={{
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '600px', zIndex: 2 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t.weeklyDiscountTitle}
            </span>
            
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', margin: '0.6rem 0 1.2rem 0', lineHeight: 1.2 }}>
              {t.weeklyDiscount}
            </h2>

            <button
              onClick={() => handleNav('all')}
              style={{
                background: 'var(--primary-blue)',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 2.2rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 20px rgba(29, 78, 216, 0.4)'
              }}
            >
              <span>{t.shopNow}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=500&q=80"
            alt="Gamer VR"
            style={{
              width: '260px',
              height: '180px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
              zIndex: 2
            }}
          />
        </div>

      </div>
    </section>
  );
}
