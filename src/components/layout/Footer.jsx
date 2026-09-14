import React from 'react';
import { Phone, Mail, MapPin, Globe, Share2, Send, MessageCircle } from 'lucide-react';
import GoodLifeLogo from '../common/GoodLifeLogo';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ setActivePage }) {
  const { lang, t } = useLanguage();

  const handleNav = (pageId) => {
    if (setActivePage) setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Brand Info & Mobile Apps */}
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNav('home'); }} style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              <GoodLifeLogo
                size={40}
                showText={true}
                subtitle={lang === 'uz' ? "MAISHIY TEXNIKA" : "БЫТОВАЯ ТЕХНИКА"}
              />
            </a>

            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {lang === 'uz'
                ? "GoodLife Maishiy Texnika — Uyingiz uchun eng zamonaviy va sifatli maishiy texnika va elektronika jihozlarining rasmiy do'koni."
                : "GoodLife Бытовая Техника — Официальный магазин современной бытовой техники и электроники для вашего дома."
              }
            </p>

            {/* App Store & Google Play Badges */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.65rem', display: 'block', color: '#94a3b8' }}>Download on</span>
                <strong style={{ fontSize: '0.8rem', color: '#fff' }}>App Store</strong>
              </div>
              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.65rem', display: 'block', color: '#94a3b8' }}>GET IT ON</span>
                <strong style={{ fontSize: '0.8rem', color: '#fff' }}>Google Play</strong>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4>{t.quickLinks}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('about'); }}>{t.about}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>{t.shop}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('blog'); }}>{t.blog}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>{t.contact}</a></li>
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h4>{t.privacyPolicy}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('pages'); }}>Terms & Conditions</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('pages'); }}>Shipping Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('pages'); }}>Return Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('pages'); }}>FAQ</a></li>
            </ul>
          </div>

          {/* Top Collection */}
          <div>
            <h4>{t.topCollection}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>Muzlatgichlar</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>Kir yuvish mashinalari</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>Smartfonlar</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>Kofe aparatlar</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4>{t.contactUs}</h4>
            <ul style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <MapPin size={16} color="var(--primary-orange)" />
                <span>Toshkent sh., Yunusobod t., 14-mavze</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <Phone size={16} color="var(--primary-orange)" />
                <span>+998 71 200 00 00</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <Mail size={16} color="var(--primary-orange)" />
                <span>info@goodlife.uz</span>
              </li>
            </ul>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <a href="#" style={{ background: '#1e293b', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Globe size={16} /></a>
              <a href="#" style={{ background: '#1e293b', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Send size={16} /></a>
              <a href="#" style={{ background: '#1e293b', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Share2 size={16} /></a>
              <a href="#" style={{ background: '#1e293b', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><MessageCircle size={16} /></a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          <p>© 2026 GOOD LIFE Maishiy Texnika & Elektronika. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
