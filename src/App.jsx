import React, { useState } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { TelegramProvider, useTelegram } from './context/TelegramContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/cart/WishlistDrawer';
import CompareModal from './components/product/CompareModal';
import QuickViewModal from './components/product/QuickViewModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';

// Code splitting / Lazy loading secondary and heavy pages (reduces initial bundle size)
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const PagesPage = React.lazy(() => import('./pages/PagesPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

const getPageFromHash = () => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const valid = ['home', 'shop', 'about', 'pages', 'blog', 'contact', 'admin'];
  return valid.includes(hash) ? hash : 'home';
};

function MainAppContent() {
  const [activePage, setActivePageState] = useState(() => getPageFromHash());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sync active page state with URL hash
  const setActivePage = (pageId) => {
    setActivePageState(pageId);
    if (typeof window !== 'undefined') {
      const targetHash = '#' + pageId;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    }
  };

  // Listen to browser Back / Forward buttons and manual hash changes
  React.useEffect(() => {
    const handleHashSync = () => {
      const page = getPageFromHash();
      setActivePageState(page);
    };
    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, []);

  // Telegram Mini App Context
  const { setBackButton } = useTelegram();

  // Sync Telegram native Back Button
  React.useEffect(() => {
    const isModalOpen = Boolean(quickViewProduct || isWishlistOpen || isCompareOpen);
    const canGoBack = isModalOpen || activePage !== 'home';

    if (canGoBack) {
      setBackButton(true, () => {
        if (quickViewProduct) setQuickViewProduct(null);
        else if (isWishlistOpen) setIsWishlistOpen(false);
        else if (isCompareOpen) setIsCompareOpen(false);
        else setActivePage('home');
      });
    } else {
      setBackButton(false);
    }
  }, [quickViewProduct, isWishlistOpen, isCompareOpen, activePage, setBackButton]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId || 'all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectCategory={handleSelectCategory}
          />
        );
      case 'about':
        return (
          <React.Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>Yuklanmoqda...</div>}>
            <AboutPage />
          </React.Suspense>
        );
      case 'shop':
        return (
          <ShopPage
            onQuickView={(p) => setQuickViewProduct(p)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'pages':
        return (
          <React.Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>Yuklanmoqda...</div>}>
            <PagesPage />
          </React.Suspense>
        );
      case 'blog':
        return (
          <React.Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>Yuklanmoqda...</div>}>
            <BlogPage />
          </React.Suspense>
        );
      case 'contact':
        return (
          <React.Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>Yuklanmoqda...</div>}>
            <ContactPage />
          </React.Suspense>
        );
      case 'admin':
        return (
          <React.Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>Boshqaruv paneli yuklanmoqda...</div>}>
            <AdminPage onReturnHome={() => setActivePage('home')} />
          </React.Suspense>
        );
      default:
        return (
          <HomePage
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectCategory={handleSelectCategory}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      {/* Dynamic Header */}
      {activePage !== 'admin' && (
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenCompare={() => setIsCompareOpen(true)}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      )}

      {/* Dynamic Page Views */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderPage()}
      </main>

      {/* Drawers & Modals */}
      {activePage !== 'admin' && (
        <>
          <CartDrawer />
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
          />
          <CompareModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
          />
          <QuickViewModal
            product={quickViewProduct}
            isOpen={!!quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
          <Footer setActivePage={setActivePage} />
          {/* Native Mobile & Telegram Mini App Bottom Navigation */}
          <MobileBottomNav
            activePage={activePage}
            setActivePage={setActivePage}
            onOpenWishlist={() => setIsWishlistOpen(true)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TelegramProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <ToastProvider>
                <CartProvider>
                  <WishlistProvider>
                    <MainAppContent />
                  </WishlistProvider>
                </CartProvider>
              </ToastProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TelegramProvider>
    </ErrorBoundary>
  );
}
