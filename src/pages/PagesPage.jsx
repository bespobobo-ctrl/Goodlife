import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PagesPage() {
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: lang === 'uz' ? "Yetkazib berish xizmati qanday ishlaydi va qancha vaqt oladi?" : "Как работает доставка и сколько времени она занимает?",
      a: lang === 'uz' ? "Toshkent shahri ichida buyurtmalar 24 soat ichida mutlaqo bepul yetkazib beriladi. O'zbekiston viloyatlariga esa Express pochta orqali 1-3 ish kunida yetkaziladi." : "По Ташкенту заказы доставляются бесплатно в течение 24 часов. По областям Узбекистана доставка занимает 1-3 рабочих дня."
    },
    {
      q: lang === 'uz' ? "GOOD LIFE mahsulotlariga rasmiy kafolat beriladimi?" : "Предоставляется ли официальная гарантия на товары GOOD LIFE?",
      a: lang === 'uz' ? "Ha, barcha maishiy texnika va elektronika tovarlarimiz ishlab chiqaruvchilarning 1 yildan 3 yilgacha rasmiy servis kafolatiga ega." : "Да, вся бытовая техника и электроника имеет официальную гарантию производителя от 1 до 3 лет."
    },
    {
      q: lang === 'uz' ? "To'lovlarni qaysi usullarda amalga oshirish mumkin?" : "Какими способами можно произвести оплату?",
      a: lang === 'uz' ? "Siz to'lovni Naqd pul, Payme, Click, Uzum Pay ilovalari orqali yoki mahsulotni qabul qilib olganda to'lashingiz mumkin." : "Вы можете оплатить наличными, через приложения Payme, Click, Uzum Pay или при получении товара."
    },
    {
      q: lang === 'uz' ? "Nuqsonli tovar chiqib qolsa almashtirib beriladimi?" : "Можно ли обменять товар в случае обнаружения дефекта?",
      a: lang === 'uz' ? "Albatta! Qonunchilikka muvofiq, 14 kun ichida nosoz yoki nuqsonli mahsulot ko'rib chiqilib, yangisiga almashtiriladi yoki puli qaytariladi." : "Конечно! В течение 14 дней неисправный товар подлежит обмену на новый или возврату средств."
    }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.35rem 0.9rem', borderRadius: '50px', background: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem'
        }}>
          <HelpCircle size={16} />
          <span>FAQ & XIZMATLAR</span>
        </div>
        
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          {lang === 'uz' ? "Ko'p Beriladigan Savollar va Shartlar" : "Часто Задаваемые Вопросы и Условия"}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lang === 'uz' ? "Xarid jarayoni, kafolat va yetkazish haqidagi barcha ma'lumotlar" : "Вся информация о покупках, гарантии и доставке"}
        </p>
      </div>

      {/* Accordion List */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={index}
              style={{
                background: '#ffffff',
                border: isOpen ? '1px solid var(--primary-blue)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease'
              }}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: isOpen ? 'var(--primary-blue)' : 'var(--text-dark)'
                }}
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={20} color="var(--primary-blue)" /> : <ChevronDown size={20} />}
              </button>

              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
