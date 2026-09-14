import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Truck, CreditCard, 
  MapPin, User, Phone, FileText, Navigation, Crosshair, Map, ExternalLink, 
  RefreshCw, AlertCircle, Compass 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { StorageService } from '../../services/storageService';

// Fallback regional center coordinates
const REGION_COORDS = {
  fergana: { lat: 40.3842, lng: 71.7843, name: "Farg'ona viloyati" },
  andijan: { lat: 40.7821, lng: 72.3442, name: "Andijon viloyati" },
  namangan: { lat: 40.9983, lng: 71.6726, name: "Namangan viloyati" },
  tashkent_city: { lat: 41.2995, lng: 69.2401, name: "Toshkent shahri" },
  tashkent_reg: { lat: 41.3500, lng: 69.4500, name: "Toshkent viloyati" },
  samarkand: { lat: 39.6542, lng: 66.9597, name: "Samarqand viloyati" },
  bukhara: { lat: 39.7747, lng: 64.4286, name: "Buxoro viloyati" },
  kashkadarya: { lat: 38.8606, lng: 65.7891, name: "Qashqadaryo viloyati" },
  surkhandarya: { lat: 37.2242, lng: 67.2783, name: "Surxondaryo viloyati" },
  jizzakh: { lat: 40.1158, lng: 67.8422, name: "Jizzax viloyati" },
  sirdaryo: { lat: 40.4897, lng: 68.7842, name: "Sirdaryo viloyati" },
  navoiy: { lat: 40.0844, lng: 65.3792, name: "Navoiy viloyati" },
  khorezm: { lat: 41.5562, lng: 60.6310, name: "Xorazm viloyati" },
  karakalpakstan: { lat: 42.4602, lng: 59.6166, name: "Qoraqalpog'iston Respub." }
};

