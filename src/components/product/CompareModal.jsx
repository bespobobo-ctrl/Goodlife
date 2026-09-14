import React from 'react';
import { X, Check, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { dealProducts } from '../../data/products';

export default function CompareModal({ isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const compareItems = dealProducts.slice(0, 3);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        maxWidth: '850px', width: '100%', background: 'var(--bg-card)', color: 'var(--text-dark)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <RefreshCw size={24} color="var(--primary-blue)" />
          <h3 style={{ fontSize: '1.4rem' }}>{lang === 'uz' ? "Mahsulotlarni Taqqoslash" : "Сравнение Товаров"}</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hususiyat</th>
              {compareItems.map(item => (
                <th key={item.id} style={{ padding: '0.75rem', width: '30%' }}>
                  <img src={item.image} alt={item.name[lang]} style={{ width: '70px', height: '70px', objectFit: 'contain', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 700 }}>{item.name[lang]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Narxi</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{formatPrice(item.price)}</td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Kafolat</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '0.75rem' }}>12 Oy Rasmiy</td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Yetkazish</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '0.75rem', color: 'var(--badge-green)', fontWeight: 700 }}>Bepul</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
