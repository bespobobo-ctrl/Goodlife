import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSlider({ onSelectCategory }) {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dim' || resolvedTheme === 'midnight';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const timerRef = useRef(null);

  const heroSlides = [
    {
      id: 'iphone-15-pro',
      badge: lang === 'uz' ? "MAXSUS TAKLIF" : "СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ",
      badgeColor: '#f97316',
      title: lang === 'uz' ? "iPhone 15 Pro Max" : "iPhone 15 Pro Max",
      subtitle: lang === 'uz'
        ? "Eng so'nggi titan korpusli smartfon, A17 Pro super chipi va 5x optik zoom kamerasi bilan."
        : "Флагманский смартфон в титановом корпусе с чипом A17 Pro и камерой 5x.",
      price: 1199,
      oldPrice: 1399,
      category: 'mobiles',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80',
      bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)',
      accentColor: '#2563eb'
    },
    {
      id: 'samsung-tv-8k',
      badge: lang === 'uz' ? "TOP MAHSULOT" : "ТОП ПРОДУКТ",
      badgeColor: '#10b981',
      title: lang === 'uz' ? "Samsung Neo QLED 8K Smart TV" : "Samsung Neo QLED 8K Smart TV",
      subtitle: lang === 'uz'
        ? "8K o'ta aniq tasvir va Quantum Matrix Pro texnologiyasi bilan uyingizda haqiqiy kinoteatr."
        : "Невероятное 8K изображение с технологией Quantum Matrix Pro.",
      price: 2499,
      oldPrice: 2899,
      category: 'appliances',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=700&q=80',
      bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #dcfce7 100%)',
      accentColor: '#059669'
    },
    {
      id: 'macbook-pro-m3',
      badge: lang === 'uz' ? "PROFESSIONAL TEXNIKA" : "ПРОФЕССИОНАЛЬНО",
      badgeColor: '#8b5cf6',
      title: lang === 'uz' ? "MacBook Pro 16\" M3 Max" : "MacBook Pro 16\" M3 Max",
      subtitle: lang === 'uz'
        ? "Eng kuchli Apple silicon chipi, Liquid Retina XDR ekrani va 22 soatlik batareya avtonomligi."
        : "Мощнейший ноутбук для профессионалов с дисплеем Liquid Retina XDR.",
      price: 3299,
      oldPrice: 3699,
      category: 'laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80',
      bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #f3e8ff 100%)',
      accentColor: '#7c3aed'
    },
    {
      id: 'ps5-pro-bundle',
      badge: lang === 'uz' ? "O'YIN CHIPI & VR2" : "ИГРОВАЯ КОНСОЛЬ",
      badgeColor: '#ec4899',
      title: lang === 'uz' ? "PlayStation 5 Pro & DualSense" : "PlayStation 5 Pro & DualSense",
      subtitle: lang === 'uz'
        ? "4K 120 FPS ultrafast geyming, ultra tezkor SSD va keyingi avlod taktil qaytarilishi bilan."
        : "Игры нового поколения в 4K 120 FPS с ультрабыстрым SSD.",
      price: 699,
      oldPrice: 799,
      category: 'gaming',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&q=80',
      bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #ffe4e6 100%)',
      accentColor: '#db2777'
    }
  ];

  // Auto-play interval slider
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [currentSlide, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setSlideKey((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setSlideKey((prev) => prev + 1);
  };

    const getSlideGradient = (s) => {
    if (resolvedTheme === 'midnight') {
      if (s.id === 'iphone-15-pro') return 'linear-gradient(135deg, #030712 0%, #0f172a 45%, #172554 100%)';
      if (s.id === 'samsung-tv-8k') return 'linear-gradient(135deg, #022c22 0%, #030712 45%, #064e3b 100%)';
      if (s.id === 'macbook-pro-m3') return 'linear-gradient(135deg, #2e1065 0%, #030712 45%, #3b0764 100%)';
      if (s.id === 'ps5-pro-bundle') return 'linear-gradient(135deg, #4c0519 0%, #030712 45%, #500724 100%)';
      return 'linear-gradient(135deg, #030712 0%, #0b0f19 100%)';
    }
    if (resolvedTheme === 'dim') {
      if (s.id === 'iphone-15-pro') return 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #1e3a8a 100%)';
      if (s.id === 'samsung-tv-8k') return 'linear-gradient(135deg, #064e3b 0%, #0f172a 45%, #065f46 100%)';
      if (s.id === 'macbook-pro-m3') return 'linear-gradient(135deg, #3b0764 0%, #0f172a 45%, #4c1d95 100%)';
      if (s.id === 'ps5-pro-bundle') return 'linear-gradient(135deg, #500724 0%, #0f172a 45%, #701a75 100%)';
      return 'linear-gradient(135deg, #0b1329 0%, #131f37 100%)';
    }
    return s.bgGradient;
  };

  const handleNav = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <section style={{ padding: '1.25rem 0 1.75rem 0' }}>
      {/* Grid container with exact same height stretch alignment */}
      <div
        className="container hero-slider-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '2.1fr 1fr',
          gap: '1.25rem',
          alignItems: 'stretch'
        }}
      >
        {/* Main Left Hero Banner Slider Showcase */}
        <div
          className="hero-main-slide-card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            background: getSlideGradient(slide),
            border: '1px solid var(--border-blue)',
            borderRadius: '24px',
            padding: '2.5rem 2.5rem 2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 35px -5px rgba(37, 99, 235, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
            minHeight: '380px',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Animated Background Decorative Glow Shapes */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${slide.accentColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
            transition: 'all 0.8s ease'
          }} />

          {/* Slide Text Content Column */}
          <div
            key={`content-${slideKey}`}
            style={{
              maxWidth: '440px',
              zIndex: 2,
              animation: 'heroContentEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#ffffff',
                background: slide.badgeColor,
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                textTransform: 'uppercase',
                boxShadow: `0 4px 12px ${slide.badgeColor}40`
              }}>
                {slide.badge}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#e2e8f0' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={13} color="var(--primary-orange)" />
                {lang === 'uz' ? "Eng yaxshi kafolat" : "Лучшая цена"}
              </span>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '0.85rem',
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              {slide.title}
            </h1>

            <p style={{
              color: isDark ? '#e2e8f0' : '#475569',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              lineHeight: 1.55,
              fontWeight: 500
            }}>
              {slide.subtitle}
            </p>

            {/* Price & Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleNav(slide.category)}
                style={{
                  background: `linear-gradient(135deg, ${slide.accentColor} 0%, #1d4ed8 100%)`,
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 2.2rem',
                  borderRadius: '50px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: `0 8px 25px ${slide.accentColor}45`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>{t.shopNow || "Hozir Xarid Qilish"}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.72rem', color: isDark ? '#cbd5e1' : '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                  {formatPrice(slide.oldPrice)}
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#38bdf8' : slide.accentColor }}>
                  {formatPrice(slide.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Slide Product Floating Animated Image */}
          <div
            className="hero-slide-image-wrapper"
            key={`img-${slideKey}`}
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              animation: 'heroImageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.18))',
                animation: 'floatHero 5s ease-in-out infinite'
              }}
            />
          </div>

          {/* Pagination Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setSlideKey((prev) => prev + 1);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  height: '8px',
                  width: currentSlide === idx ? '28px' : '8px',
                  borderRadius: '10px',
                  background: currentSlide === idx ? slide.accentColor : 'rgba(148, 163, 184, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Side 3 Mini Promo Cards - EXACT SAME TOTAL HEIGHT ALIGNMENT */}
        <div className="hero-promo-cards-col" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.85rem',
          height: '100%'
        }}>
          {/* Card 1 */}
          <div
            onClick={() => handleNav('headphones')}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '18px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--primary-blue)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ flex: 1, paddingRight: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#f97316', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.specialOffer || "MAXSUS TAKLIF"}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.2rem 0 0.35rem 0', lineHeight: 1.25 }}>
                {t.newGenOff || "Yangi Avlod 40% Chegirma"}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>{t.shopNow || "Hozir Xarid Qilish"}</span>
                <ArrowRight size={13} />
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&q=80"
              alt="Drone / Headphones"
              style={{ width: '75px', height: '75px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>

          {/* Card 2 */}
          <div
            onClick={() => handleNav('laptops')}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '18px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--primary-blue)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ flex: 1, paddingRight: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.topRated || "ENG YUQORI BAHOLANGAN"}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.2rem 0 0.35rem 0', lineHeight: 1.25 }}>
                {t.bestGamingPC || "Eng Zo'r O'yin Kompyuterlari"}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>{t.shopNow || "Hozir Xarid Qilish"}</span>
                <ArrowRight size={13} />
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=160&q=80"
              alt="Gaming PC"
              style={{ width: '75px', height: '75px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>

          {/* Card 3 */}
          <div
            onClick={() => handleNav('gaming')}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '18px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--primary-blue)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ flex: 1, paddingRight: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.gamingGear || "O'YIN JIXOZLARI"}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.2rem 0 0.35rem 0', lineHeight: 1.25 }}>
                {t.gamingXbox || "Xbox & Playstation Konsollari"}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>{t.shopNow || "Hozir Xarid Qilish"}</span>
                <ArrowRight size={13} />
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=160&q=80"
              alt="PlayStation 5"
              style={{ width: '75px', height: '75px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
