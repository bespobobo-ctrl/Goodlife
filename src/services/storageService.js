// GoodLife Unified Storage & Backup Service
// Single source of truth for products, orders, stock counts, and system backups.

import { dealProducts, pcAccessories, recentlyAddedProducts } from '../data/products';

const WAREHOUSE_KEY = 'goodlife_warehouse_products';
const DOKON_PRODUCTS_KEY = 'goodlife_dokon_products';
const DOKON_ORDERS_KEY = 'goodlife_dokon_orders';
const CATEGORIES_KEY = 'goodlife_dokon_categories';
const EXPENSES_KEY = 'goodlife_admin_expenses';
const SETTINGS_KEY = 'goodlife_store_settings';
const DELIVERY_SETTINGS_KEY = 'goodlife_delivery_settings';
const ONLINE_ORDERS_KEY = 'goodlife_online_orders';
const ORDER_STATUSES_KEY = 'goodlife_order_statuses';

// Standart 12 viloyat + Toshkent va Qoraqalpog'iston dastavka tariflari
export const DEFAULT_DELIVERY_SETTINGS = {
  freeDeliveryThreshold: 500000, // 500,000 so'mdan oshsa bepul
  localQoqonPrice: 0, // Qo'qon shahar ichi bepul
  localQoqonTime: "25-35 daqiqa",
  regions: [
    { id: 'fergana', name: "Farg'ona viloyati", price: 15000, time: "1-2 soat", active: true, popular: true },
    { id: 'andijan', name: "Andijon viloyati", price: 20000, time: "2-3 soat", active: true, popular: true },
    { id: 'namangan', name: "Namangan viloyati", price: 20000, time: "2-3 soat", active: true, popular: true },
    { id: 'tashkent_city', name: "Toshkent shahri", price: 25000, time: "1 ish kuni", active: true, popular: true },
    { id: 'tashkent_reg', name: "Toshkent viloyati", price: 25000, time: "1 ish kuni", active: true, popular: false },
    { id: 'samarkand', name: "Samarqand viloyati", price: 30000, time: "1 ish kuni", active: true, popular: true },
    { id: 'bukhara', name: "Buxoro viloyati", price: 35000, time: "1-2 kun", active: true, popular: true },
    { id: 'kashkadarya', name: "Qashqadaryo viloyati", price: 35000, time: "1-2 kun", active: true, popular: false },
    { id: 'surkhandarya', name: "Surxondaryo viloyati", price: 40000, time: "2 kun", active: true, popular: false },
    { id: 'jizzakh', name: "Jizzax viloyati", price: 25000, time: "1 ish kuni", active: true, popular: false },
    { id: 'sirdaryo', name: "Sirdaryo viloyati", price: 25000, time: "1 ish kuni", active: true, popular: false },
    { id: 'navoiy', name: "Navoiy viloyati", price: 35000, time: "1-2 kun", active: true, popular: false },
    { id: 'khorezm', name: "Xorazm viloyati", price: 40000, time: "2 kun", active: true, popular: true },
    { id: 'karakalpakstan', name: "Qoraqalpog'iston Respub.", price: 45000, time: "2-3 kun", active: true, popular: false }
  ]
};

