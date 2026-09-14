import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Crosshair, 
  Search, 
  Check, 
  Navigation, 
  Clock, 
  Truck, 
  X, 
  AlertCircle, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import './LocationPicker.css';
import { StorageService, DEFAULT_DELIVERY_SETTINGS } from '../../services/storageService';

// Bosh do'kon koordinatalari (Qo'qon markaz)
const HQ_COORDS = { lat: 40.5286, lng: 70.9425, name: "GoodLife Qo'qon Markaziy Filiali" };

// O'zbekiston viloyat va yirik shahar markazlari (24 ta asosiy shahar/tuman)
const UZ_REGIONS = [
  { id: 'qoqon', city: "Qo'qon", region: "Farg'ona viloyati", lat: 40.5286, lng: 70.9425, popular: true },
  { id: 'fergana', city: "Farg'ona", region: "Farg'ona viloyati", lat: 40.3842, lng: 71.7843, popular: true },
  { id: 'margilan', city: "Marg'ilon", region: "Farg'ona viloyati", lat: 40.4722, lng: 71.7147, popular: true },
  { id: 'andijan', city: "Andijon", region: "Andijon viloyati", lat: 40.7821, lng: 72.3442, popular: true },
  { id: 'asaka', city: "Asaka", region: "Andijon viloyati", lat: 40.6415, lng: 72.2389, popular: false },
  { id: 'namangan', city: "Namangan", region: "Namangan viloyati", lat: 40.9983, lng: 71.6726, popular: true },
  { id: 'chust', city: "Chust", region: "Namangan viloyati", lat: 41.0074, lng: 71.2292, popular: false },
  { id: 'tashkent', city: "Toshkent shahri", region: "Toshkent shahri", lat: 41.2995, lng: 69.2401, popular: true },
  { id: 'chirchiq', city: "Chirchiq", region: "Toshkent viloyati", lat: 41.4689, lng: 69.5822, popular: false },
  { id: 'angren', city: "Angren", region: "Toshkent viloyati", lat: 41.0167, lng: 70.1436, popular: false },
  { id: 'samarkand', city: "Samarqand", region: "Samarqand viloyati", lat: 39.6542, lng: 66.9597, popular: true },
  { id: 'bukhara', city: "Buxoro", region: "Buxoro viloyati", lat: 39.7747, lng: 64.4286, popular: true },
  { id: 'navoiy', city: "Navoiy", region: "Navoiy viloyati", lat: 40.0844, lng: 65.3792, popular: false },
  { id: 'qarshi', city: "Qarshi", region: "Qashqadaryo viloyati", lat: 38.8606, lng: 65.7891, popular: true },
  { id: 'shahrisabz', city: "Shahrisabz", region: "Qashqadaryo viloyati", lat: 39.0578, lng: 66.8300, popular: false },
  { id: 'termez', city: "Termiz", region: "Surxondaryo viloyati", lat: 37.2242, lng: 67.2783, popular: false },
  { id: 'jizzakh', city: "Jizzax", region: "Jizzax viloyati", lat: 40.1158, lng: 67.8422, popular: false },
  { id: 'guliston', city: "Guliston", region: "Sirdaryo viloyati", lat: 40.4897, lng: 68.7842, popular: false },
  { id: 'urgench', city: "Urganch", region: "Xorazm viloyati", lat: 41.5562, lng: 60.6310, popular: true },
  { id: 'xiva', city: "Xiva", region: "Xorazm viloyati", lat: 41.3783, lng: 60.3639, popular: false },
  { id: 'nukus', city: "Nukus", region: "Qoraqalpog'iston Respub.", lat: 42.4602, lng: 59.6166, popular: true }
];

// Haversine formulasi orqali 2 nuqta orasidagi masofani hisoblash (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Yer radiusi km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Masofaga qarab yetkazib berish narxi va vaqtini baholash
const getDeliveryDetails = (distanceKm) => {
  if (distanceKm <= 5) {
    return { time: "25-35 daqiqa", cost: "Bepul", rawCost: 0, tag: "Tezkor shahar ichi" };
  } else if (distanceKm <= 20) {
    return { time: "40-60 daqiqa", cost: "12,000 so'm", rawCost: 12000, tag: "Shahar atrofi" };
  } else if (distanceKm <= 80) {
    return { time: "1-2 soat", cost: "25,000 so'm", rawCost: 25000, tag: "Viloyat bo'ylab" };
  } else {
    return { time: "1 ish kuni", cost: "35,000 so'm", rawCost: 35000, tag: "Respublika bo'ylab pochta" };
  }
};

