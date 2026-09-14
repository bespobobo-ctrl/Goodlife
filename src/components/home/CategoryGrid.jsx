import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, Lock, Headphones, ArrowRight } from 'lucide-react';
import { ProductService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';

export default function CategoryGrid({ onSelectCategory }) {
  const { lang, t } = useLanguage();
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    ProductService.getCategories().then(setCategoriesList);
  }, []);

  const services = [
    { icon: Headphones, title: t.supportTitle, desc: t.supportDesc },
    { icon: Truck, title: t.shippingTitle, desc: t.shippingDesc },
    { icon: Lock, title: t.paymentTitle, desc: t.paymentDesc },
    { icon: ShieldCheck, title: t.moneyBackTitle, desc: t.moneyBackDesc },
    { icon: RefreshCw, title: t.returnTitle, desc: t.returnDesc }
  ];

  const handleCatClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <section style={{ padding: '2rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Service Features Strip */}
        <div className="service-strip">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="service-item">
                <div className="service-icon">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.1rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Heading: Explore Top Categories */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{t.exploreCategories}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{t.exploreCategoriesSub}</p>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCatClick(cat.id)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-blue)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={cat.image}
                alt={cat.title[lang]}
                style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '10px', flexShrink: 0 }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>
                  {typeof cat.title === 'object' ? cat.title[lang] : cat.title}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {typeof cat.sub === 'object' ? cat.sub[lang] : cat.sub}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 700, marginTop: '0.2rem', display: 'block' }}>
                  {cat.count} {lang === 'uz' ? 'Mahsulot' : 'Товаров'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={() => handleCatClick('all')}
            style={{
              background: 'var(--primary-blue)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(29, 78, 216, 0.25)'
            }}
          >
            <span>{t.exploreMore}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
