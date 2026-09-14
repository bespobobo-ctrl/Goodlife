import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import EmptyState from '../components/common/EmptyState';
import { ProductService } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function ShopPage({ onQuickView, selectedCategory: propCategory = 'all', setSelectedCategory: setPropCategory }) {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(propCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSelectedCategory(propCategory);
  }, [propCategory]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (setPropCategory) {
      setPropCategory(catId);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    ProductService.searchProducts(searchQuery, selectedCategory, lang)
      .then((data) => {
        if (!isMounted) return;
        
        let sorted = [...data];
        if (sortBy === 'low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCategory, searchQuery, sortBy, lang]);

  const categoriesList = [
    { id: 'all', label: lang === 'uz' ? 'Barcha Mahsulotlar' : 'Все Товары' },
    { id: 'headphones', label: lang === 'uz' ? 'Quloqchinlar & Audio' : 'Наушники и Аудио' },
    { id: 'mobiles', label: lang === 'uz' ? 'Smartfonlar & Planshetlar' : 'Смартфоны и Планшеты' },
    { id: 'gaming', label: lang === 'uz' ? 'Xbox & Playstation' : 'Игровые Консоли' },
    { id: 'soundbox', label: lang === 'uz' ? 'Kalonkalar & Akustika' : 'Акустика и Колонки' },
    { id: 'washing', label: lang === 'uz' ? 'Kir Yuvish Mashinalari' : 'Стиральные Машины' },
    { id: 'coffee', label: lang === 'uz' ? 'Kofe Mashinalari' : 'Кофемашины' },
    { id: 'fridge', label: lang === 'uz' ? 'Muzlatgichlar' : 'Холодильники' },
    { id: 'iron', label: lang === 'uz' ? "Dazmollar & Bug'lagichlar" : 'Утюги и Пароочистители' },
    { id: 'laptops', label: lang === 'uz' ? 'Noutbuklar & Kompyuterlar' : 'Ноутбуки и Компьютеры' },
    { id: 'apple', label: lang === 'uz' ? 'Apple Mahsulotlari' : 'Продукция Apple' }
  ];

  return (
    <div className="container" style={{ width: '100%', padding: '2.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Shop Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>{lang === 'uz' ? "GOOD LIFE Do'koni Katalogi" : "Каталог Магазина GOOD LIFE"}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {lang === 'uz' ? "Eng so'nggi va sifatli maishiy texnika vositalari" : "Самая свежая и качественная бытовая техника"}
          </p>
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SlidersHorizontal size={18} color="var(--primary-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{lang === 'uz' ? "Saralash:" : "Сортировка:"}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-dark)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="default">{lang === 'uz' ? "Odatiy bo'yicha" : "По умолчанию"}</option>
            <option value="low">{lang === 'uz' ? "Narx: Arzondan Qimmatga" : "Цена: Сначала дешевые"}</option>
            <option value="high">{lang === 'uz' ? "Narx: Qimmatdan Arzon-ga" : "Цена: Сначала дорогие"}</option>
            <option value="rating">{lang === 'uz' ? "Yuqori Reytingli" : "По рейтингу"}</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="shop-layout">
        
        {/* Left Sidebar Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Pristine Modern Search Input Box */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--primary-blue)' }} />
            
            <input
              type="text"
              placeholder={lang === 'uz' ? "Katalogdan qidirish..." : "Поиск по каталогу..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                fontSize: '0.88rem',
                boxShadow: 'none'
              }}
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Categories List Card */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <Filter size={18} color="var(--primary-blue)" />
              <span>{lang === 'uz' ? "Kategoriyalar" : "Категории"}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedCategory === cat.id ? 'var(--primary-blue-light)' : 'transparent',
                    color: selectedCategory === cat.id ? 'var(--primary-blue)' : 'var(--text-dark)',
                    fontWeight: selectedCategory === cat.id ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-blue)' }}></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="shop-products-grid">
          {loading ? (
            <SkeletonCard count={6} />
          ) : products.length === 0 ? (
            <EmptyState
              message={lang === 'uz' ? "Izlangan kriteriya bo'yicha mahsulotlar topilmadi" : "По вашему запросу товары не найдены"}
              onReset={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            />
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
