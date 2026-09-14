import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, ShoppingBag, Eye, Heart, Star, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

// SMEG & Premium Appliance Collection Data
const smegProducts = [
  {
    id: 'smeg-1',
    name: { uz: 'Smeg Stand Mixer Cream 4.8L', ru: 'Планетарный миксер Smeg 4.8L' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 420.00,
    oldPrice: 480.00,
    rating: 4.9,
    badge: 'LUXURY',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-2',
    name: { uz: 'Smeg Milk Frother Cream', ru: 'Вспениватель молока Smeg' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 180.00,
    oldPrice: 210.00,
    rating: 4.8,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-3',
    name: { uz: 'Smeg Personal Blender 0.6L', ru: 'Персональный блендер Smeg 0.6L' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 160.00,
    oldPrice: 195.00,
    rating: 4.7,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-4',
    name: { uz: 'Smeg 2-Slice Toaster Cream', ru: 'Тостер Smeg на 2 слота' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 175.00,
    oldPrice: 200.00,
    rating: 5.0,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-5',
    name: { uz: 'Smeg Drip Coffee Machine 10-Cup', ru: 'Капельная кофеварка Smeg 10 чашек' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 230.00,
    oldPrice: 270.00,
    rating: 4.9,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-6',
    name: { uz: 'Smeg Electric Kettle 1.7L Retro', ru: 'Электрический чайник Smeg 1.7L' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 190.00,
    oldPrice: 220.00,
    rating: 4.8,
    badge: 'AKSIYA',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-7',
    name: { uz: 'Smeg Citrus Juicer 70W Cream', ru: 'Соковыжималка для цитрусовых Smeg' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 145.00,
    oldPrice: 170.00,
    rating: 4.6,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80',
    colorHex: '#f5f0e6'
  },
  {
    id: 'smeg-8',
    name: { uz: 'Smeg Espresso Machine 15-Bar', ru: 'Кофемашина эспрессо Smeg 15 бар' },
    category: 'kitchen',
    brand: 'SMEG ITALIA',
    price: 380.00,
    oldPrice: 440.00,
    rating: 5.0,
    badge: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=500&q=80',
    colorHex: '#f5f0e6'
  }
];

export default function SmegCarouselShowcase({ onQuickView }) {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dim' || resolvedTheme === 'midnight';

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  // Duplicated list for seamless infinite marquee effect
  const displayProducts = [...smegProducts, ...smegProducts, ...smegProducts];

  // Continuous auto-sliding effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If reached end, wrap around seamlessly
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1.5; // Smooth incremental step
        }
        setScrollPos(scrollRef.current.scrollLeft);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleManualScroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 260; // Frame card width
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section style={{
      padding: '3.5rem 0',
      background: isDark
        ? (resolvedTheme === 'midnight' ? 'linear-gradient(180deg, #030712 0%, #0b0f19 100%)' : 'linear-gradient(180deg, #0b1329 0%, #131f37 100%)')
        : 'linear-gradient(180deg, #fbf9f5 0%, #f4f0e6 100%)',
      borderTop: isDark ? '1px solid var(--border-light)' : '1px solid #eae5d9',
      borderBottom: isDark ? '1px solid var(--border-light)' : '1px solid #eae5d9',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Header Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isDark ? 'var(--bg-card)' : '#ffffff',
              border: isDark ? '1px solid var(--border-light)' : '1px solid #e2dacd',
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              color: isDark ? '#f59e0b' : '#8c6d46',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '0.65rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <Sparkles size={14} color="#b45309" />
              <span>{lang === 'uz' ? 'ITALIYA RETRO DIZAYN KOLLEKSIYASI' : 'ИТАЛЬЯНСКАЯ РЕТРО-КОЛЛЕКЦИЯ'}</span>
            </div>

            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              lineHeight: 1.15,
              margin: 0,
              fontFamily: 'var(--font-heading)'
            }}>
              {lang === 'uz' ? "Do'kondagi Barcha Premium Mahsulotlar Karuseli" : 'Карусель Всех Премиальных Товаров'}
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>
              {lang === 'uz'
                ? "Ramka ko'rinishida yonma-yon uzluksiz aylanib turuvchi original maishiy va oshxona texnikasi"
                : 'Непрерывная карусель оригинальной бытовой техники в прямоугольных рамках'
              }
            </p>
          </div>

          {/* Controls: Play/Pause Toggle & Left/Right Chevrons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Play / Pause Auto-Scroll Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? (lang === 'uz' ? 'Harakatni to\'xtatish' : 'Пауза') : (lang === 'uz' ? 'Harakatni davom ettirish' : 'Возобновить')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-light)',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: 'var(--text-dark)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8c6d46'; e.currentTarget.style.background = '#fefdfb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
            >
              {isPlaying ? <Pause size={15} color="#b45309" /> : <Play size={15} color="#16a34a" />}
              <span>{isPlaying ? (lang === 'uz' ? 'Pauza' : 'Пауза') : (lang === 'uz' ? 'Aylantirish' : 'Запуск')}</span>
            </button>

            {/* Navigation Chevrons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => handleManualScroll('left')}
                aria-label="Previous products"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-blue)';
                  e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.color = '#2d251e';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => handleManualScroll('right')}
                aria-label="Next products"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-blue)';
                  e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.color = '#2d251e';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>

        </div>

        {/* SMEG Rectangular Frame Product Carousel Track Window */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          style={{
            display: 'flex',
            gap: '1px', // Fine vertical frame divider line
            overflowX: 'auto',
            scrollBehavior: 'auto',
            paddingBottom: '1rem',
            scrollbarWidth: 'none', // Hide scrollbar
            msOverflowStyle: 'none',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(45, 37, 30, 0.08)',
            background: isDark ? 'var(--border-light)' : '#e5decb',
            border: isDark ? '1px solid var(--border-light)' : '1px solid #d8cfb9'
          }}
        >
          {displayProducts.map((prod, idx) => {
            const nameStr = typeof prod.name === 'object' ? (prod.name[lang] || prod.name.uz) : prod.name;
            const wishlisted = isWishlisted ? isWishlisted(prod.id) : false;

            return (
              <div
                key={`${prod.id}-${idx}`}
                style={{
                  flex: '0 0 250px',
                  height: '390px',
                  background: isDark ? 'var(--bg-card)' : '#faf7f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1rem',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.boxShadow = 'inset 0 0 0 2.5px var(--primary-blue)';
                  e.currentTarget.style.zIndex = '5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? 'var(--bg-card)' : '#faf7f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.zIndex = '1';
                }}
              >
                {/* Top Badge & Floating Wishlist Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', zIndex: 2 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: isDark ? '#f59e0b' : '#8c6d46',
                    background: '#ffffff',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid #e8e0d0'
                  }}>
                    {prod.brand || 'SMEG'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    title={lang === 'uz' ? 'Saralanganlarga qo\'shish' : 'В избранное'}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: wishlisted ? 'var(--primary-orange-light)' : '#ffffff',
                      border: '1px solid #e2dacd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: wishlisted ? 'var(--primary-orange)' : '#786c5e',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Heart size={15} fill={wishlisted ? 'var(--primary-orange)' : 'none'} />
                  </button>
                </div>

                {/* Rectangular Studio Product Frame Stage */}
                <div
                  onClick={() => onQuickView && onQuickView(prod)}
                  style={{
                    height: '210px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '0.5rem'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={nameStr}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '190px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 20px rgba(45, 37, 30, 0.12))',
                      transition: 'transform 0.35s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                  />

                  {/* Hover Quick View Trigger Icon */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onQuickView) onQuickView(prod);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid #d4c8b5',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-dark)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease'
                    }}
                    title={lang === 'uz' ? 'Tezkor ko\'rish' : 'Быстрый просмотр'}
                  >
                    <Eye size={16} />
                  </div>
                </div>

                {/* Bottom Frame Details: Title, Rating, Price & Quick Add Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #ede7db', paddingTop: '0.75rem' }}>
                  
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(prod.rating || 5) ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#786c5e' }}>{prod.rating || 4.9}</span>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    lineHeight: 1.3,
                    margin: 0,
                    height: '2.5rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {nameStr}
                  </h4>

                  {/* Price & Action Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                    <div>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'var(--primary-blue)',
                        display: 'block',
                        lineHeight: 1,
                        whiteSpace: 'nowrap'
                      }}>
                        {formatPrice(prod.price)}
                      </span>

                      {prod.oldPrice && (
                        <span style={{
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          textDecoration: 'line-through',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatPrice(prod.oldPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod);
                        showToast(lang === 'uz' ? `${nameStr} savatga qo'shildi!` : `${nameStr} добавлен в корзину!`);
                      }}
                      style={{
                        background: 'var(--primary-blue)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.4rem 0.75rem',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-blue-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-blue)'}
                    >
                      <ShoppingBag size={13} />
                      <span>+ Savat</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Hint Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.25rem',
          color: isDark ? '#f59e0b' : '#8c6d46',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <Zap size={14} color="#b45309" />
          <span>{lang === 'uz' ? 'Karuselni to\'xtatish uchun kursor bilan ustiga keling. Barcha kartochkalar original kafolatga ega.' : 'Наведите курсор для остановки карусели. Все товары имеют официальную гарантию.'}</span>
        </div>

      </div>
    </section>
  );
}
