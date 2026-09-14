import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistDrawer({ isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-card)',
        color: 'var(--text-dark)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        animation: 'slideLeft 0.3s ease'
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart color="var(--primary-orange)" fill="var(--primary-orange)" />
            <h3 style={{ fontSize: '1.2rem' }}>{t.wishlist} ({wishlist.length})</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>{lang === 'uz' ? "Saralangan tovarlar yo'q" : "Избранных товаров нет"}</p>
            </div>
          ) : (
            wishlist.map((item) => {
              const nameStr = typeof item.name === 'object' ? item.name[lang] || item.name.uz : item.name;
              return (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                  <img src={item.image} alt={nameStr} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: '0.2rem' }}>{nameStr}</h4>
                    <div style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '0.95rem' }}>{formatPrice(item.price)}</div>
                    
                    <button
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                      style={{
                        background: 'var(--primary-blue-light)',
                        color: 'var(--primary-blue)',
                        border: 'none',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        marginTop: '0.4rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>

                  <button onClick={() => toggleWishlist(item)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
