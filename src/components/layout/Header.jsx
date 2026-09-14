import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Heart, RefreshCw, Search, PhoneCall, ChevronDown, X, 
  ShieldCheck, Sparkles, ArrowRight, Zap, Headphones
} from 'lucide-react';
import GoodLifeLogo from '../common/GoodLifeLogo';
import LocationPicker from '../common/LocationPicker';
import ThemeControlModal from '../common/ThemeControlModal';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductService } from '../../services/productService';

export default function Header({ activePage = 'home', setActivePage, onOpenWishlist, onOpenCompare, onQuickView }) {
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { totalCount, totalPrice, openCart } = useCart();
  const { wishlistCount, compareCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveResults, setLiveResults] = useState([]);
  const searchRef = useRef(null);

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'shop', label: t.shop },
    { id: 'pages', label: t.pages },
    { id: 'blog', label: t.blog },
    { id: 'contact', label: t.contact }
  ];

  // Close search suggestions overlay on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live search results as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      return;
    }

    let isMounted = true;
    ProductService.searchProducts(searchQuery, 'all', lang).then((data) => {
      if (isMounted) {
        setLiveResults(data.slice(0, 5));
      }
    });
    return () => { isMounted = false; };
  }, [searchQuery, lang]);

  const handleNavClick = (pageId) => {
    if (setActivePage) setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    handleNavClick('shop');
    setIsSearchFocused(false);
  };

  const popularSearches = [
    { label: lang === 'uz' ? 'Smartfonlar & Planshetlar' : 'Смартфоны', id: 'mobiles' },
    { label: 'Playstation 5 & Xbox', id: 'gaming' },
    { label: lang === 'uz' ? 'No-Frost Muzlatgich' : 'Холодильники No-Frost', id: 'fridge' },
    { label: lang === 'uz' ? 'Dell Noutbuk' : 'Ноутбуки Dell', id: 'laptops' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--header-bg, #ffffff)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'background 0.3s ease' }}>
      
      {/* 1. TOP UTILITY PRE-HEADER (Location, Phone, Theme, Currency, Language, Admin) */}
      <div style={{
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0.35rem 0',
        fontSize: '0.78rem'
      }}>
        <div className="container header-pre-header-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'nowrap'
        }}>
          {/* Left: Location & 24/7 Support */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
            <LocationPicker />
            
            <div className="header-phone-box" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <PhoneCall size={13} color="var(--primary-orange)" />
              <span>+998 71 200 00 00</span>
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(16,185,129,0.15)',
                color: '#10b981',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 800
              }}>
                24/7
              </span>
            </div>
          </div>

          {/* Right: Ambient Theme, Currency, Language, Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Ambient Lighting & Dark Mode Center */}
            <ThemeControlModal compact={false} />

            {/* Currency Switcher USD / UZS */}
            <div className="lang-switch header-currency-switch">
              <button
                className={`lang-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => setCurrency('USD')}
                aria-label="USD Currency"
              >
                USD ($)
              </button>
              <button
                className={`lang-btn ${currency === 'UZS' ? 'active' : ''}`}
                onClick={() => setCurrency('UZS')}
                aria-label="UZS Currency"
              >
                UZS (so'm)
              </button>
            </div>

            {/* Language Switcher UZ / RU */}
            <div className="lang-switch header-lang-switch">
              <button
                className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
                onClick={() => setLang('uz')}
                aria-label="O'zbek tili"
              >
                UZ 🇺🇿
              </button>
              <button
                className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                onClick={() => setLang('ru')}
                aria-label="Русский язык"
              >
                RU 🇷🇺
              </button>
            </div>

            {/* Admin Panel Link */}
            <button
              className="header-admin-btn"
              onClick={() => handleNavClick(activePage === 'admin' ? 'home' : 'admin')}
              style={{
                background: activePage === 'admin' ? 'var(--primary-orange)' : 'var(--primary-blue-light)',
                color: activePage === 'admin' ? '#fff' : 'var(--primary-blue)',
                border: '1px solid var(--border-blue)',
                padding: '0.3rem 0.75rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={14} />
              <span>{activePage === 'admin' ? "Do'kon" : "Admin"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN SPACIOUS BRAND & SEARCH HEADER */}
      <div className="top-header" style={{ padding: '0.85rem 0', background: 'var(--header-bg)' }}>
        <div className="container header-main-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2.5rem'
        }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} style={{ textDecoration: 'none' }}>
              <GoodLifeLogo
                size={46}
                showText={true}
                subtitle={lang === 'uz' ? "MAISHIY TEXNIKA" : "БЫТОВАЯ ТЕХНИКА"}
              />
            </a>
          </div>

          {/* Wide & Spacious Search System */}
          <div
            ref={searchRef}
            className={`search-box-wrapper ${isSearchFocused ? 'expanded' : ''}`}
            style={{
              position: 'relative',
              flex: '1 1 560px',
              maxWidth: '680px',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <form onSubmit={handleSearchSubmit} className="search-box-pill" style={{ width: '100%' }}>
              <Search
                size={20}
                style={{
                  color: isSearchFocused ? 'var(--primary-blue)' : 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                  flexShrink: 0
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={lang === 'uz' ? "10,000 dan ortiq maishiy texnika mahsulotlarini qidirish..." : "Поиск среди 10,000+ товаров бытовой техники..."}
                aria-label={t.searchPlaceholder}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0.7rem 0.9rem',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxShadow: 'none',
                  width: '100%',
                  color: 'var(--text-dark)'
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    marginRight: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              )}

              <button type="submit" className="search-btn-gradient" aria-label="Search">
                <span>{lang === 'uz' ? "Qidirish" : "Поиск"}</span>
              </button>
            </form>

            {/* Live Interactive Search Suggestions Dropdown Overlay */}
            {isSearchFocused && (
              <div className="search-suggestions-dropdown">
                {searchQuery.trim() === '' ? (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} color="var(--primary-orange)" />
                      <span>{lang === 'uz' ? "Ommabop qidiruvlar" : "Популярные запросы"}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {popularSearches.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item.label);
                            handleNavClick('shop');
                            setIsSearchFocused(false);
                          }}
                          style={{
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '50px',
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--text-dark)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-blue-light)';
                            e.currentTarget.style.color = 'var(--primary-blue)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-subtle)';
                            e.currentTarget.style.color = 'var(--text-dark)';
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : liveResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {lang === 'uz' ? "Natijalar" : "Результаты поиска"} ({liveResults.length})
                    </div>
                    {liveResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (onQuickView) onQuickView(product);
                          setIsSearchFocused(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-blue-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <img src={product.image} alt={typeof product.name === 'object' ? (product.name[lang] || product.name.uz) : product.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px' }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <h5 style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-dark)' }}>
                            {typeof product.name === 'object' ? (product.name[lang] || product.name.uz) : product.name}
                          </h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 700 }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <ArrowRight size={16} color="var(--primary-blue)" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '0.75rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {lang === 'uz' ? "Mahsulot topilmadi" : "Ничего не найдено"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Shopping Actions: Compare, Wishlist, Cart */}
          <div className="header-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            
            {/* Compare Trigger */}
            <div
              className="action-item"
              onClick={onOpenCompare}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 6px'
              }}
              aria-label={t.compare}
            >
              <div style={{ position: 'relative' }}>
                <RefreshCw size={22} color="var(--primary-blue)" />
                {compareCount > 0 && <span className="action-badge">{compareCount}</span>}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>{t.compare}</span>
            </div>

            {/* Wishlist Trigger */}
            <div
              className="action-item"
              onClick={onOpenWishlist}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 6px'
              }}
              aria-label={t.wishlist}
            >
              <div style={{ position: 'relative' }}>
                <Heart size={22} color="var(--primary-blue)" />
                {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>{t.wishlist}</span>
            </div>

            {/* Cart Trigger */}
            <div
              className="action-item"
              onClick={openCart}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--primary-blue-light)',
                padding: '0.55rem 1.1rem',
                borderRadius: '50px',
                border: '1.5px solid var(--border-blue)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(29, 78, 216, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label={t.cart}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={22} color="var(--primary-blue)" />
                {totalCount > 0 && <span className="action-badge">{totalCount}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>{t.cart}</span>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--primary-blue)', lineHeight: 1.2 }}>
                  {totalPrice > 0 ? formatPrice(totalPrice) : `${totalCount} tovar`}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION MENU BAR */}
      <div className="nav-bar desktop-nav-bar" style={{ background: 'var(--header-bg)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container nav-container">
          <button className="btn-categories" onClick={() => handleNavClick('shop')}>
            <ChevronDown size={18} />
            <span>{t.browseCategories}</span>
          </button>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                  style={{
                    color: activePage === item.id ? 'var(--primary-blue)' : 'var(--text-dark)',
                    fontWeight: activePage === item.id ? 800 : 600
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Special Promo Highlight Badge on Nav Bar Right */}
          <div
            onClick={() => handleNavClick('shop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              color: 'var(--primary-orange)',
              background: 'var(--primary-orange-light)',
              padding: '0.4rem 0.9rem',
              borderRadius: '50px',
              border: '1px solid rgba(249, 115, 22, 0.25)'
            }}
          >
            <Zap size={15} color="var(--primary-orange)" />
            <span>{lang === 'uz' ? "Hafta Chegirmalari -40%" : "Скидки Недели -40%"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
