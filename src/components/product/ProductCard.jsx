import React from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const nameStr = typeof product.name === 'object' ? product.name[lang] : product.name;

  return (
    <div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      
      {/* Top Action Buttons */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 3 }}>
        <button
          onClick={() => toggleWishlist(product)}
          style={{
            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
            background: wishlisted ? 'var(--primary-orange)' : '#ffffff',
            color: wishlisted ? '#fff' : 'var(--text-secondary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Heart size={16} fill={wishlisted ? '#fff' : 'none'} />
        </button>
        
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              background: '#ffffff', color: 'var(--text-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {/* Product Image */}
      <img
        src={product.image || (product.images && product.images[0])}
        alt={nameStr}
        className="product-img"
        style={{ cursor: 'pointer' }}
        onClick={() => onQuickView && onQuickView(product)}
      />

      {/* Info */}
      <div style={{ cursor: 'pointer' }} onClick={() => onQuickView && onQuickView(product)}>
        <RatingStars rating={product.rating || 5} />

        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', height: '2.8rem', overflow: 'hidden', marginTop: '0.3rem' }}>
          {nameStr}
        </h3>

        <div>
          <span className="price-tag">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
        </div>
      </div>

      <button className="btn-add-cart" onClick={() => addToCart(product)}>
        <ShoppingBag size={16} />
        <span>{t.addToCart}</span>
      </button>
    </div>
  );
}
