import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, Moon, CloudMoon, Sparkles, Sliders, Eye, RefreshCw, X, Check, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ThemeControlModal({ compact = false }) {
  const { 
    themeMode, setThemeMode, brightness, setBrightness, eyeCare, setEyeCare, 
    resolvedTheme, resetTheme 
  } = useTheme();
  const { lang } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Current icon and color indicator
  const getThemeInfo = () => {
    switch (themeMode) {
      case 'light':
        return { 
          icon: Sun, 
          label: lang === 'uz' ? 'Kunduzgi' : 'Дневной', 
          color: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.25)',
          bg: 'rgba(245, 158, 11, 0.12)'
        };
      case 'dim':
        return { 
          icon: CloudMoon, 
          label: lang === 'uz' ? 'Oqshom' : 'Сумерки', 
          color: '#6366f1',
          glow: 'rgba(99, 102, 241, 0.25)',
          bg: 'rgba(99, 102, 241, 0.12)'
        };
      case 'midnight':
        return { 
          icon: Moon, 
          label: lang === 'uz' ? 'Yarim Tun' : 'Полночь', 
          color: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.25)',
          bg: 'rgba(6, 182, 212, 0.12)'
        };
      default:
        return { 
          icon: Sparkles, 
          label: lang === 'uz' ? 'Avto Datchik' : 'Авто датчик', 
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.25)',
          bg: 'rgba(16, 185, 129, 0.12)'
        };
    }
  };

  const currentInfo = getThemeInfo();
  const CurrentIcon = currentInfo.icon;

  const modes = [
    {
      id: 'light',
      title: lang === 'uz' ? 'Kunduzgi Rejim' : 'Дневной режим',
      desc: lang === 'uz' ? 'Yorug\' xona va quyosh nuri uchun maksimal tiniqlik' : 'Максимальная четкость для светлых комнат',
      tag: '100% Light',
      tagColor: '#d97706',
      tagBg: '#fef3c7',
      icon: Sun,
      iconColor: '#f59e0b',
      borderActive: '#f59e0b'
    },
    {
      id: 'dim',
      title: lang === 'uz' ? 'Oqshom Rejimi' : 'Режим Сумерки',
      desc: lang === 'uz' ? 'Ko\'zni toliqtirmaydigan yumshoq to\'q moviy fon' : 'Мягкий темно-синий тон против усталости глаз',
      tag: lang === 'uz' ? 'Tavsiya etiladi' : 'Рекомендуется',
      tagColor: '#6366f1',
      tagBg: 'rgba(99, 102, 241, 0.15)',
      icon: CloudMoon,
      iconColor: '#818cf8',
      borderActive: '#6366f1'
    },
    {
      id: 'midnight',
      title: lang === 'uz' ? 'Yarim Tun (OLED)' : 'Полночь (OLED)',
      desc: lang === 'uz' ? 'Qorong\'i xonalar va OLED displeylar uchun chuqur qora' : 'Глубокий черный для темных комнат и OLED экранов',
      tag: 'Pitch Black',
      tagColor: '#06b6d4',
      tagBg: 'rgba(6, 182, 212, 0.15)',
      icon: Moon,
      iconColor: '#22d3ee',
      borderActive: '#06b6d4'
    },
    {
      id: 'auto',
      title: lang === 'uz' ? 'Avtomatik Datchik' : 'Авто Датчик',
      desc: lang === 'uz' ? 'Kunning ayni soati va tizim rejimiga qarab moslashadi' : 'Автоматическая адаптация по времени и системе',
      tag: lang === 'uz' ? 'Aqlli Tizim' : 'Смарт сенсор',
      tagColor: '#10b981',
      tagBg: 'rgba(16, 185, 129, 0.15)',
      icon: Sparkles,
      iconColor: '#34d399',
      borderActive: '#10b981'
    }
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={lang === 'uz' ? "Yorug'lik & Tungi rejim sozlamalari" : "Настройки яркости и ночного режима"}
        aria-label="Toggle Theme Control"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          padding: compact ? '0.38rem 0.65rem' : '0.42rem 0.8rem',
          borderRadius: '50px',
          cursor: 'pointer',
          color: 'var(--text-dark)',
          fontSize: '0.8rem',
          fontWeight: 700,
          boxShadow: isOpen ? `0 0 0 3px ${currentInfo.glow}` : 'var(--shadow-sm)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.borderColor = currentInfo.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = isOpen ? currentInfo.color : 'var(--border-light)';
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: currentInfo.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentInfo.color,
          flexShrink: 0
        }}>
          <CurrentIcon size={14} />
        </div>

        {!compact && (
          <span style={{ fontSize: '0.78rem', letterSpacing: '-0.01em' }}>
            {currentInfo.label}
          </span>
        )}

        {/* Ambient Brightness Indicator Pill */}
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '10px',
          background: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)'
        }}>
          {brightness}%
        </span>
      </button>

      {/* Glassmorphic Ambient Control Modal / Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '370px',
            maxWidth: '92vw',
            background: 'var(--modal-bg, #ffffff)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.35), 0 0 0 1px var(--border-light)',
            padding: '1.25rem',
            zIndex: 1000,
            animation: 'themeModalEnter 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            color: 'var(--text-dark)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CurrentIcon size={18} color={currentInfo.color} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  {lang === 'uz' ? "Yorug'lik & Tungi Rejim" : "Свет и Ночной Режим"}
                </h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                {lang === 'uz' ? "Xona yorug'ligi va ko'zingizga qarab moslang" : "Адаптируйте освещение под ваше окружение"}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--bg-subtle)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* 4 Theme Mode Selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.25rem' }}>
            {modes.map((m) => {
              const isSelected = themeMode === m.id;
              const IconComp = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => setThemeMode(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? m.borderActive : 'var(--border-light)'}`,
                    background: isSelected ? 'var(--bg-subtle-hover, rgba(37,99,235,0.08))' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--text-muted)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-light)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: isSelected ? m.borderActive : 'var(--bg-subtle)',
                      color: isSelected ? '#ffffff' : m.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}>
                      <IconComp size={18} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                          {m.title}
                        </span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: m.tagBg,
                          color: m.tagColor
                        }}>
                          {m.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {m.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? m.borderActive : 'var(--border-light)'}`,
                    background: isSelected ? m.borderActive : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: '8px'
                  }}>
                    {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Yorug'lik Quvvati (Dimmer Brightness Slider: 60% - 100%) */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                <Sliders size={14} color="var(--primary-blue)" />
                <span>{lang === 'uz' ? "Yorug'lik Darajasi" : "Уровень Яркости"}</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--primary-blue)' }}>
                {brightness}%
              </span>
            </div>

            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: 'var(--primary-blue)',
                height: '6px',
                padding: 0,
                boxShadow: 'none',
                background: 'var(--border-light)',
                borderRadius: '4px'
              }}
            />

            {/* Quick Preset Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem', marginTop: '0.6rem' }}>
              {[
                { val: 65, label: lang === 'uz' ? 'Qorong\'i (65%)' : 'Тёмно (65%)' },
                { val: 85, label: lang === 'uz' ? 'Oqshom (85%)' : 'Вечер (85%)' },
                { val: 100, label: lang === 'uz' ? 'Tiniq (100%)' : 'Ярко (100%)' }
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setBrightness(p.val)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: brightness === p.val ? 'var(--primary-blue)' : 'var(--bg-card)',
                    color: brightness === p.val ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ko'zni Asrash (Eye-Care Warmth Filter) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: eyeCare ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-subtle)',
            borderRadius: '14px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            border: `1.5px solid ${eyeCare ? '#f59e0b' : 'var(--border-light)'}`,
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: eyeCare ? '#f59e0b' : 'var(--bg-card)',
                color: eyeCare ? '#ffffff' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Eye size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {lang === 'uz' ? "Ko'zni Asrash (Iliq Rang)" : "Защита глаз (Теплый тон)"}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {lang === 'uz' ? "Moviy nurni pasaytiruvchi filtr" : "Снижает синее излучение"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setEyeCare(!eyeCare)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '50px',
                background: eyeCare ? '#f59e0b' : 'var(--border-light)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: eyeCare ? '23px' : '3px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {/* Reset / Default Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {lang === 'uz' ? `Faol rejim: ${resolvedTheme.toUpperCase()}` : `Активно: ${resolvedTheme.toUpperCase()}`}
            </div>

            <button
              onClick={resetTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-blue)',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-blue-light)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <RefreshCw size={12} />
              <span>{lang === 'uz' ? "Standart holat" : "Сброс"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