export default function CartDrawer() {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  // Checkout Step State: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState('cart');
  const [lastOrder, setLastOrder] = useState(null);

  // Delivery settings from StorageService
  const [deliverySettings, setDeliverySettings] = useState(() => StorageService.getDeliverySettings());
  const [selectedRegionId, setSelectedRegionId] = useState('tashkent_city');

  // Order form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'click' | 'payme' | 'uzum'
  const [formError, setFormError] = useState('');

  // Location / GPS states
  const [coordinates, setCoordinates] = useState(null); // { lat, lng }
  const [isLocating, setIsLocating] = useState(false);
  const [locSuccess, setLocSuccess] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tempMapCoords, setTempMapCoords] = useState(null);

  // Auto-fill location if user previously selected in header
  useEffect(() => {
    try {
      const savedLoc = localStorage.getItem('goodlife_user_location');
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc);
        if (parsed.lat && parsed.lng) {
          setCoordinates({ lat: parsed.lat, lng: parsed.lng });
          if (parsed.detail) setCustomerAddress(parsed.detail);
          matchRegionFromLocation(parsed.region || parsed.city);
          setLocSuccess(parsed.detail || `${parsed.city}, ${parsed.region}`);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      setStep('cart');
      setFormError('');
      setIsMapModalOpen(false);
    }
  }, [isCartOpen]);

  useEffect(() => {
    const handleDelSync = () => {
      setDeliverySettings(StorageService.getDeliverySettings());
    };
    window.addEventListener('goodlife_delivery_updated', handleDelSync);
    return () => window.removeEventListener('goodlife_delivery_updated', handleDelSync);
  }, []);

  if (!isCartOpen) return null;

  const currentRegion = (deliverySettings?.regions || []).find(r => r.id === selectedRegionId) || {
    name: "Toshkent shahri",
    price: 25000,
    time: "1 ish kuni"
  };

  // Check if free delivery applies
  const isFreeDelivery = deliverySettings?.freeDeliveryThreshold && (totalPrice * (12900)) >= deliverySettings.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : (currentRegion?.price ? Math.round(currentRegion.price / 12900) : 2);
  const finalTotal = totalPrice + deliveryFee;

  // Match region in deliverySettings based on text (reverse geocode)
  const matchRegionFromLocation = (text) => {
    if (!text) return;
    const lower = text.toLowerCase();
    const regions = deliverySettings?.regions || [];

    const map = [
      { key: "farg'ona", id: "fergana" },
      { key: "qo'qon", id: "fergana" },
      { key: "andijon", id: "andijan" },
      { key: "namangan", id: "namangan" },
      { key: "toshkent sh", id: "tashkent_city" },
      { key: "toshkent vil", id: "tashkent_reg" },
      { key: "tashkent", id: "tashkent_city" },
      { key: "samarqand", id: "samarkand" },
      { key: "buxoro", id: "bukhara" },
      { key: "qashqadaryo", id: "kashkadarya" },
      { key: "qarshi", id: "kashkadarya" },
      { key: "surxondaryo", id: "surkhandarya" },
      { key: "termiz", id: "surkhandarya" },
      { key: "jizzax", id: "jizzakh" },
      { key: "sirdaryo", id: "sirdaryo" },
      { key: "guliston", id: "sirdaryo" },
      { key: "navoiy", id: "navoiy" },
      { key: "xorazm", id: "khorezm" },
      { key: "urganch", id: "khorezm" },
      { key: "qoraqalpog", id: "karakalpakstan" },
      { key: "nukus", id: "karakalpakstan" }
    ];

    for (const item of map) {
      if (lower.includes(item.key)) {
        const found = regions.find(r => r.id === item.id);
        if (found) {
          setSelectedRegionId(found.id);
          return;
        }
      }
    }
  };

  // Reverse Geocode using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'uz,ru,en' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        
        const street = addr.road || addr.residential || addr.suburb || addr.neighbourhood || '';
        const house = addr.house_number ? ` ${addr.house_number}-uy` : '';
        const district = addr.city_district || addr.county || addr.town || addr.suburb || '';
        const city = addr.city || addr.town || addr.county || "Shahar";
        const state = addr.state || addr.region || '';
        
        let formatted = '';
        if (city) formatted += `${city}, `;
        if (district) formatted += `${district}, `;
        if (street) formatted += `${street}${house}`;

        if (!formatted.trim()) {
          formatted = data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : `Koordinata: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        return {
          formatted: formatted.replace(/,\s*$/, ''),
          city,
          state,
          full: data.display_name
        };
      }
    } catch (e) {
      console.warn("Reverse geocoding error:", e);
    }
    return null;
  };

  // Detect location via device GPS
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert(lang === 'uz' ? "Qurilmangizda GPS qo'llab-quvvatlanmaydi." : "Геолокация не поддерживается вашим устройством.");
      return;
    }

    setIsLocating(true);
    setLocSuccess('');
    setFormError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });

        const geo = await reverseGeocode(lat, lng);
        if (geo) {
          setCustomerAddress(geo.formatted);
          matchRegionFromLocation(geo.state || geo.city || geo.full);
          setLocSuccess(geo.formatted);
        } else {
          const fallbackAddr = `GPS Koordinata: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setCustomerAddress(fallbackAddr);
          setLocSuccess(fallbackAddr);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS error:", err);
        setFormError(
          lang === 'uz' 
            ? "Lokatsiyani aniqlashga ruxsat berilmadi yoki xatolik yuz berdi. Iltimos, manzilni yozing yoki xaritadan tanlang." 
            : "Не удалось определить местоположение. Пожалуйста, введите адрес вручную или выберите на карте."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Open interactive map picker modal
  const handleOpenMapPicker = () => {
    const initialCoords = coordinates || REGION_COORDS[selectedRegionId] || { lat: 41.2995, lng: 69.2401 };
    setTempMapCoords({ ...initialCoords });
    setIsMapModalOpen(true);
  };

  // Confirm map location
  const handleConfirmMapLocation = async () => {
    if (!tempMapCoords) return;
    setCoordinates(tempMapCoords);
    setIsLocating(true);
    const geo = await reverseGeocode(tempMapCoords.lat, tempMapCoords.lng);
    if (geo) {
      setCustomerAddress(geo.formatted);
      matchRegionFromLocation(geo.state || geo.city || geo.full);
      setLocSuccess(geo.formatted);
    } else {
      const fallbackAddr = `Xarita lokatsiyasi: ${tempMapCoords.lat.toFixed(5)}, ${tempMapCoords.lng.toFixed(5)}`;
      setCustomerAddress(fallbackAddr);
      setLocSuccess(fallbackAddr);
    }
    setIsLocating(false);
    setIsMapModalOpen(false);
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setStep('checkout');
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError(lang === 'uz' ? "Iltimos, ismingizni kiriting!" : "Пожалуйста, введите имя!");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError(lang === 'uz' ? "Iltimos, telefon raqamingizni to'liq kiriting!" : "Пожалуйста, введите номер телефона!");
      return;
    }
    if (!customerAddress.trim()) {
      setFormError(lang === 'uz' ? "Iltimos, yetkazib berish manzilini kiriting yoki lokatsiyani belgilang!" : "Пожалуйста, укажите адрес доставки!");
      return;
    }

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

    const newOrder = {
      id: orderId,
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      region: currentRegion.name,
      address: customerAddress.trim(),
      locationCoords: coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : null,
      mapsUrl: coordinates ? `https://yandex.com/maps/?pt=${coordinates.lng},${coordinates.lat}&z=17&l=map` : null,
      googleMapsUrl: coordinates ? `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}` : null,
      note: customerNote.trim(),
      items: cart.map(i => `${typeof i.name === 'object' ? i.name[lang] || i.name.uz : i.name} (${i.quantity || 1})`).join(', '),
      rawItems: cart.map(i => ({
        id: i.id,
        name: i.name,
        qty: i.quantity || 1,
        price: i.price,
        image: i.image
      })),
      subtotal: totalPrice,
      deliveryFee: deliveryFee,
      total: finalTotal,
      date: dateStr,
      status: 'Yangi',
      payment: paymentMethod === 'cash' ? 'Naqd pul' : paymentMethod === 'click' ? 'Click' : paymentMethod === 'payme' ? 'Payme' : 'Uzum Bank',
      channel: 'Web App'
    };

    // Save to unified storage
    StorageService.addOnlineOrder(newOrder);
    StorageService.decrementStock(cart);

    // Trigger confetti
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (_) {}

    setLastOrder(newOrder);
    clearCart();
    setStep('success');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--bg-card)',
        color: 'var(--text-dark)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 35px rgba(0,0,0,0.2)',
        animation: 'slideLeft 0.3s ease'
      }}>
        {/* Cart Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag color="var(--primary-blue)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              {step === 'cart' && `${t.shoppingCart} (${cart.length})`}
              {step === 'checkout' && (lang === 'uz' ? "Buyurtmani rasmiylashtirish" : "Оформление заказа")}
              {step === 'success' && (lang === 'uz' ? "Buyurtma qabul qilindi!" : "Заказ принят!")}
            </h3>
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* ================= STEP 1: CART ITEMS LIST ================= */}
        {step === 'cart' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={54} style={{ marginBottom: '1rem', opacity: 0.25 }} />
                  <p style={{ fontWeight: 600 }}>{t.emptyCart}</p>
                </div>
              ) : (
                cart.map((item) => {
                  const nameStr = typeof item.name === 'object' ? item.name[lang] || item.name.uz : item.name;
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                      <img src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80'} alt={nameStr} style={{ width: '64px', height: '64px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', padding: '4px' }} />
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>{nameStr}</h4>
                        <div style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '0.95rem' }}>{formatPrice(item.price * item.quantity)}</div>
                        
                        {/* Quantity Controller */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>-</button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>+</button>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} title="O'chirish" style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '6px' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer Total & Checkout */}
            {cart.length > 0 && (
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>
                  <span>{t.totalPrice}</span>
                  <span style={{ color: 'var(--primary-blue)' }}>{formatPrice(totalPrice)}</span>
                </div>

                <button
                  onClick={handleStartCheckout}
                  style={{
                    width: '100%',
                    background: 'var(--primary-blue)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.95rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span>{lang === 'uz' ? "Buyurtma berish" : "Оформить заказ"}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ================= STEP 2: CHECKOUT FORM WITH LOCATION ================= */}
        {step === 'checkout' && (
          <form onSubmit={handleConfirmOrder} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {formError && (
                <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', color: '#ef4444', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #fecaca' }}>
                  {formError}
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <User size={15} />
                  <span>{lang === 'uz' ? "Ism va Familiyangiz" : "Ваше имя"} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'uz' ? "Masalan: Jasur Mavlonov" : "Например: Жасур Мавлонов"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outlineColor: 'var(--primary-blue)' }}
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <Phone size={15} />
                  <span>{lang === 'uz' ? "Telefon raqamingiz" : "Номер телефона"} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outlineColor: 'var(--primary-blue)' }}
                />
              </div>

              {/* Region Selection */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <Truck size={15} />
                  <span>{lang === 'uz' ? "Yetkazib berish hududi" : "Регион доставки"} *</span>
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, background: '#fff', outlineColor: 'var(--primary-blue)' }}
                >
                  {(deliverySettings?.regions || []).filter(r => r.active !== false).map(reg => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} — {reg.price ? `${reg.price.toLocaleString()} so'm` : "Bepul"} ({reg.time})
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION PICKER INTEGRATION (GPS + MAP) */}
              <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '0.9rem', border: '1.5px dashed #93c5fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Compass size={16} />
                    <span>{lang === 'uz' ? "Tezkor Lokatsiyani belgilash" : "Быстрое определение локации"}</span>
                  </span>
                  {coordinates && (
                    <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      ✓ Koordinata saqlandi
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.65rem 0' }}>
                  {lang === 'uz' 
                    ? "Manzilni qo'lda kiritish o'rniga GPS orqali avtomatik aniqlang yoki xaritada nuqtani tanlang." 
                    : "Определите местоположение автоматически через GPS или выберите точку на карте."}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {/* GPS Auto Detect Button */}
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    style={{
                      padding: '0.65rem 0.6rem',
                      borderRadius: '10px',
                      border: '1px solid #bfdbfe',
                      background: '#fff',
                      color: '#1d4ed8',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: isLocating ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 5px rgba(37,99,235,0.08)'
                    }}
                  >
                    {isLocating ? <RefreshCw size={14} className="animate-spin" /> : <Crosshair size={14} />}
                    <span>{isLocating ? (lang === 'uz' ? "Aniqlanmoqda..." : "Поиск...") : (lang === 'uz' ? "GPS orqali aniqlash" : "Мое местоположение")}</span>
                  </button>

                  {/* Open Map Picker Button */}
                  <button
                    type="button"
                    onClick={handleOpenMapPicker}
                    style={{
                      padding: '0.65rem 0.6rem',
                      borderRadius: '10px',
                      border: '1px solid #bfdbfe',
                      background: '#fff',
                      color: '#1d4ed8',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 5px rgba(37,99,235,0.08)'
                    }}
                  >
                    <Map size={14} />
                    <span>{lang === 'uz' ? "Xaritadan tanlash" : "Выбрать на карте"}</span>
                  </button>
                </div>

                {/* Location Success Feedback */}
                {locSuccess && (
                  <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.75rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {locSuccess}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed Address Input */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <MapPin size={15} />
                  <span>{lang === 'uz' ? "Aniq manzil (shahar, tuman, ko'cha, uy, xonadon)" : "Точный адрес"} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'uz' ? "Chilonzor tumani, 9-mavze, 14-uy (yoki yuqoridagi GPS tugmasini bosing)" : "ул. Амира Темура, д. 12"}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outlineColor: 'var(--primary-blue)' }}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.45rem' }}>
                  <CreditCard size={15} />
                  <span>{lang === 'uz' ? "To'lov turi" : "Способ оплаты"} *</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'cash', label: lang === 'uz' ? "💵 Naqd pul (kuryerga)" : "💵 Наличные" },
                    { id: 'click', label: "🟢 Click" },
                    { id: 'payme', label: "🔵 Payme" },
                    { id: 'uzum', label: "🟣 Uzum Bank" }
                  ].map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '10px',
                        border: paymentMethod === p.id ? '2px solid var(--primary-blue)' : '1px solid #cbd5e1',
                        background: paymentMethod === p.id ? '#eff6ff' : '#fff',
                        color: paymentMethod === p.id ? 'var(--primary-blue)' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <FileText size={15} />
                  <span>{lang === 'uz' ? "Buyurtma uchun izoh (ixtiyoriy)" : "Примечание (необязательно)"}</span>
                </label>
                <input
                  type="text"
                  placeholder={lang === 'uz' ? "Masalan: Mo'ljal - Maktab yonida, kuryer qo'ng'iroq qilsin" : "Ориентир, пожелания"}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Order Summary Box */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
                  <span>{lang === 'uz' ? "Mahsulotlar summasi:" : "Сумма товаров:"}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.6rem' }}>
                  <span>{lang === 'uz' ? "Yetkazib berish (Dastavka):" : "Доставка:"}</span>
                  <span style={{ fontWeight: 700, color: isFreeDelivery ? '#10b981' : '#1e293b' }}>
                    {isFreeDelivery ? (lang === 'uz' ? "Bepul 🎉" : "Бесплатно") : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                  <span>{lang === 'uz' ? "Jami to'lov:" : "Итого к оплате:"}</span>
                  <span style={{ color: 'var(--primary-blue)' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', background: '#fff', display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep('cart')}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {lang === 'uz' ? "Ortga" : "Назад"}
              </button>

              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={18} />
                <span>{lang === 'uz' ? "Buyurtmani Tasdiqlash" : "Подтвердить заказ"}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: SUCCESS CONFIRMATION ================= */}
        {step === 'success' && lastOrder && (
          <div style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
              {lang === 'uz' ? "Rahmat! Buyurtmangiz qabul qilindi!" : "Спасибо! Ваш заказ принят!"}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '340px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {lang === 'uz' 
                ? "Tez orada operatorimiz siz bilan bog'lanadi va yetkazib berish jarayoni boshlanadi." 
                : "Наш оператор скоро свяжется с вами для подтверждения заказа."}
            </p>

            <div style={{ width: '100%', background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Buyurtma raqami:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>{lastOrder.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Mijoz:</span>
                <span style={{ fontWeight: 700 }}>{lastOrder.customer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Hudud:</span>
                <span style={{ fontWeight: 700 }}>{lastOrder.region}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Manzil:</span>
                <span style={{ fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{lastOrder.address}</span>
              </div>
              {lastOrder.mapsUrl && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1' }}>
                  <a 
                    href={lastOrder.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <MapPin size={13} />
                    <span>Xaritada ochish (Yandex Maps)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 900, color: '#10b981', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Jami summa:</span>
                <span>{formatPrice(lastOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={closeCart}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                background: 'var(--primary-blue)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
              }}
            >
              {lang === 'uz' ? "Xaridni davom ettirish" : "Продолжить покупки"}
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: INTERACTIVE MAP PICKER ================= */}
      {isMapModalOpen && tempMapCoords && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Map Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={18} color="var(--primary-blue)" />
                  <span>{lang === 'uz' ? "Xaritadan yetkazish nuqtasini tanlang" : "Выберите точку доставки на карте"}</span>
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {lang === 'uz' ? "Hududni tanlang yoki xaritaning markazidagi belgi orqali ko'rsating" : "Перемещайте карту для выбора нужного адреса"}
                </p>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Region Switcher Buttons */}
            <div style={{ padding: '0.65rem 1rem', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {Object.entries(REGION_COORDS).slice(0, 7).map(([id, reg]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTempMapCoords({ lat: reg.lat, lng: reg.lng })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    background: tempMapCoords.lat === reg.lat ? 'var(--primary-blue)' : '#f8fafc',
                    color: tempMapCoords.lat === reg.lat ? '#fff' : '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {reg.name.replace(' viloyati', '').replace(' shahri', '')}
                </button>
              ))}
            </div>

            {/* Embedded Map with interactive pin */}
            <div style={{ position: 'relative', width: '100%', height: '320px', background: '#e2e8f0' }}>
              <iframe
                title="Xarita"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${tempMapCoords.lng - 0.015}%2C${tempMapCoords.lat - 0.009}%2C${tempMapCoords.lng + 0.015}%2C${tempMapCoords.lat + 0.009}&layer=mapnik&marker=${tempMapCoords.lat}%2C${tempMapCoords.lng}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />

              {/* Pin Overlay in center */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ background: '#2563eb', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  📍 Tanlangan nuqta
                </div>
                <div style={{ width: '2px', height: '10px', background: '#2563eb' }}></div>
              </div>

              {/* Pan Controller Buttons */}
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  title="GPS"
                  onClick={handleDetectGPS}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}
                >
                  <Crosshair size={18} />
                </button>
              </div>
            </div>

            {/* Coordinates Display & Confirmation Footer */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Tanlangan koordinatalar:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                  {tempMapCoords.lat.toFixed(5)}, {tempMapCoords.lng.toFixed(5)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmMapLocation}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'uz' ? "Shu nuqtani tasdiqlash" : "Выбрать эту точку"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
