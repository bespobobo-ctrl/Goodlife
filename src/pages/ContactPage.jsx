import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.35rem 0.9rem', borderRadius: '50px', background: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem'
        }}>
          <Phone size={16} />
          <span>ALOQA & BOG'LANISH</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          {lang === 'uz' ? "Biz Bilan Bog'laning" : "Свяжитесь с Нами"}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lang === 'uz' ? "Savollaringiz bormi? Operatorlarimiz sizga yordam berishga tayyor!" : "Есть вопросы? Наши операторы готовы вам помочь!"}
        </p>
      </div>

      {/* Grid: Contact Cards + Contact Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        
        {/* Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>{lang === 'uz' ? "Manzilimiz:" : "Адрес:"}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Toshkent sh., Yunusobod t., 14-mavze</p>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-orange-light)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>{lang === 'uz' ? "Telefon:" : "Телефон:"}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>+998 71 200 00 00</p>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>Email:</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>info@goodlife.uz</p>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-orange-light)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>{lang === 'uz' ? "Ish vaqti:" : "Режим работы:"}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Har kuni: 09:00 - 21:00</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            {lang === 'uz' ? "Xabar Yuborish" : "Отправить Сообщение"}
          </h3>

          {submitted ? (
            <div style={{ background: 'var(--primary-blue-light)', border: '1px solid var(--primary-blue)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', color: 'var(--primary-blue)' }}>
              <Sparkles size={36} style={{ marginBottom: '0.75rem' }} />
              <h3>{lang === 'uz' ? "Xabaringiz Qabul Qilindi!" : "Ваше Сообщение Принято!"}</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {lang === 'uz' ? "Tez orada operatorlarimiz siz bilan bog'lanishadi." : "Наши операторы свяжутся с вами в ближайшее время."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {lang === 'uz' ? "Ismingiz *" : "Ваше Имя *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Ali Valiyev"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {lang === 'uz' ? "Telefon Raqamingiz *" : "Номер Телефона *"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ali@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  {lang === 'uz' ? "Xabar Matni *" : "Текст Сообщения *"}
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder={lang === 'uz' ? "Savolingiz yoki fikringizni yozing..." : "Напишите ваш вопрос..."}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                style={{
                  background: 'var(--primary-blue)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(29, 78, 216, 0.3)'
                }}
              >
                <Send size={18} />
                <span>{lang === 'uz' ? "Xabarni Yuborish" : "Отправить"}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