export const StorageService = {
  // 1. Get Master Products
  getProducts() {
    try {
      const stored = localStorage.getItem(WAREHOUSE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const localStored = localStorage.getItem(DOKON_PRODUCTS_KEY);
      if (localStored) {
        const parsed = JSON.parse(localStored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Storage read error:", e);
    }

    const combined = [...dealProducts, ...pcAccessories, ...recentlyAddedProducts];
    const seeded = combined.map((p, idx) => ({
      ...p,
      stockCount: p.stockCount !== undefined ? p.stockCount : (idx % 3 === 0 ? 3 : 15 + (idx * 4) % 40),
      costPrice: p.costPrice !== undefined ? p.costPrice : Math.round((p.price || 100) * 0.68)
    }));
    this.saveProducts(seeded);
    return seeded;
  },

  // 2. Save Master Products
  saveProducts(products) {
    try {
      const json = JSON.stringify(products);
      localStorage.setItem(WAREHOUSE_KEY, json);
      localStorage.setItem(DOKON_PRODUCTS_KEY, json);
      window.dispatchEvent(new CustomEvent('goodlife_products_updated', { detail: products }));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  },

  // 3. Decrement stock on sale
  decrementStock(cartItems) {
    const products = this.getProducts();
    const updated = products.map(p => {
      const soldItem = cartItems.find(item => item.id === p.id);
      if (soldItem) {
        const currentStock = p.stockCount !== undefined ? p.stockCount : 10;
        const newStock = Math.max(0, currentStock - (soldItem.qty || 1));
        return { ...p, stockCount: newStock };
      }
      return p;
    });

    this.saveProducts(updated);
    return updated;
  },

  // 4. Get Delivery Settings
  getDeliverySettings() {
    try {
      const stored = localStorage.getItem(DELIVERY_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.regions) && parsed.regions.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Delivery settings read error:", e);
    }
    return DEFAULT_DELIVERY_SETTINGS;
  },

  // 5. Save Delivery Settings
  saveDeliverySettings(settings) {
    try {
      const json = JSON.stringify(settings);
      localStorage.setItem(DELIVERY_SETTINGS_KEY, json);
      window.dispatchEvent(new CustomEvent('goodlife_delivery_updated', { detail: settings }));
      return true;
    } catch (e) {
      console.error("Delivery settings save error:", e);
      return false;
    }
  },

  // 6. Online Orders Management
  getOnlineOrders() {
    try {
      const stored = localStorage.getItem(ONLINE_ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Online orders read error:", e);
    }
    return [];
  },

  addOnlineOrder(order) {
    const orders = this.getOnlineOrders();
    const updated = [order, ...orders];
    try {
      localStorage.setItem(ONLINE_ORDERS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('goodlife_orders_updated', { detail: order }));
    } catch (e) {
      console.error("Online order save error:", e);
    }
    return updated;
  },

  updateOrderStatus(orderId, newStatus) {
    try {
      // 1. Update in order_statuses map
      const statuses = JSON.parse(localStorage.getItem(ORDER_STATUSES_KEY) || '{}');
      statuses[orderId] = newStatus;
      localStorage.setItem(ORDER_STATUSES_KEY, JSON.stringify(statuses));

      // 2. Also update in online orders if present
      const onlineOrders = this.getOnlineOrders();
      let updatedOnline = false;
      const newOnline = onlineOrders.map(o => {
        if (o.id === orderId) {
          updatedOnline = true;
          return { ...o, status: newStatus };
        }
        return o;
      });
      if (updatedOnline) {
        localStorage.setItem(ONLINE_ORDERS_KEY, JSON.stringify(newOnline));
      }

      window.dispatchEvent(new CustomEvent('goodlife_orders_updated', { detail: { orderId, newStatus } }));
      return true;
    } catch (e) {
      console.error("Update order status error:", e);
      return false;
    }
  },

  deleteOrder(orderId) {
    try {
      const onlineOrders = this.getOnlineOrders();
      const filtered = onlineOrders.filter(o => o.id !== orderId);
      localStorage.setItem(ONLINE_ORDERS_KEY, JSON.stringify(filtered));

      // Also mark as deleted in statuses
      const statuses = JSON.parse(localStorage.getItem(ORDER_STATUSES_KEY) || '{}');
      statuses[orderId] = 'Deleted';
      localStorage.setItem(ORDER_STATUSES_KEY, JSON.stringify(statuses));

      window.dispatchEvent(new CustomEvent('goodlife_orders_updated', { detail: { orderId, deleted: true } }));
      return true;
    } catch (e) {
      console.error("Delete order error:", e);
      return false;
    }
  },

    // 6. Export full system backup as JSON
  exportBackup() {
    const backup = {
      app: 'GoodLife Enterprise Retail',
      version: '2.1',
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('uz-UZ'),
      data: {
        products: this.getProducts(),
        dokonOrders: JSON.parse(localStorage.getItem(DOKON_ORDERS_KEY) || '[]'),
        onlineOrders: this.getOnlineOrders(),
        orderStatuses: JSON.parse(localStorage.getItem(ORDER_STATUSES_KEY) || '{}'),
        categories: JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]'),
        expenses: JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]'),
        settings: JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
        deliverySettings: this.getDeliverySettings()
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `goodlife_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  },

  // 7. Import and restore backup
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || !parsed.data.products) {
        return { success: false, error: "Zaxira fayli formati noto'g'ri!" };
      }

      if (Array.isArray(parsed.data.products)) {
        this.saveProducts(parsed.data.products);
      }
      if (parsed.data.onlineOrders && Array.isArray(parsed.data.onlineOrders)) {
        localStorage.setItem(ONLINE_ORDERS_KEY, JSON.stringify(parsed.data.onlineOrders));
      }
      if (parsed.data.orderStatuses) {
        localStorage.setItem(ORDER_STATUSES_KEY, JSON.stringify(parsed.data.orderStatuses));
      }
      if (parsed.data.dokonOrders) {
        localStorage.setItem(DOKON_ORDERS_KEY, JSON.stringify(parsed.data.dokonOrders));
      }
      if (parsed.data.categories) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(parsed.data.categories));
      }
      if (parsed.data.expenses) {
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(parsed.data.expenses));
      }
      if (parsed.data.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.data.settings));
      }
      if (parsed.data.deliverySettings) {
        this.saveDeliverySettings(parsed.data.deliverySettings);
      }

      window.dispatchEvent(new CustomEvent('goodlife_backup_restored'));
      return { success: true, message: "Ma'lumotlar muvaffaqiyatli tiklandi!" };
    } catch (e) {
      return { success: false, error: "Faylni o'qishda xatolik yuz berdi: " + e.message };
    }
  }
};
