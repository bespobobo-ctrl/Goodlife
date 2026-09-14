import React from 'react';
import { Home, Grid, Heart, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTelegram } from '../../context/TelegramContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileBottomNav({ activePage, setActivePage, onOpenWishlist }) {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isTMA, user, hapticSelection } = useTelegram();
  const { lang, t } = useLanguage();

  const handleTabClick = (pageId) => {
    hapticSelection();
    if (pageId === 'cart') {
      openCart();
      return;
    }
    if (pageId === 'wishlist') {
      if (onOpenWishlist) onOpenWishlist();
      return;
    }
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--header-bg, #ffffff)',
        borderTop: '1px solid var(--border-light)',
        padding: '0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom, 0px)) 0.5rem',
        zIndex: 90,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 1. Home */}
      <button
        onClick={() => handleTabClick('home')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: activePage === 'home' ? 'var(--primary-blue)' : 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
          padding: '4px 0'
        }}
      >
        <Home size={20} strokeWidth={activePage === 'home' ? 2.5 : 1.8} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'home' ? 800 : 600 }}>
          {t.home || "Bosh sahifa"}
        </span>
      </button>

      {/* 2. Shop / Catalog */}
      <button
        onClick={() => handleTabClick('shop')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: activePage === 'shop' ? 'var(--primary-blue)' : 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
          padding: '4px 0'
        }}
      >
        <Grid size={20} strokeWidth={activePage === 'shop' ? 2.5 : 1.8} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'shop' ? 800 : 600 }}>
          {lang === 'uz' ? "Katalog" : "Каталог"}
        </span>
      </button>

      {/* 3. Wishlist */}
      <button
        onClick={() => handleTabClick('wishlist')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
          padding: '4px 0',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={20} strokeWidth={1.8} />
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-8px',
              background: 'var(--primary-orange)',
              color: '#ffffff',
              fontSize: '0.6rem',
              fontWeight: 800,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {wishlistCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>
          {t.wishlist || "Saralangan"}
        </span>
      </button>

      {/* 4. Cart Floating Highlight */}
      <button
        onClick={() => handleTabClick('cart')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--primary-blue)',
          cursor: 'pointer',
          flex: 1,
          padding: '4px 0',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-blue) 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-16px',
            boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)'
          }}>
            <ShoppingBag size={19} />
          </div>
          {totalCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-18px',
              right: '-4px',
              background: 'var(--primary-orange)',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 900,
              minWidth: '16px',
              height: '16px',
              borderRadius: '10px',
              padding: '0 3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              {totalCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, marginTop: '2px' }}>
          {t.cart || "Savatcha"}
        </span>
      </button>

      {/* 5. Telegram Profile / Admin */}
      <button
        onClick={() => handleTabClick(activePage === 'admin' ? 'home' : 'admin')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: activePage === 'admin' ? 'var(--primary-orange)' : 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
          padding: '4px 0'
        }}
      >
        {isTMA && user && user.first_name ? (
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'var(--primary-blue-light)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 800
          }}>
            {user.first_name[0].toUpperCase()}
          </div>
        ) : (
          <User size={20} strokeWidth={activePage === 'admin' ? 2.5 : 1.8} />
        )}
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'admin' ? 800 : 600 }}>
          {isTMA && user && user.first_name ? user.first_name.slice(0, 8) : (activePage === 'admin' ? "Do'kon" : "Profil")}
        </span>
      </button>
    </nav>
  );
}
