import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const TelegramContext = createContext();

export function TelegramProvider({ children }) {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [isTMA, setIsTMA] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const app = window.Telegram.WebApp;
      setTg(app);

      // Verify if running inside Telegram Mini App
      const hasInitData = Boolean(app.initData && app.initData.length > 0);
      const isMobilePlatform = ['ios', 'android', 'tdesktop', 'weba', 'webk'].includes(app.platform);
      const active = hasInitData || isMobilePlatform || window.location.search.includes('tgWebAppPlatform');
      setIsTMA(active);

      if (app.initDataUnsafe && app.initDataUnsafe.user) {
        setUser(app.initDataUnsafe.user);
      }

      // Signal Telegram that Web App is ready and expand to full view
      try {
        app.ready();
        app.expand();
        if (app.enableClosingConfirmation) {
          app.enableClosingConfirmation();
        }
      } catch (e) {
        console.warn('Telegram WebApp init warning:', e);
      }
    }
  }, []);

  // Haptic feedback helpers
  const hapticImpact = useCallback((type = 'medium') => {
    try {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch {}
  }, [tg]);

  const hapticNotification = useCallback((type = 'success') => {
    try {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    } catch {}
  }, [tg]);

  const hapticSelection = useCallback(() => {
    try {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
      }
    } catch {}
  }, [tg]);

  // Send structured data back to Telegram bot
  const sendData = useCallback((data) => {
    try {
      if (tg && tg.sendData) {
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        tg.sendData(payload);
      }
    } catch (e) {
      console.warn('Telegram sendData error:', e);
    }
  }, [tg]);

  // Close Web App
  const closeApp = useCallback(() => {
    try {
      if (tg && tg.close) {
        tg.close();
      }
    } catch {}
  }, [tg]);

  // Native Telegram Back Button Manager
  const setBackButton = useCallback((isVisible, onClickHandler) => {
    try {
      if (tg && tg.BackButton) {
        if (isVisible) {
          tg.BackButton.show();
          if (onClickHandler) {
            tg.BackButton.onClick(onClickHandler);
          }
        } else {
          tg.BackButton.hide();
        }
      }
    } catch {}
  }, [tg]);

  // Native Telegram Main Button Manager
  const setMainButton = useCallback(({ text, isVisible = true, onClickHandler, color, textColor }) => {
    try {
      if (tg && tg.MainButton) {
        if (isVisible) {
          if (text) tg.MainButton.setText(text);
          if (color) tg.MainButton.setParams({ color, text_color: textColor || '#ffffff' });
          if (onClickHandler) tg.MainButton.onClick(onClickHandler);
          tg.MainButton.show();
        } else {
          tg.MainButton.hide();
        }
      }
    } catch {}
  }, [tg]);

  return (
    <TelegramContext.Provider
      value={{
        tg,
        user,
        isTMA,
        hapticImpact,
        hapticNotification,
        hapticSelection,
        sendData,
        closeApp,
        setBackButton,
        setMainButton
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}
