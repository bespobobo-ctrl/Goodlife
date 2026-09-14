import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('goodlife_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Error loading wishlist from storage:', e);
      return [];
    }
  });

  const [compare, setCompare] = useState([]);
  const { showToast } = useToast();
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      localStorage.setItem('goodlife_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Error saving wishlist to storage:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(lang === 'uz' ? "Saralanganlardan olib tashlandi" : "Удалено из избранного");
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(lang === 'uz' ? "Saralanganlarga qo'shildi ❤️" : "Добавлено в избранное ❤️");
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const toggleCompare = (product) => {
    if (!product) return;
    setCompare((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(lang === 'uz' ? "Taqqoslashdan olib tashlandi" : "Удалено из сравнения");
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(lang === 'uz' ? "Taqqoslash ro'yxatiga qo'shildi 🔄" : "Добавлено в сравнение 🔄");
        return [...prev, product];
      }
    });
  };

  const isCompared = (id) => {
    return compare.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      compare,
      toggleWishlist,
      isWishlisted,
      toggleCompare,
      isCompared,
      wishlistCount: wishlist.length,
      compareCount: compare.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
