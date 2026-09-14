export const categories = [
  {
    id: 'headphones',
    title: { uz: 'Quloqchin va Bluetooth', ru: 'Наушники и Bluetooth' },
    count: 24,
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    sub: { uz: 'Simsiz & Extra Bass', ru: 'Беспроводные & Extra Bass' }
  },
  {
    id: 'mobiles',
    title: { uz: 'Smartfon va iPad', ru: 'Телефоны и Планшеты' },
    count: 42,
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    sub: { uz: 'Smartfonlar, Planshetlar', ru: 'Смартфоны, Планшеты' }
  },
  {
    id: 'gaming',
    title: { uz: 'Xbox va Playstation', ru: 'Игровые Консоли' },
    count: 18,
    icon: '🎮',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80',
    sub: { uz: 'Yangi Avlod Konsollari', ru: 'Консоли Нового Поколения' }
  },
  {
    id: 'soundbox',
    title: { uz: 'Kalonka va Akustika', ru: 'Акустика и Колонки' },
    count: 15,
    icon: '🔊',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80',
    sub: { uz: 'Tiniq Ovoz Tizimi', ru: 'Высокое Качество Звука' }
  },
  {
    id: 'washing',
    title: { uz: 'Kirmashinalar', ru: 'Стиральные Машины' },
    count: 12,
    icon: '🧺',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&q=80',
    sub: { uz: 'Inverter Eco Yuvish', ru: 'Инверторная Стиральная' }
  },
  {
    id: 'coffee',
    title: { uz: 'Kofe Mashinasi', ru: 'Кофемашины' },
    count: 9,
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=300&q=80',
    sub: { uz: 'Espresso va Kappuchino', ru: 'Эспрессо и Капучино' }
  },
  {
    id: 'fridge',
    title: { uz: 'Yangi Muzlatgichlar', ru: 'Новые Холодильники' },
    count: 16,
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&q=80',
    sub: { uz: 'No-Frost Texnologiyasi', ru: 'Технология No-Frost' }
  },
  {
    id: 'iron',
    title: { uz: 'Dazmollar', ru: 'Утюги и Пароочистители' },
    count: 20,
    icon: '👔',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=300&q=80',
    sub: { uz: "Kuchli Bug'li Dazmol", ru: 'Мощный Паровой Утюг' }
  }
];

export const dealProducts = [
  {
    id: 'deal-1',
    name: { uz: 'New Gaming Headphone RGB', ru: 'Новые Игровые Наушники RGB' },
    category: 'headphones',
    price: 125.00,
    oldPrice: 160.00,
    rating: 4.8,
    badge: '-22%',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80'
  },
  {
    id: 'deal-2',
    name: { uz: 'Xbox Gaming Playstation 5 Edition', ru: 'Xbox Gaming Playstation 5 Edition' },
    category: 'gaming',
    price: 450.00,
    oldPrice: 550.00,
    rating: 5.0,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80'
  },
  {
    id: 'deal-3',
    name: { uz: 'New Inverter Washing Machine 9kg', ru: 'Новая Стиральная Машина 9кг' },
    category: 'washing',
    price: 350.00,
    oldPrice: 420.00,
    rating: 4.6,
    badge: '-15%',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80'
  },
  {
    id: 'deal-4',
    name: { uz: 'Family Smart Rice Cooker 5L', ru: 'Умная Мультиварка 5L' },
    category: 'appliances',
    price: 95.00,
    oldPrice: 130.00,
    rating: 4.7,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=400&q=80'
  }
];

export const pcAccessories = [
  {
    id: 'acc-1',
    name: { uz: 'Gaming Motherboard Pro Z790', ru: 'Игровая Материнская Плата Z790' },
    category: 'laptops',
    price: 285.00,
    oldPrice: 320.00,
    rating: 4.9,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
  },
  {
    id: 'acc-2',
    name: { uz: 'Computer Gaming Monitor 144Hz', ru: 'Игровой Монитор 144 Гц 4K' },
    category: 'laptops',
    price: 340.00,
    oldPrice: 400.00,
    rating: 4.8,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80'
  },
  {
    id: 'acc-3',
    name: { uz: 'RGB Gaming Mouse Pad XXL', ru: 'Игровой Коврик RGB XXL' },
    category: 'laptops',
    price: 35.00,
    oldPrice: 50.00,
    rating: 4.7,
    badge: '-30%',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80'
  }
];

export const recentlyAddedProducts = [
  {
    id: 'recent-1',
    name: { uz: 'Home Refrigerator No-Frost 450L', ru: 'Холодильник No-Frost 450Л' },
    category: 'fridge',
    price: 599.00,
    oldPrice: 699.00,
    rating: 4.9,
    filter: 'featured',
    badge: 'TOP',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&q=80'
  },
  {
    id: 'recent-2',
    name: { uz: 'Washing Machine Front Load 8kg', ru: 'Стиральная Машина 8кг' },
    category: 'washing',
    price: 410.00,
    oldPrice: 480.00,
    rating: 4.7,
    filter: 'popular',
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80'
  },
  {
    id: 'recent-3',
    name: { uz: 'Steam Power Iron Machine 2400W', ru: 'Паровой Утюг 2400W' },
    category: 'iron',
    price: 69.00,
    oldPrice: 90.00,
    rating: 4.5,
    filter: 'lowPrice',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&q=80'
  },
  {
    id: 'recent-4',
    name: { uz: 'Apple iMac 5K Retina Display 27"', ru: 'Apple iMac 5K 27 Дюймов' },
    category: 'apple',
    price: 1299.00,
    oldPrice: 1499.00,
    rating: 5.0,
    filter: 'featured',
    badge: 'APPLE',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80'
  },
  {
    id: 'recent-5',
    name: { uz: 'MacBook Air M2 13.6" 512GB', ru: 'MacBook Air M2 13.6" 512ГБ' },
    category: 'apple',
    price: 1100.00,
    oldPrice: 1250.00,
    rating: 4.9,
    filter: 'popular',
    badge: 'BEST',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'
  },
  {
    id: 'recent-6',
    name: { uz: 'Apple iMac Pro 32GB RAM 1TB SSD', ru: 'Apple iMac Pro 32GB 1TB' },
    category: 'apple',
    price: 1590.00,
    oldPrice: 1799.00,
    rating: 5.0,
    filter: 'featured',
    badge: 'PRO',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80'
  }
];

export const hotSummerOffers = [
  {
    id: 'hot-1',
    name: { uz: 'Wkda Gaming VR Headset 3D', ru: 'Шлем Виртуальной Реальности VR 3D' },
    category: 'gaming',
    price: 190.00,
    oldPrice: 240.00,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=200&q=80'
  },
  {
    id: 'hot-2',
    name: { uz: 'Brand New Laptop Air Pro', ru: 'Новый Ноутбук Laptop Air Pro' },
    category: 'laptops',
    price: 780.00,
    oldPrice: 920.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80'
  },
  {
    id: 'hot-3',
    name: { uz: 'Xbox Gaming Playstation Console', ru: 'Консоль Xbox Gaming Playstation' },
    category: 'gaming',
    price: 435.00,
    oldPrice: 500.00,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&q=80'
  },
  {
    id: 'hot-4',
    name: { uz: 'Hifi Soundbar System 300W', ru: 'Акустическая Система Soundbar 300W' },
    category: 'headphones',
    price: 135.00,
    oldPrice: 180.00,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80'
  }
];
