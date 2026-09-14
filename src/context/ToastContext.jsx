import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1100,
          background: '#0f172a', color: '#ffffff',
          padding: '0.85rem 1.5rem', borderRadius: '50px',
          boxShadow: 'var(--shadow-lg)', fontWeight: 600, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          border: '1px solid var(--primary-blue)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
