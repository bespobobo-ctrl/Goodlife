import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import BlogDetailModal from '../components/common/BlogDetailModal';
import { useLanguage } from '../context/LanguageContext';

export default function BlogPage() {
  const { lang } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: lang === 'uz' ? "Muzlatgichni to'g'ri tanlash va undan foydalanish sirlari" : "Секреты выбора и использования холодильника",
      desc: lang === 'uz' ? "Inverter kompressorli va No-Frost tizimidagi muzlatgichlarning asosiy afzalliklari." : "Преимущества холодильников с инверторным компрессором и системой No-Frost.",
      date: '10 Sentabr 2026',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&q=80'
    },
    {
      id: 2,
      title: lang === 'uz' ? "2026-yilda eng zo'r smartfonni qanday tanlash kerak?" : "Как выбрать лучший смартфон в 2026 году?",
      desc: lang === 'uz' ? "Kamera, protsessor va akkumulyator sig'imiga qarab eng maqbul modelni tanlash yo'riqnomasi." : "Руководство по выбору оптимальной модели исходя из камеры, процессора и аккумулятора.",
      date: '08 Sentabr 2026',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'
    },
    {
      id: 3,
      title: lang === 'uz' ? "Kir yuvish mashinasining ishlash muddatini uzaytirish" : "Продление срока службы стиральной машины",
      desc: lang === 'uz' ? "Suv qattiqligi va kir yuvish kukuni me'yorini to'g'ri belgilash bo'yicha amaliy maslahatlar." : "Практические советы по жесткости воды и дозировке стирального порошка.",
      date: '05 Sentabr 2026',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80'
    }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.35rem 0.9rem', borderRadius: '50px', background: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem'
        }}>
          <BookOpen size={16} />
          <span>GOOD LIFE BLOG & MAQOLALAR</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          {lang === 'uz' ? "Maishiy Texnika va Texnologiyalar Blogi" : "Блог о Бытовой Технике и Технологиях"}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lang === 'uz' ? "Mutaxassislardan eng foydali maslahatlar va yo'riqnomalar" : "Полезные советы и руководства от экспертов"}
        </p>
      </div>

      {/* Articles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
        {articles.map((art) => (
          <div key={art.id} style={{
            background: '#ffffff', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)', overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column'
          }}>
            <img src={art.image} alt={art.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {art.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {art.readTime}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', lineHeight: 1.3 }}>{art.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, flex: 1 }}>{art.desc}</p>

              <button
                onClick={() => setSelectedArticle(art)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--primary-blue)',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', padding: 0
                }}
              >
                <span>{lang === 'uz' ? "Batafsil O'qish" : "Читать Далее"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Modal */}
      <BlogDetailModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
