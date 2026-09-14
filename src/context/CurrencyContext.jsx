import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem('goodlife_currency') || 'USD';
    } catch (e) {
      return 'USD';
    }
  });

  const [exchangeRate, setExchangeRateState] = useState(() => {
    try {
      const saved = localStorage.getItem('goodlife_exchange_rate');
      return saved ? Number(saved) : 12900;
    } catch (e) {
      return 12900;
    }
  });

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('goodlife_currency', curr);
    } catch (e) {}
  };

  const setExchangeRate = (rate) => {
    const numericRate = Number(rate) || 12900;
    setExchangeRateState(numericRate);
    try {
      localStorage.setItem('goodlife_exchange_rate', numericRate.toString());
    } catch (e) {}
  };

  const formatPrice = (priceUSD) => {
    const val = Number(priceUSD) || 0;
    if (currency === 'UZS') {
      const uzs = Math.round(val * exchangeRate);
      return uzs.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
    }
    return `$${val.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      exchangeRate,
      setCurrency,
      setExchangeRate,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