const LocationPicker = ({ onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Admin tomonidan kiritilgan Dastavka Sozlamalari
  const [deliverySettings, setDeliverySettings] = useState(() => {
    try {
      return StorageService.getDeliverySettings();
    } catch {
      return DEFAULT_DELIVERY_SETTINGS;
    }
  });

  // Sozlamalar o'zgarganda real vaqtda ushlash
  useEffect(() => {
    const handleDeliveryUpdate = (e) => {
      setDeliverySettings(e.detail || DEFAULT_DELIVERY_SETTINGS);
    };
    window.addEventListener('goodlife_delivery_updated', handleDeliveryUpdate);
    return () => window.removeEventListener('goodlife_delivery_updated', handleDeliveryUpdate);
  }, []);

  // Dinamik yetkazib berish narxini hisoblash
  const getDynamicDeliveryDetails = (distanceKm, regionName) => {
    // 1. Agar Qo'qon shahar markazi bo'lsa (Masalan masofa < 8 km)
    if (distanceKm <= 8) {
      return { 
        time: deliverySettings.localQoqonTime || "25-35 daqiqa", 
        cost: deliverySettings.localQoqonPrice === 0 ? "Bepul" : `${deliverySettings.localQoqonPrice.toLocaleString()} so'm`, 
        rawCost: deliverySettings.localQoqonPrice || 0, 
        tag: "Qo'qon shahar ichi" 
      };
    }

    // 2. Viloyatni aniqlash va mos narxni olish
    const regionIdMap = {
      "Farg'ona": "fergana", "Andijon": "andijan", "Namangan": "namangan",
      "Toshkent shahri": "tashkent_city", "Toshkent viloyati": "tashkent_reg",
      "Samarqand": "samarkand", "Buxoro": "bukhara", "Qashqadaryo": "kashkadarya",
      "Surxondaryo": "surkhandarya", "Jizzax": "jizzakh", "Sirdaryo": "sirdaryo",
      "Navoiy": "navoiy", "Xorazm": "khorezm", "Qoraqalpog": "karakalpakstan"
    };

    let matchedRegionId = "tashkent_city"; // Default
    if (regionName) {
      for (const [key, id] of Object.entries(regionIdMap)) {
        if (regionName.toLowerCase().includes(key.toLowerCase())) {
          matchedRegionId = id;
          break;
        }
      }
    }

    const regConfig = deliverySettings.regions?.find(r => r.id === matchedRegionId);
    
    if (regConfig) {
      return { 
        time: regConfig.time, 
        cost: regConfig.price === 0 ? "Bepul" : `${regConfig.price.toLocaleString()} so'm`, 
        rawCost: regConfig.price, 
        tag: regConfig.name 
      };
    }

    // Default fallback
    return { time: "1 ish kuni", cost: "25,000 so'm", rawCost: 25000, tag: "O'zbekiston bo'ylab" };
  };

  // Tanlangan joriy manzil
  const [currentLoc, setCurrentLoc] = useState(() => {
    try {
      const saved = localStorage.getItem('goodlife_user_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      city: "Qo'qon shahri",
      region: "Farg'ona viloyati",
      detail: "Markaziy hudud",
      lat: HQ_COORDS.lat,
      lng: HQ_COORDS.lng,
      distanceKm: 0,
      source: 'default'
    };
  });

  // LocalStorage va ota-komponentga sinxronlash
  const applyLocation = (loc) => {
    setCurrentLoc(loc);
    try {
      localStorage.setItem('goodlife_user_location', JSON.stringify(loc));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    if (onLocationChange) {
      onLocationChange(loc);
    }
  };

  // OpenStreetMap Nominatim orqali Reverse Geocoding
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
        const house = addr.house_number ? ` ${addr.house_number}` : '';
        const city = addr.city || addr.town || addr.county || addr.state_district || "Noma'lum shahar";
        const region = addr.state || addr.region || "O'zbekiston";
        
        const detail = street ? `${street}${house}` : (data.display_name ? data.display_name.split(',')[0] : "Aniq koordinata");

        return {
          city,
          region,
          detail: detail || "Hozirgi turgan joy",
          fullAddress: data.display_name
        };
      }
    } catch (err) {
      console.warn("Geocoding xatosi:", err);
    }
    return null;
  };

  // 1-USUL: Haqiqiy GPS orqali yuqori aniqlikda aniqlash
  const detectPreciseLocation = async () => {
    setDetectingGps(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("GPS aniqlab bo'lmadi. IP orqali qidirilmoqda...");
      await detectByIpFallback();
      setDetectingGps(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 0);

        const geoData = await reverseGeocode(lat, lng);
        const distance = calculateDistance(HQ_COORDS.lat, HQ_COORDS.lng, lat, lng);

        const newLoc = {
          city: geoData?.city || "Mening manzilim",
          region: geoData?.region || "O'zbekiston",
          detail: geoData?.detail ? `${geoData.detail} (±${accuracy}m)` : `Koordinata: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat,
          lng,
          distanceKm: distance,
          accuracy,
          source: 'gps'
        };

        applyLocation(newLoc);
        setDetectingGps(false);
        setIsOpen(false);
      },
      async (err) => {
        console.warn("GPS ruxsati berilmadi:", err.message);
        setErrorMsg("GPS ruxsati berilmadi. IP manzil orqali shahar aniqlanmoqda...");
        await detectByIpFallback();
        setDetectingGps(false);
      },
      options
    );
  };

  // 2-USUL: Zaxira IP geolokatsiya (ipwho.is)
  const detectByIpFallback = async () => {
    try {
      const res = await fetch('https://ipwho.is/');
      const data = await res.json();

      if (data && data.success) {
        const lat = data.latitude || HQ_COORDS.lat;
        const lng = data.longitude || HQ_COORDS.lng;
        const distance = calculateDistance(HQ_COORDS.lat, HQ_COORDS.lng, lat, lng);

        const newLoc = {
          city: data.city || "Toshkent",
          region: data.region || "O'zbekiston",
          detail: `IP provayder: ${data.connection?.isp || "Internet"}`,
          lat,
          lng,
          distanceKm: distance,
          source: 'ip'
        };

        applyLocation(newLoc);
        setErrorMsg(null);
        setIsOpen(false);
        return;
      }
    } catch (e) {
      console.warn("IP geolocation error:", e);
    }
    setErrorMsg("Avtomatik aniqlab bo'lmadi. Quyidagi ro'yxatdan shahringizni tanlang.");
  };

  // Shaharni qo'lda tanlash
  const handleSelectCity = (preset) => {
    const distance = calculateDistance(HQ_COORDS.lat, HQ_COORDS.lng, preset.lat, preset.lng);
    const newLoc = {
      city: preset.city,
      region: preset.region,
      detail: "Markaziy hudud",
      lat: preset.lat,
      lng: preset.lng,
      distanceKm: distance,
      source: 'manual'
    };
    applyLocation(newLoc);
    setIsOpen(false);
    setErrorMsg(null);
  };

  // Qidiruv bo'yicha filtrlash
  const filteredCities = UZ_REGIONS.filter(item => 
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deliveryInfo = getDynamicDeliveryDetails(currentLoc.distanceKm || 0, currentLoc.region);

  return (
    <>
      {/* HEADER TUGMASI */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="loc-trigger-btn"
        title="Yetkazib berish manzilini tanlash"
      >
        <div className="loc-beacon-container">
          <div className="loc-beacon-wave"></div>
          <div className="loc-beacon-dot"></div>
        </div>
        <MapPin size={16} color="#2563eb" style={{ flexShrink: 0 }} />
        <div className="loc-trigger-content">
          <span className="loc-trigger-city">
            {currentLoc.city}
          </span>
          <span className="loc-trigger-sub">
            {deliveryInfo.time} ({deliveryInfo.cost})
          </span>
        </div>
      </button>

      {/* ULTRA-PREMIUM MODAL OYNA */}
      {isOpen && (
        <div 
          className="loc-modal-backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="loc-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="loc-modal-header">
              <div className="loc-modal-header-left">
                <div className="loc-modal-icon-badge">
                  <Navigation size={22} />
                </div>
                <div>
                  <h3 className="loc-modal-title">Yetkazib berish manzili</h3>
                  <p className="loc-modal-subtitle">Eng yaqin filiali va yetkazish vaqti avtomatik belgilanadi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="loc-modal-close-btn"
                aria-label="Yopish"
              >
                <X size={18} />
              </button>
            </div>

            {/* Joriy Manzil Kartochkasi */}
            <div className="loc-current-card">
              <div className="loc-current-row">
                <div className="loc-pin-badge">
                  <MapPin size={20} />
                </div>
                <div className="loc-current-details">
                  <div className="loc-current-title-wrap">
                    <span className="loc-current-city">{currentLoc.city}</span>
                    <span className="loc-tag-active">Joriy manzil</span>
                  </div>
                  <p className="loc-current-street">
                    {currentLoc.region} {currentLoc.detail ? `• ${currentLoc.detail}` : ''}
                  </p>
                  <div className="loc-stats-chips">
                    <span className="loc-stat-chip delivery">
                      <Truck size={13} />
                      Yetkazish: {deliveryInfo.cost}
                    </span>
                    <span className="loc-stat-chip time">
                      <Clock size={13} />
                      {deliveryInfo.time}
                    </span>
                    <span className="loc-stat-chip distance">
                      <Compass size={13} />
                      {currentLoc.distanceKm || 0} km (Qo'qondan)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Tana Qismi */}
            <div className="loc-modal-body">
              {/* GPS Tugmasi */}
              <button
                type="button"
                onClick={detectPreciseLocation}
                disabled={detectingGps}
                className="loc-gps-btn"
              >
                <Crosshair size={18} className={detectingGps ? "loc-spinner" : ""} />
                <span>
                  {detectingGps ? "Aniq GPS koordinatalari olinmoqda..." : "Hozirgi turgan joyimni aniqlash (GPS)"}
                </span>
              </button>

              {/* Xatolik bo'lsa xabar */}
              {errorMsg && (
                <div className="loc-alert">
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Shahar Qidirish Qutisi */}
              <div className="loc-search-box">
                <Search size={16} className="loc-search-icon" />
                <input
                  type="text"
                  placeholder="Shahringiz yoki viloyat nomini kiriting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="loc-search-input"
                />
              </div>

              {/* Shaharlar ro'yxati */}
              <div>
                <div className="loc-list-header">
                  {searchQuery ? "Qidiruv natijalari" : "Ommabop hududlar & Shaharlar"}
                </div>
                <div className="loc-cities-scroll">
                  {filteredCities.map((item) => {
                    const isSelected = currentLoc.city.toLowerCase().includes(item.city.toLowerCase());
                    const dist = calculateDistance(HQ_COORDS.lat, HQ_COORDS.lng, item.lat, item.lng);
                    const deliv = getDynamicDeliveryDetails(dist, item.region);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectCity(item)}
                        className={`loc-city-item ${isSelected ? 'active' : ''}`}
                      >
                        <div className="loc-city-left">
                          <div className="loc-city-icon">
                            {isSelected ? <Check size={16} /> : <MapPin size={16} />}
                          </div>
                          <div>
                            <h4 className="loc-city-name">{item.city}</h4>
                            <p className="loc-city-region">{item.region}</p>
                          </div>
                        </div>

                        <div className="loc-city-right">
                          <span className="loc-city-cost">{deliv.cost}</span>
                          <span className="loc-city-sub">{deliv.time} • {dist} km</span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredCities.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                      Bunday shahar topilmadi.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="loc-modal-footer">
              <div className="loc-footer-text">
                <ShieldCheck size={16} color="#059669" />
                <span>GoodLife markaziy ombori: Qo'qon shahri</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="loc-footer-done-btn"
              >
                Tayyor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPicker;
