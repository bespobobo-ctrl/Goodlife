import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Heart, RefreshCw, Star, Check, ShieldCheck, Truck, RotateCcw, Zap, Minus, Plus, Eye, Flame, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { dealProducts, pcAccessories, recentlyAddedProducts, hotSummerOffers } from '../../data/products';

const allStoreProducts = [
  ...dealProducts,
  ...recentlyAddedProducts,
  ...pcAccessories,
  ...hotSummerOffers,
  {
    id: 'smeg-m-1',
    name: { uz: 'Smeg Stand Mixer Cream 4.8L', ru: 'Планетарный миксер Smeg 4.8L' },
    price: 420.00,
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&q=80'
  },
  {
    id: 'smeg-m-2',
    name: { uz: 'Smeg 2-Slice Toaster Cream', ru: 'Тостер Smeg на 2 слота' },
    price: 175.00,
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80'
  },
  {
    id: 'smeg-m-3',
    name: { uz: 'Smeg Personal Blender 0.6L', ru: 'Персональный блендер Smeg' },
    price: 160.00,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80'
  },
  {
    id: 'smeg-m-4',
    name: { uz: 'Smeg Drip Coffee Machine 10-Cup', ru: 'Кофеварка Smeg 10 чашек' },
    price: 230.00,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80'
  }
];

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const { currency, formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted, toggleCompare, isCompared } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('desc');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselTrackRef = useRef(null);

  // Auto-slide carousel interval across all products
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % (allStoreProducts.length || 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset local state when product changes
  useEffect(() => {
    if (product) {
      setActiveTab('desc');
      setSelectedColor('black');
      setQuantity(1);
      setActiveImageIdx(0);
      setCarouselIdx(0);
      setIsBuyNowOpen(false);
      setOrderSuccess(false);
      setIsLightboxOpen(false);
    }
  }, [product]);

  // Product multi-angle gallery images (uses product.images up to 5 photos if available)
  const galleryImages = product ? (
    (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : [
          product.image,
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
        ].filter(Boolean)
  ) : [];

  // Handle ESC key & Arrow keys press for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setLightboxIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIdx((prev) => (prev + 1) % (galleryImages.length || 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLightboxOpen, onClose, galleryImages.length]);

  if (!isOpen || !product) return null;

  const nameStr = typeof product.name === 'object' ? (product.name[lang] || product.name.uz) : product.name;
  const wishlisted = typeof isWishlisted === 'function' ? isWishlisted(product.id) : false;
  const compared = typeof isCompared === 'function' ? isCompared(product.id) : false;

  const colors = [
    { id: 'black', label: lang === 'uz' ? 'Kosmik Qora' : 'Космический Черный', hex: '#0f172a' },
    { id: 'silver', label: lang === 'uz' ? 'Kumushrang White' : 'Серебристый Белый', hex: '#e2e8f0' },
    { id: 'blue', label: lang === 'uz' ? 'Qirollik Moviy' : 'Королевский Синий', hex: '#1d4ed8' },
    { id: 'gold', label: lang === 'uz' ? 'Oltinrang Rose' : 'Золотистый Розовый', hex: '#f59e0b' }
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(
      lang === 'uz'
        ? `${nameStr} (${quantity} dona) savatchaga qo'shildi!`
        : `${nameStr} (${quantity} шт.) добавлен в корзину!`
    );
  };

  const handleInstantBuySubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setOrderSuccess(true);
    showToast(
      lang === 'uz'
        ? `Rahmat ${customerName}! Buyurtmangiz qabul qilindi. Operatorimiz tez orada bog'lanadi.`
        : `Спасибо, ${customerName}! Ваш заказ принят. Оператор свяжется с вами.`
    );
    setTimeout(() => {
      setIsBuyNowOpen(false);
      setOrderSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      animation: 'modalBackdropFade 0.25s ease'
    }} onClick={onClose}>
      
      {/* Main Modal Card Window */}
      <div style={{
        maxWidth: '940px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-card)',
        color: 'var(--text-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.3)',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>

        {/* Top Header Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: 'var(--primary-blue-light)',
              color: 'var(--primary-blue)',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              GOOD LIFE OFFICIAL
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SKU: GL-99420</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dark)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = 'var(--text-dark)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Grid: Left Gallery + Right Specs & Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Image Gallery Viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Main Stage Image (Clickable for Full Screen Lightbox) */}
            <div
              onClick={() => {
                setLightboxIdx(activeImageIdx);
                setIsLightboxOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                height: '370px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
                cursor: 'zoom-in'
              }}
            >
              {product.badge && (
                <span className="product-badge" style={{ top: '16px', left: '16px', fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                  {product.badge}
                </span>
              )}

              {/* Zoom Hint Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                border: '1px solid var(--border-light)',
                borderRadius: '50px',
                padding: '0.35rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary-blue)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                <ZoomIn size={15} />
                <span>{lang === 'uz' ? 'Kattalashtirish' : 'Увеличить'}</span>
              </div>
              
              <img
                src={galleryImages[activeImageIdx] || product.image}
                alt={nameStr}
                style={{
                  maxWidth: '100%',
                  maxHeight: '310px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.12))',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Thumbnail Gallery Strip (Enlarged & UI/UX Enhanced) */}
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  style={{
                    width: '78px',
                    height: '78px',
                    borderRadius: '12px',
                    border: activeImageIdx === index ? '2.5px solid var(--primary-blue)' : '1.5px solid var(--border-light)',
                    background: '#ffffff',
                    padding: '6px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    transform: activeImageIdx === index ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: activeImageIdx === index ? '0 6px 16px rgba(29, 78, 216, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>

            {/* Trust Badges Strip (Redesigned) */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem 0.85rem',
              textAlign: 'center',
              fontSize: '0.78rem',
              color: '#1e3a8a',
              fontWeight: 800
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={22} color="var(--primary-blue)" />
                <span>{lang === 'uz' ? '1 Yil Kafolat' : '1 Год Гарантии'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={22} color="var(--primary-blue)" />
                <span>{lang === 'uz' ? '24h Bepul Kuryer' : 'Бесплатная Доставка'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={22} color="var(--primary-blue)" />
                <span>{lang === 'uz' ? '30 Kun Qaytarish' : '30 Дней Возврата'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Variants & Action Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Title & Rating */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'} />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>{product.rating || 4.9}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(148 {lang === 'uz' ? 'sharhlar' : 'отзывов'})</span>
              </div>

              <h2 style={{ fontSize: '1.75rem', lineHeight: 1.25, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                {nameStr}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block'
                }}></span>
                <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                  {lang === 'uz' ? 'Omborimizda Mavjud (Cheklangan miqdor)' : 'В наличии на складе (Ограничено)'}
                </span>
              </div>
            </div>

            {/* Price Box with Savings */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
              border: '1.5px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {lang === 'uz' ? 'Maxsus Aksiya Narxi:' : 'Специальная цена:'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: currency === 'UZS' ? '1.65rem' : '2.2rem',
                    fontWeight: 800,
                    color: 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1
                  }}>
                    {formatPrice(product.price)}
                  </span>

                  {product.oldPrice && (
                    <span style={{
                      fontSize: currency === 'UZS' ? '1rem' : '1.15rem',
                      color: '#94a3b8',
                      textDecoration: 'line-through',
                      whiteSpace: 'nowrap',
                      fontWeight: 600
                    }}>
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                {product.oldPrice && (
                  <span style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#ffffff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
                    flexShrink: 0
                  }}>
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {lang === 'uz' ? 'TEJAMKORLIK' : 'СКИДКА'}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                {lang === 'uz' ? 'Rangni tanlang:' : 'Выберите цвет:'}
              </label>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    title={c.label}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: selectedColor === c.id ? '3px solid var(--primary-blue)' : '1px solid var(--border-light)',
                      boxShadow: selectedColor === c.id ? '0 0 0 2px #fff, 0 0 0 4px var(--primary-blue)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {selectedColor === c.id && (
                      <Check size={14} style={{ color: c.id === 'silver' ? '#0f172a' : '#fff', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Real-Time Calculation */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                {lang === 'uz' ? 'Miqdori (Dona):' : 'Количество:'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '50px',
                  background: '#ffffff',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 0.9rem', cursor: 'pointer', color: 'var(--text-dark)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 0.9rem', cursor: 'pointer', color: 'var(--text-dark)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {lang === 'uz' ? 'Jami:' : 'Итого:'} <strong style={{ color: 'var(--primary-blue)', whiteSpace: 'nowrap' }}>{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    background: 'var(--primary-blue)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.85rem 1.2rem',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 20px rgba(29, 78, 216, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-blue-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-blue)'}
                >
                  <ShoppingBag size={20} />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  onClick={() => setIsBuyNowOpen(true)}
                  style={{
                    background: 'var(--primary-orange-light)',
                    color: 'var(--primary-orange)',
                    border: '1.5px solid var(--primary-orange)',
                    padding: '0.85rem 1rem',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Zap size={18} />
                  <span>{lang === 'uz' ? 'Tezkor Buyurtma' : 'Быстрый Заказ'}</span>
                </button>
              </div>

              {/* Wishlist & Compare Toggles */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    flex: 1,
                    background: wishlisted ? 'var(--primary-orange-light)' : '#ffffff',
                    border: '1px solid var(--border-light)',
                    color: wishlisted ? 'var(--primary-orange)' : 'var(--text-dark)',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Heart size={16} fill={wishlisted ? 'var(--primary-orange)' : 'none'} color={wishlisted ? 'var(--primary-orange)' : 'currentColor'} />
                  <span>{wishlisted ? (lang === 'uz' ? 'Saralanganlarda' : 'В избранном') : t.wishlist}</span>
                </button>

                <button
                  onClick={() => toggleCompare(product)}
                  style={{
                    flex: 1,
                    background: compared ? 'var(--primary-blue-light)' : '#ffffff',
                    border: '1px solid var(--border-light)',
                    color: compared ? 'var(--primary-blue)' : 'var(--text-dark)',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <RefreshCw size={16} color={compared ? 'var(--primary-blue)' : 'currentColor'} />
                  <span>{compared ? (lang === 'uz' ? 'Taqqoslanmoqda' : 'В сравнении') : t.compare}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* FULL-WIDTH Senior UI/UX Interactive Horizontal Product Carousel Slider Strip with ALL Store Products */}
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          {/* Header with Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
              border: '1px solid #fed7aa',
              color: '#c2410c',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.02em'
            }}>
              <Flame size={14} color="#ea580c" />
              <span>{lang === 'uz' ? `DO'KONDAGI BARCHA MAHSULOTLAR (${allStoreProducts.length})` : `ВСЕ ТОВАРЫ МАГАЗИНА (${allStoreProducts.length})`}</span>
            </div>

            {/* Navigation Chevron Controls */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setCarouselIdx((prev) => (prev > 0 ? prev - 1 : allStoreProducts.length - 1))}
                aria-label="Previous product"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '1px solid #cbd5e1', background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-dark)', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-blue)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = 'var(--text-dark)'; }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setCarouselIdx((prev) => (prev + 1) % allStoreProducts.length)}
                aria-label="Next product"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '1px solid #cbd5e1', background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-dark)', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-blue)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = 'var(--text-dark)'; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Carousel Track Window (Interactive Scroll + Chevrons) */}
          <div
            ref={carouselTrackRef}
            style={{
              overflowX: 'auto',
              width: '100%',
              borderRadius: '12px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '1rem',
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(-${carouselIdx * 180}px)`
            }}>
              {allStoreProducts.map((carProduct, idx) => {
                const carName = typeof carProduct.name === 'object' ? carProduct.name[lang] || carProduct.name.uz : carProduct.name;
                return (
                  <div
                    key={`${carProduct.id}-${idx}`}
                    onClick={() => {
                      addToCart(carProduct);
                      showToast(lang === 'uz' ? `${carName} savatga qo'shildi!` : `${carName} добавлен в корзину!`);
                    }}
                    style={{
                      flex: '0 0 170px',
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '0.85rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -5px rgba(29, 78, 216, 0.22)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.03)';
                    }}
                  >
                    {/* Square Image Box (SMEG Appliance Stage) */}
                    <div style={{
                      width: '115px',
                      height: '115px',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={carProduct.image}
                        alt={carName}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))' }}
                      />
                    </div>

                    {/* Title & Formatted Price */}
                    <div style={{ width: '100%' }}>
                      <h5 style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--text-dark)',
                        lineHeight: 1.3,
                        margin: 0,
                        height: '2.3rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center'
                      }}>
                        {carName}
                      </h5>

                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: 'var(--primary-blue)',
                        display: 'block',
                        marginTop: '0.3rem',
                        fontFamily: 'var(--font-heading)',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatPrice(carProduct.price)}
                      </span>
                    </div>

                    {/* Premium Solid Royal Blue + Savat Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(carProduct);
                        showToast(lang === 'uz' ? `${carName} savatga qo'shildi!` : `${carName} добавлен в корзину!`);
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.45rem 0.75rem',
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        letterSpacing: '0.01em',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        marginTop: '0.35rem',
                        boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(29, 78, 216, 0.45)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <ShoppingBag size={13} color="#ffffff" />
                      <span>+ Savatga</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Tabbed Details Section */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
          
          {/* Tab Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1.5px solid var(--border-light)', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setActiveTab('desc')}
              style={{
                background: 'none', border: 'none', padding: '0.75rem 1rem', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.92rem',
                color: activeTab === 'desc' ? 'var(--primary-blue)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'desc' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                marginBottom: '-1.5px', transition: 'all 0.2s ease'
              }}
            >
              {lang === 'uz' ? "Mahsulot Tavsifi" : "Описание Товара"}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              style={{
                background: 'none', border: 'none', padding: '0.75rem 1rem', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.92rem',
                color: activeTab === 'specs' ? 'var(--primary-blue)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'specs' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                marginBottom: '-1.5px', transition: 'all 0.2s ease'
              }}
            >
              {lang === 'uz' ? "Texnik Xususiyatlari" : "Технические Характеристики"}
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              style={{
                background: 'none', border: 'none', padding: '0.75rem 1rem', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.92rem',
                color: activeTab === 'delivery' ? 'var(--primary-blue)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'delivery' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                marginBottom: '-1.5px', transition: 'all 0.2s ease'
              }}
            >
              {lang === 'uz' ? "Yetkazib Berish & Kafolat" : "Доставка и Гарантия"}
            </button>
          </div>

          {/* Tab Content 1: Description */}
          {activeTab === 'desc' && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {product.shortDesc && (
                <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderLeft: '3px solid var(--primary-blue)', borderRadius: '6px', marginBottom: '1rem', color: '#1e293b', fontWeight: 600 }}>
                  {product.shortDesc}
                </div>
              )}

              {product.fullDesc ? (
                <div style={{ marginBottom: '1rem', whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
                  {product.fullDesc}
                </div>
              ) : (
                <p style={{ marginBottom: '0.75rem' }}>
                  {lang === 'uz'
                    ? `${nameStr} — GoodLife do'konining eng so'nggi zamonaviy va energiya tejamkor modelidir. Yuqori sifatli materiallar, mustahkam korpus hamda yangi avlod texnologiyasi bilan jihozlangan.`
                    : `${nameStr} — новинка от магазина GoodLife. Изготовлен из высококачественных материалов с применением технологий нового поколения.`
                  }
                </p>
              )}

              <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                {product.deliveryInfo || (lang === 'uz'
                  ? "Barcha tovarlar rasmiy bojxona va sifat sertifikatlaridan o'tgan bo'lib, 12 oylik rasmiy zavod kafolati hamda O'zbekiston me'yorlariga mos servis xizmatlari bilan ta'minlanadi."
                  : "Вся продукция сертифицирована и поставляется с официальной заводской гарантией на 12 месяцев."
                )}
              </p>
            </div>
          )}

          {/* Tab Content 2: Specifications Table */}
          {activeTab === 'specs' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0', fontWeight: 700, color: 'var(--text-dark)', width: '220px' }}>
                      {lang === 'uz' ? "Ishlab chiqaruvchi brend:" : "Производитель:"}
                    </td>
                    <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>
                      {product.brand || "GOOD LIFE Official"}
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {lang === 'uz' ? "Artikul / Model kodi:" : "Артикул / Модель:"}
                    </td>
                    <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>
                      {product.sku || `${product.category || 'Elektronika'} / GL-2026`}
                    </td>
                  </tr>

                  {/* Dynamic specs if provided by admin */}
                  {Array.isArray(product.specsList) && product.specsList.length > 0 ? (
                    product.specsList.map((sp, sIdx) => (
                      <tr key={sIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 0', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {sp.key}:
                        </td>
                        <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>
                          {sp.value}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {lang === 'uz' ? "Energiya tejamkorlik:" : "Энергоэффективность:"}
                      </td>
                      <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>A+++ Inverter Eco</td>
                    </tr>
                  )}

                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {lang === 'uz' ? "Rasmiy Kafolat:" : "Гарантия:"}
                    </td>
                    <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>
                      {product.warranty || "12 Oylik Bepul Servis"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab Content 3: Delivery Info */}
          {activeTab === 'delivery' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-blue)', marginBottom: '0.4rem' }}>
                  🚚 {lang === 'uz' ? "Toshkent va Viloyatlar bo'ylab" : "Доставка по Узбекистану"}
                </h4>
                <p style={{ lineHeight: 1.5 }}>
                  {lang === 'uz'
                    ? "Toshkent shahri bo'ylab yetkazib berish buyurtma berilgan kunda 3 soat ichida amalga oshiriladi. Viloyat markazlariga 24 soat ichida yetkaziladi."
                    : "Доставка по Ташкенту осуществляется в день заказа. В регионы в течение 24 часов."
                  }
                </p>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-orange)', marginBottom: '0.4rem' }}>
                  💳 {lang === 'uz' ? "Qulay To'lov Usullari" : "Способы Оплаты"}
                </h4>
                <p style={{ lineHeight: 1.5 }}>
                  {lang === 'uz'
                    ? "Buyurtmani qabul qilib olgach naqd pul, Humo, Uzcard, Click yoki Payme orqali to'lashingiz mumkin."
                    : "Оплата наличными, Humo, Uzcard, Click или Payme при получении."
                  }
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>

      {/* Quick Instant Buy Pop-up Modal */}
      {isBuyNowOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              ⚡ {lang === 'uz' ? 'Tezkor Buyurtma Berish' : 'Быстрое Оформление'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {lang === 'uz' ? 'Ismingiz va telefon raqamingizni qoldiring, 5 minutda bog\'lanamiz!' : 'Оставьте имя и телефон, мы перезвоним за 5 минут!'}
            </p>

            {orderSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#10b981' }}>
                <Check size={48} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#10b981' }}>{lang === 'uz' ? 'Buyurtma Qabul Qilindi!' : 'Заказ Принят!'}</h4>
              </div>
            ) : (
              <form onSubmit={handleInstantBuySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
                    {lang === 'uz' ? 'Ismingiz:' : 'Ваше Имя:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Jasur"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
                    {lang === 'uz' ? 'Telefon raqamingiz:' : 'Телефон:'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsBuyNowOpen(false)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '50px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '50px', border: 'none', background: 'var(--primary-blue)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {lang === 'uz' ? 'Tasdiqlash' : 'Подтвердить'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Gallery Lightbox Modal */}
      {isLightboxOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          animation: 'modalBackdropFade 0.25s ease'
        }} onClick={() => setIsLightboxOpen(false)}>
          
          {/* Lightbox Top Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{nameStr}</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                {lightboxIdx + 1} / {galleryImages.length}
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Lightbox Stage with Left/Right Navigation Chevrons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '66vh',
            position: 'relative',
            padding: '0 1rem'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Left Chevron Button */}
            <button
              onClick={() => setLightboxIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-blue)'; e.currentTarget.style.borderColor = 'var(--primary-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Large Image */}
            <img
              src={galleryImages[lightboxIdx] || product.image}
              alt={nameStr}
              style={{
                maxWidth: '82vw',
                maxHeight: '62vh',
                objectFit: 'contain',
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6))',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />

            {/* Right Chevron Button */}
            <button
              onClick={() => setLightboxIdx((prev) => (prev + 1) % galleryImages.length)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-blue)'; e.currentTarget.style.borderColor = 'var(--primary-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Lightbox Bottom Thumbnail Gallery Selector */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '0.5rem'
          }} onClick={(e) => e.stopPropagation()}>
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setLightboxIdx(index);
                  setActiveImageIdx(index);
                }}
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '12px',
                  border: lightboxIdx === index ? '3px solid var(--primary-blue)' : '2px solid rgba(255,255,255,0.25)',
                  background: '#ffffff',
                  padding: '5px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  transform: lightboxIdx === index ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: lightboxIdx === index ? '0 8px 24px rgba(29, 78, 216, 0.6)' : 'none'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </button>
            ))}
          </div>

        </div>
      )}

    </>
  );
}
