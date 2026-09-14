import React from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function EmptyState({ message, onReset }) {
  const { lang } = useLanguage();

  return (
    <div style={{
      width: '100%',
      gridColumn: '1 / -1',
      padding: '3rem 1.5rem',
      background: '#ffffff',
      border: '1px dashed var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'var(--primary-blue-light)', color: 'var(--primary-blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <PackageSearch size={32} />
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>
          {message || (lang === 'uz' ? "Mahsulotlar topilmadi" : "Товары не найдены")}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {lang === 'uz' ? "Qidiruv iborasini yoki filtr mezonlarini o'zgartirib ko'ring." : "Попробуйте изменить поисковый запрос или фильтры."}
        </p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          style={{
            background: 'var(--primary-blue)',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.4rem',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RefreshCw size={16} />
          <span>{lang === 'uz' ? "Filtrni Tiklash" : "Сбросить фильтры"}</span>
        </button>
      )}
    </div>
  );
}
