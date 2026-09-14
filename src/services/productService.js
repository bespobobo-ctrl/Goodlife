import { categories, dealProducts, pcAccessories, recentlyAddedProducts, hotSummerOffers } from '../data/products';

// Network latency simulator for realistic API testing
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProductService = {
  getCategories: async () => {
    await delay(50);
    return categories || [];
  },

  getDealProducts: async () => {
    await delay(50);
    return dealProducts || [];
  },

  getPCAccessories: async () => {
    await delay(50);
    return pcAccessories || [];
  },

  getRecentlyAdded: async (filter = 'all') => {
    await delay(50);
    if (!recentlyAddedProducts) return [];
    if (filter === 'all') return recentlyAddedProducts;
    return recentlyAddedProducts.filter(p => p.filter === filter);
  },

  getHotOffers: async () => {
    await delay(50);
    return hotSummerOffers || [];
  },

  searchProducts: async (query, category = 'all', lang = 'uz') => {
    await delay(80);
    const all = [
      ...(dealProducts || []),
      ...(pcAccessories || []),
      ...(recentlyAddedProducts || []),
      ...(hotSummerOffers || [])
    ];

    return all.filter(p => {
      const name = typeof p.name === 'object' ? (p.name[lang] || p.name.uz) : p.name;
      const matchesQuery = !query || name.toLowerCase().includes(query.toLowerCase().trim());
      const matchesCategory = category === 'all' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }
};
