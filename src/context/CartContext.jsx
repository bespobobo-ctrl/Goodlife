import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('goodlife_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Error loading cart from storage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      localStorage.setItem('goodlife_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Error saving cart to storage:', e);
    }
  }, [cart]);

  const addToCart = (product) => {
    if (!product) return;
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    const nameStr = typeof product.name === 'object' ? (product.name[lang] || product.name.uz) : product.name;
    showToast(lang === 'uz' ? `"${nameStr}" savatchaga qo'shildi! 🛒` : `"${nameStr}" добавлен в корзину! 🛒`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalCount,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
