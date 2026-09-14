import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Mode: 'light' | 'dim' | 'midnight' | 'auto'
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      return localStorage.getItem('goodlife_theme_mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  // Brightness Dimmer: 60 - 100 (%)
  const [brightness, setBrightnessState] = useState(() => {
    try {
      const saved = localStorage.getItem('goodlife_theme_brightness');
      return saved ? parseInt(saved, 10) : 100;
    } catch {
      return 100;
    }
  });

  // Eye-Care Warmth (Blue-light filter): boolean
  const [eyeCare, setEyeCareState] = useState(() => {
    try {
      return localStorage.getItem('goodlife_theme_eyecare') === 'true';
    } catch {
      return false;
    }
  });

  // Compute effective active theme ('light' | 'dim' | 'midnight')
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light';

    // Check time of day for realistic ambient lighting
    const hours = new Date().getHours();
    const isLateNight = hours >= 22 || hours < 6;  // 22:00 - 06:00 -> Midnight OLED
    const isEvening = hours >= 18 && hours < 22;   // 18:00 - 22:00 -> Dim Slate
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isLateNight) return 'midnight';
    if (isEvening || prefersDark) return 'dim';
    return 'light';
  };

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    return themeMode === 'auto' ? getSystemTheme() : themeMode;
  });

  // Update resolved theme whenever themeMode changes or on time/system change
  useEffect(() => {
    if (themeMode === 'auto') {
      const updateAuto = () => setResolvedTheme(getSystemTheme());
      updateAuto();

      // Listen to OS prefers-color-scheme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateAuto();
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
      }

      // Check time every minute
      const timer = setInterval(updateAuto, 60000);
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else {
          mediaQuery.removeListener(listener);
        }
        clearInterval(timer);
      };
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode]);

  // Apply theme attributes and CSS variables to document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-theme', resolvedTheme);
    root.style.setProperty('--app-brightness', `${brightness}%`);
    root.style.setProperty('--app-warmth', eyeCare ? '14%' : '0%');

    // Also update meta theme-color for mobile address bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    if (resolvedTheme === 'midnight') {
      metaThemeColor.content = '#030712';
    } else if (resolvedTheme === 'dim') {
      metaThemeColor.content = '#0b1329';
    } else {
      metaThemeColor.content = '#1d4ed8';
    }
  }, [resolvedTheme, brightness, eyeCare]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('goodlife_theme_mode', mode);
    } catch {}
  };

  const setBrightness = (val) => {
    const clamped = Math.max(60, Math.min(100, val));
    setBrightnessState(clamped);
    try {
      localStorage.setItem('goodlife_theme_brightness', clamped.toString());
    } catch {}
  };

  const setEyeCare = (val) => {
    setEyeCareState(val);
    try {
      localStorage.setItem('goodlife_theme_eyecare', val ? 'true' : 'false');
    } catch {}
  };

  // Quick cycle between modes: light -> dim -> midnight -> auto
  const cycleTheme = () => {
    const sequence = ['light', 'dim', 'midnight', 'auto'];
    const nextIdx = (sequence.indexOf(themeMode) + 1) % sequence.length;
    setThemeMode(sequence[nextIdx]);
  };

  // Reset to default comfortable settings
  const resetTheme = () => {
    setThemeMode('auto');
    setBrightness(100);
    setEyeCare(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        brightness,
        setBrightness,
        eyeCare,
        setEyeCare,
        resolvedTheme,
        cycleTheme,
        resetTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
