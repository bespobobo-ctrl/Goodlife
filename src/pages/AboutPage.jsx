import React from 'react';
import { Award, ShieldCheck, Truck, Headphones, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fff7ed 100%)',
        border: '1px solid var(--border-blue)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '50px', background: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem'
        }}>
          <Sparkles size={16} />
          <span>GOOD LIFE MAISHIY TEXNIKA</span>
        </div>

        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1rem' }}>
          {lang === 'uz' ? "Biz Haqimizda — Uyingiz Qulayligi Uchun" : "О Нас — Для Уюта Вашего Дома"}
        </h1>

        <p style={{ maxWidth: '750px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
          {lang === 'uz'
            ? "GOOD LIFE Maishiy Texnika platformasi — O'zbekistonda uyingiz va oilangiz uchun eng zamonaviy, sifatli va ishonchli elektronika hamda maishiy texnika vositalarini taqdim etuvchi yetakchi do'kondir."
            : "Платформа GOOD LIFE Бытовая Техника — ведущий магазин Узбекистана, предлагающий современную, качественную и надежную бытовую технику и электронику для вашего дома."
          }
        </p>
      </div>

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {[
          { num: '50,000+', label: lang === 'uz' ? 'Mamnun Mijozlar' : 'Довольных Клиентов' },
          { num: '10,000+', label: lang === 'uz' ? 'Asl Mahsulotlar' : 'Оригинальных Товаров' },
          { num: '12 Yil', label: lang === 'uz' ? 'Bozordagi Tajriba' : 'Лет на Рынке' },
          { num: '24/7', label: lang === 'uz' ? 'Mijozlarga Yordam' : 'Поддержка Клиентов' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#ffffff', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)', padding: '2rem 1.5rem', textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-blue)', marginBottom: '0.2rem' }}>{stat.num}</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 4 Key Values Cards */}
      <div>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          {lang === 'uz' ? "Nega Aynan GOOD LIFE?" : "Почему Выбирают GOOD LIFE?"}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: Award, title: lang === 'uz' ? "100% Asl Sifat" : "100% Оригинальное Качество", desc: lang === 'uz' ? "Barcha mahsulotlar ishlab chiqaruvchi rasmiy kafolatiga ega." : "Все товары имеют официальную гарантию производителя." },
            { icon: Truck, title: lang === 'uz' ? "Tezkor Yetkazib Berish" : "Быстрая Доставка", desc: lang === 'uz' ? "Toshkent shahrida 24 soat ichida eshigingizgacha yetkaziladi." : "Доставка до двери в течение 24 часов по Ташкенту." },
            { icon: ShieldCheck, title: lang === 'uz' ? "Servis Kafolati" : "Гарантия Сервиса", desc: lang === 'uz' ? "Rasmiy servis markazlarimiz orqali uzluksiz texnik yordam." : "Непрерывная техническая поддержка в сервисных центрах." },
            { icon: Headphones, title: lang === 'uz' ? "24/7 Qo'llab-quvvatlash" : "Поддержка 24/7", desc: lang === 'uz' ? "Operatorlarimiz har qanday savolingizga javob berishga tayyor." : "Наши операторы готовы ответить на любые ваши вопросы." }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} style={{
                background: '#ffffff', border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)', padding: '2rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: 'var(--primary-blue-light)', color: 'var(--primary-blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>{val.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
