import React from 'react';
import { X, Calendar, Clock, BookOpen, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BlogDetailModal({ article, isOpen, onClose }) {
  const { lang } = useLanguage();

  if (!isOpen || !article) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        maxWidth: '700px', width: '100%', background: '#ffffff',
        borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative',
        boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <button onClick={onClose} aria-label="Close modal" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          <BookOpen size={16} />
          <span>GOOD LIFE BLOG</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>{article.title}</h2>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {article.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {article.readTime}</span>
        </div>

        <img src={article.image} alt={article.title} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }} />

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{article.desc}</p>
          
          <p>
            {lang === 'uz'
              ? "Maishiy texnikani to'g'ri tanlash va foydalanish xonadon qulayligi hamda elektr energiyasini tejashda muhim o'rin tutadi. GOOD LIFE mutaxassislari tomonidan taqdim etilgan ushbu tavsiyalar qurilmaning ishlash muddatini sezilarli darajada uzaytiradi."
              : "Правильный выбор и эксплуатация бытовой техники играют важную роль в обеспечении комфорта в доме и экономии электроэнергии. Данные рекомендации экспертов GOOD LIFE значительно продлят срок службы устройства."
            }
          </p>

          <p>
            {lang === 'uz'
              ? "1. Har doim qurilmani texnik passportiga muvofiq rozetkaga ulang.\n2. Kuchlanish o'zgarishlaridan himoyalovchi stabilizatorlardan foydalaning.\n3. Har 6 oyda profilaktik ko'rik va tozalash ishlarini bajaring."
              : "1. Всегда подключайте устройство в соответствии с техническим паспортом.\n2. Используйте стабилизаторы напряжения для защиты от перепадов.\n3. Проводите профилактический осмотр и чистку каждые 6 месяцев."
            }
          </p>
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--primary-blue)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {lang === 'uz' ? "Yopish" : "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  );
}
