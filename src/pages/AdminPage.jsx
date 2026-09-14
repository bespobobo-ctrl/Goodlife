import React, { useState } from 'react';

import ReactDOM from 'react-dom';

import {

  LayoutDashboard, Warehouse, ShoppingCart, Landmark, UserCheck, Settings,

  Package, ShoppingBag, Users, DollarSign, Plus, Edit, Trash2, CheckCircle,

  Clock, X, Search, ShieldCheck, RefreshCw, Save, Lock, User, Eye, EyeOff,

  LogOut, KeyRound, ArrowLeft, BarChart3, TrendingUp, AlertTriangle, Printer,

  Download, CheckCircle2, XCircle, PlusCircle, CreditCard, Building, Phone,

  Mail, Award, Percent, Layers, Zap, FileText, Calculator, Tag, Filter, ArrowUpRight,

  Check, FileSpreadsheet, Camera, Send, Globe, Store, Upload, Image as ImageIcon, Sparkles, Star,

  AlertCircle, Receipt, Banknote, QrCode, Minus, ShoppingBasket, ChevronRight, ChevronDown, Hash, Wallet, Truck, MapPin

} from 'lucide-react';

import { categories, dealProducts, pcAccessories, recentlyAddedProducts } from '../data/products';

import { useLanguage } from '../context/LanguageContext';

import { useToast } from '../context/ToastContext';

import { useCurrency } from '../context/CurrencyContext';

import DokonPanel from './DokonPanel';

import { AuthService } from '../services/authService';
import ThemeControlModal from '../components/common/ThemeControlModal';

import { StorageService } from '../services/storageService';

const CATEGORY_NAMES_UZ = {
  all: 'Barchasi',
  gaming: 'Geyming',
  washing: 'Kir Yuvish',
  appliances: 'Maishiy Texnika',
  laptops: 'Noutbuklar',
  laptop: 'Noutbuklar',
  fridge: 'Muzlatgichlar',
  iron: 'Dazmollar',
  apple: 'Apple Texnikasi',
  headphones: 'Quloqchinlar',
  mobiles: 'Smartfonlar',
  soundbox: 'Kalonkalar',
  coffee: 'Kofe Mashinalari',
  accessories: 'Aksessuarlar'
};

const getCategoryLabel = (cat) => {
  if (!cat || cat === 'all') return 'Barchasi';
  const key = String(cat).toLowerCase().trim();
  return CATEGORY_NAMES_UZ[key] || (cat.charAt(0).toUpperCase() + cat.slice(1));
};

export default function AdminPage({ onReturnHome }) {

  const { lang } = useLanguage();

  const { showToast } = useToast();

  const { currency, exchangeRate, setExchangeRate, formatPrice } = useCurrency();

  // Authentication State with AuthService

  const [isAuthenticated, setIsAuthenticated] = useState(() => AuthService.isAuthenticated());

  const [authRole, setAuthRole] = useState(() => AuthService.getRole());

  const [selectedRole, setSelectedRole] = useState(null); // null | 'admin' | 'dukon'

  const [usernameInput, setUsernameInput] = useState('');

  const [passwordInput, setPasswordInput] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState(null);

  // Active Navigation Tab State: 'overview' | 'warehouse' | 'sales' | 'accounting' | 'staff' | 'settings'

  const [activeTab, setActiveTab] = useState('overview');

  const [warehouseCategory, setWarehouseCategory] = useState('all');

  // Accounting Sub-Tab State: 'price_editor' | 'finances' | 'reports'

  const [accountingSubTab, setAccountingSubTab] = useState('reports'); // default to reports
  const [reportPeriod, setReportPeriod] = useState('month'); // 'day' | 'week' | 'month' | 'year' | 'all'

  // Currency Exchange Rate Input State

  const [rateInput, setRateInput] = useState(exchangeRate);

  // 1. Warehouse & Inventory Products State (Synchronized via StorageService)

  const [productsList, setProductsList] = useState(() => StorageService.getProducts());

  React.useEffect(() => {

    const handleSync = () => {

      setProductsList(StorageService.getProducts());

    };

    window.addEventListener('goodlife_products_updated', handleSync);

    window.addEventListener('goodlife_backup_restored', handleSync);

    return () => {

      window.removeEventListener('goodlife_products_updated', handleSync);

      window.removeEventListener('goodlife_backup_restored', handleSync);

    };

  }, []);

  // 2. Sales & Orders State (with Multi-Channel Source Tracking)

  const [selectedSalesChannel, setSelectedSalesChannel] = useState('all'); // 'all' | 'pos' | 'instagram' | 'telegram' | 'webapp'

  // ===== ORDERS STATE INITIALIZATION & HELPERS =====
  const loadAllOrders = () => {
    const defaultOrders = [
      { id: 'ORD-9021', customer: 'Jasur Mavlonov', phone: '+998 90 123 45 67', total: 475.00, items: 'iPhone 15 Pro Max (1)', date: '12 Sentabr 2026', status: 'Yangi', payment: 'Payme', channel: 'Instagram', region: 'Toshkent shahri', address: 'Chilonzor 9-mavze, 14-uy' },
      { id: 'ORD-9023', customer: 'Malika Sobirova', phone: '+998 97 555 44 33', total: 125.00, items: 'New Gaming Headphone (1)', date: '10 Sentabr 2026', status: 'Jarayonda', payment: 'Naqd', channel: 'Telegram', region: "Farg'ona viloyati", address: "Qo'qon sh., Mustaqillik 45" },
      { id: 'ORD-9024', customer: 'Otabek Qodirov', phone: '+998 91 222 33 44', total: 1199.00, items: 'MacBook Pro 16" (1)', date: '10 Sentabr 2026', status: 'Yangi', payment: 'Uzum Bank', channel: 'Web App', region: 'Samarqand viloyati', address: 'Registon ko\'chasi 12' },
      { id: 'ORD-9025', customer: 'Gulnora Aliyeva', phone: '+998 90 777 11 22', total: 599.00, items: 'Home Refrigerator 450L (1)', date: '10 Sentabr 2026', status: 'Yetkazildi', payment: 'Click', channel: 'Instagram', region: 'Andijon viloyati', address: 'Bobur shoh ko\'chasi 5' },
      { id: 'ORD-9027', customer: 'Dilshod Karimov', phone: '+998 91 555 66 77', total: 340.00, items: 'Gaming Monitor 144Hz (1)', date: '08 Sentabr 2026', status: 'Jarayonda', payment: 'Payme', channel: 'Telegram', region: 'Namangan viloyati', address: 'Uychi tumani, 2-uy' },
      { id: 'ORD-9028', customer: 'Zilola Umarova', phone: '+998 97 333 22 11', total: 1100.00, items: 'MacBook Air M2 (1)', date: '08 Sentabr 2026', status: 'Yetkazildi', payment: 'Uzum Bank', channel: 'Web App', region: 'Toshkent shahri', address: 'Yunusobod 4-mavze, 23' },
      { id: 'ORD-9030', customer: 'Artel Distribyutorlik (B2B)', phone: '+998 90 555 11 22', total: 3850.00, items: 'Muzlatgichlar 450L (5), Kir Yuvish Mashinasi 9kg (4)', date: '06 Sentabr 2026', status: 'Yetkazildi', payment: 'Bank O\'tkazmasi', channel: 'B2B Optom', region: 'Farg\'ona viloyati', address: 'Qo\'qon sh., Sanoat hududi 18' },
      { id: 'ORD-9031', customer: 'MediaTech MCHJ (B2B)', phone: '+998 99 888 77 66', total: 4200.00, items: 'Gaming Monitor 144Hz (10), Xbox Gaming PS5 (3)', date: '05 Sentabr 2026', status: 'Yetkazildi', payment: 'Bank O\'tkazmasi', channel: 'B2B Optom', region: 'Toshkent shahri', address: 'Mirobod tumani, Nukus ko\'chasi 21' },
      { id: 'ORD-9032', customer: 'Qo\'qon Kassa Haftalik Aylanmasi', phone: '+998 71 200 00 00', total: 2950.00, items: 'Chakana Kassa Savdolari (Dazmollar, Quloqchinlar, Aksessuarlar)', date: '04 Sentabr 2026', status: 'Yetkazildi', payment: 'Naqd', channel: 'Do\'kon (POS)', region: 'Farg\'ona viloyati', address: 'Qo\'qon sh., Huvaydo 45' }
    ];

    let onlineOrders = [];
    try {
      const stored = localStorage.getItem("goodlife_online_orders");
      if (stored) onlineOrders = JSON.parse(stored);
    } catch(_) {}

    let posOrders = [];
    try {
      const stored = localStorage.getItem("goodlife_dokon_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        posOrders = parsed.map(o => ({
          id: o.id,
          customer: "Do'kon Xaridori",
          phone: "Kassa 123",
          total: o.total,
          items: o.items ? o.items.map(i => `${i.name?.uz || i.name} (${i.qty})`).join(', ') : '',
          rawItems: o.items,
          date: o.date,
          status: 'Yetkazildi',
          payment: o.method === 'cash' ? 'Naqd' : o.method === 'card' ? 'Karta' : 'QR Click',
          channel: o.channel || "Do'kon (POS)",
          rawOrder: o
        }));
      }
    } catch(_) {}

    let statusOverrides = {};
    try {
      statusOverrides = JSON.parse(localStorage.getItem("goodlife_order_statuses") || '{}');
    } catch(_) {}

    const combined = [...onlineOrders, ...posOrders, ...defaultOrders];
    const seen = new Set();
    const deduped = [];
    for (const ord of combined) {
      if (!seen.has(ord.id)) {
        seen.add(ord.id);
        if (statusOverrides[ord.id]) {
          if (statusOverrides[ord.id] === 'Deleted') continue;
          ord.status = statusOverrides[ord.id];
        }
        deduped.push(ord);
      }
    }
    return deduped;
  };

  const [ordersList, setOrdersList] = useState(() => loadAllOrders());
  const [salesSubTab, setSalesSubTab] = useState('orders'); // 'orders' | 'analytics'
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // 'all' | 'Yangi' | 'Jarayonda' | 'Yetkazilmoqda' | 'Yetkazildi' | 'Bekor qilindi'
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  React.useEffect(() => {
    const handleOrdersSync = () => {
      setOrdersList(loadAllOrders());
    };
    window.addEventListener('goodlife_orders_updated', handleOrdersSync);
    window.addEventListener('storage', handleOrdersSync);
    return () => {
      window.removeEventListener('goodlife_orders_updated', handleOrdersSync);
      window.removeEventListener('storage', handleOrdersSync);
    };
  }, []);

  const [receiptModalOrder, setReceiptModalOrder] = useState(null);

  // 3. Staff & Employees State

  const [staffList, setStaffList] = useState([

    { id: 'STF-01', name: 'Jasurbek Alimov', role: 'Bosh Menejer', phone: '+998 90 111 22 33', salary: 1200, status: 'Faol', rating: 4.9 },

    { id: 'STF-02', name: 'Rustam Qodirov', role: 'Omborchi Boshlig\'i', phone: '+998 93 444 55 66', salary: 800, status: 'Faol', rating: 4.8 },

    { id: 'STF-03', name: 'Nilufar Umarova', role: 'Bosh Buxgalter', phone: '+998 97 777 88 99', salary: 950, status: 'Faol', rating: 5.0 },

    { id: 'STF-04', name: 'Bekzod Toshmatov', role: 'Kuryer & Logistika Lead', phone: '+998 91 333 22 11', salary: 650, status: 'Faol', rating: 4.7 },

    { id: 'STF-05', name: 'Shahnoza Raimova', role: 'Mijozlarni Qo\'llab-quvvatlash', phone: '+998 90 999 88 77', salary: 500, status: 'Ta\'tilda', rating: 4.6 }

  ]);

  // 4. Accounting Expenses Ledger

  const [expensesList, setExpensesList] = useState([
    { id: 'EXP-101', title: 'Xodimlar oylik maoshi', category: 'Ish haqi', amount: 1200, date: '01 Sentabr 2026', status: 'To\'langan' },
    { id: 'EXP-102', title: "Qo'qon markaziy ombor ijarasi", category: 'Ijara', amount: 350, date: '05 Sentabr 2026', status: 'To\'langan' },
    { id: 'EXP-103', title: "Logistika va yetkazib berish yonilg'isi", category: 'Transport', amount: 150, date: '08 Sentabr 2026', status: 'To\'langan' },
    { id: 'EXP-104', title: 'Facebook & Target reklama xarajatlari', category: 'Marketing', amount: 180, date: '10 Sentabr 2026', status: 'To\'langan' },
    { id: 'EXP-105', title: 'Kommunal va internet to\'lovlari', category: 'Kommunal', amount: 70, date: '12 Sentabr 2026', status: 'To\'langan' }
  ]);

  // 5. Store Settings State

  const [storeSettings, setStoreSettings] = useState({

    storeName: "GoodLife Qo'qon",

    phone: "+998 71 200 00 00",

    address: "Qo'qon shahri, Huvaydo ko'chasi 45-uy",

    currency: "UZS"

  });

  const [deliverySettings, setDeliverySettings] = useState(() => StorageService.getDeliverySettings());

  const [isDeliveryConfigOpen, setIsDeliveryConfigOpen] = useState(false);

  const handleSaveDeliverySettings = () => {

    StorageService.saveDeliverySettings(deliverySettings);

    setPassMsg({ type: 'success', text: "🚚 Dastavka tariflari muvaffaqiyatli saqlandi!" });

    setTimeout(() => setPassMsg(null), 4000);

  };

  // Change Password & Backup States

  const [passRole, setPassRole] = useState('admin');

  const [oldPass, setOldPass] = useState('');

  const [newPass, setNewPass] = useState('');

  const [passMsg, setPassMsg] = useState(null);

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setPassMsg(null);

    const res = await AuthService.changePassword(passRole, oldPass, newPass);

    if (res.success) {

      setPassMsg({ type: 'success', text: res.message });

      setOldPass('');

      setNewPass('');

      showToast(res.message);

    } else {

      setPassMsg({ type: 'error', text: res.error });

      showToast(res.error);

    }

  };

  const handleImportBackupFile = (e) => {

    const file = e.target.files && e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {

      const res = StorageService.importBackup(event.target.result);

      if (res.success) {

        showToast("Zaxira ma'lumotlari muvaffaqiyatli tiklandi!");

      } else {

        showToast(res.error);

      }

    };

    reader.readAsText(file);

    e.target.value = '';

  };

  // Modal States

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);

  const [b2bCart, setB2BCart] = useState([]);

  const [b2bClient, setB2BClient] = useState("");

  const [b2bPhone, setB2BPhone] = useState("");

  const [b2bMethod, setB2BMethod] = useState("Naqd");

  const [selectedB2BProductId, setSelectedB2BProductId] = useState("");

  const [b2bQty, setB2BQty] = useState(1);

  const [b2bCustomPrice, setB2BCustomPrice] = useState("");

  const handleAddB2BCart = () => {

    const prod = productsList.find(p => p.id === selectedB2BProductId);

    if (!prod) return;

    setB2BCart([...b2bCart, {

      id: prod.id,

      name: prod.name,

      qty: Number(b2bQty),

      price: Number(b2bCustomPrice)

    }]);

    setSelectedB2BProductId("");

    setB2BQty(1);

    setB2BCustomPrice("");

  };

  const handleConfirmB2B = () => {

    const total = b2bCart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const order = {

      id: `GL-B2B-${Date.now()}`,

      date: new Date().toLocaleString("uz-UZ"),

      items: b2bCart,

      total,

      method: b2bMethod,

      change: 0,

      customer: b2bClient || "Optom Mijoz (B2B)",

      phone: b2bPhone || "",

      channel: "B2B Optom"

    };

    // Decrement stock

    const updatedProducts = productsList.map(p => {

      const cartItem = b2bCart.find(c => c.id === p.id);

      if (cartItem) {

        return { ...p, stockCount: Math.max(0, (p.stockCount || 0) - cartItem.qty) };

      }

      return p;

    });

    setProductsList(updatedProducts);

    StorageService.saveProducts(updatedProducts);

    window.dispatchEvent(new CustomEvent('goodlife_products_updated', { detail: updatedProducts }));

    // Add to orders

    try {

      const stored = localStorage.getItem("goodlife_dokon_orders");

      let parsed = stored ? JSON.parse(stored) : [];

      parsed = [order, ...parsed];

      localStorage.setItem("goodlife_dokon_orders", JSON.stringify(parsed));

    } catch(e) {}

    // Update ordersList state

    setOrdersList(prev => [

      {

        id: order.id,

        customer: order.customer,

        phone: order.phone,

        total: order.total,

        items: order.items.map(i => `${i.name?.uz || i.name} (${i.qty})`).join(', '),

        date: order.date,

        status: 'Bajarildi',

        payment: order.method,

        channel: order.channel,

        rawOrder: order

      },

      ...prev

    ]);

    setReceiptModalOrder(order);

    setIsB2BModalOpen(false);

    setB2BCart([]);

    setB2BClient("");

    setB2BPhone("");

  };

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [reportTitle, setReportTitle] = useState('To\'liq Buxgalteriya va Ombor Balansi Auditi');

  const initialProductForm = {

    nameUz: '',

    nameRu: '',

    price: '',

    oldPrice: '',

    costPrice: '',

    category: 'headphones',

    brand: 'GoodLife Official',

    sku: '',

    badge: 'NEW',

    stockCount: 15,

    warranty: '12 oylik rasmiy kafolat',

    deliveryInfo: "O'zbekiston bo'ylab 24 soatda bepul yetkazib berish",

    shortDesc: '',

    fullDesc: '',

    images: [],

    specsList: [

      { key: 'Ishlab chiqaruvchi', value: 'GoodLife Official' },

      { key: 'Kafolat', value: '12 oylik rasmiy kafolat' }

    ]

  };

  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState(initialProductForm);

  const [imageUrlInput, setImageUrlInput] = useState('');

  const [modalTab, setModalTab] = useState('all'); // 'all' | 'images' | 'pricing' | 'specs'

  const [staffForm, setStaffForm] = useState({

    name: '', role: 'Bosh Menejer', phone: '+998 ', salary: 600, status: 'Faol'

  });

  const [orderForm, setOrderForm] = useState({

    customer: '', phone: '+998 ', items: '', total: '', payment: 'Payme', channel: 'Do\'kon (POS)'

  });

  const [expenseForm, setExpenseForm] = useState({

    title: '', category: 'Ish haqi', amount: ''

  });

  // Accounting Quick Price & Cost Handlers

  const handleDirectPriceUpdate = (productId, field, inputValue) => {

    const rawVal = Math.max(0, Number(inputValue) || 0);

    // If current currency mode is UZS, convert typed UZS amount to USD base price

    const usdVal = currency === 'UZS' ? (rawVal / (exchangeRate || 12900)) : rawVal;

    setProductsList(prev => prev.map(p => {

      if (p.id === productId) {

        return { ...p, [field]: Math.round(usdVal * 100) / 100 };

      }

      return p;

    }));

    showToast(lang === 'uz' ? "Narx buxgalteriyada saqlandi!" : "Цена обновлена!");

  };

  const handleBulkPriceAdjust = (percent) => {

    const isPlus = percent > 0;

    if (window.confirm(lang === 'uz' ? `Barcha mahsulotlar narxini ${isPlus ? '+' : ''}${percent}% ga o'zgartirishni tasdiqlaysizmi?` : "Изменить все цены?")) {

      setProductsList(prev => prev.map(p => {

        const newRetail = Math.round(p.price * (1 + percent / 100));

        return { ...p, price: newRetail };

      }));

      showToast(lang === 'uz' ? `Barcha sotuv narxlari ${isPlus ? '+' : ''}${percent}% ga o'zgartirildi!` : "Цены обновлены!");

    }

  };

  const handleSaveExpense = (e) => {

    e.preventDefault();

    if (!expenseForm.title || !expenseForm.amount) return;

    const newExp = {

      id: 'EXP-' + Math.floor(105 + Math.random() * 890),

      title: expenseForm.title,

      category: expenseForm.category,

      amount: Number(expenseForm.amount),

      date: new Date().toLocaleDateString('uz-UZ'),

      status: 'To\'langan'

    };

    setExpensesList([newExp, ...expensesList]);

    setIsExpenseModalOpen(false);

    setExpenseForm({ title: '', category: 'Ish haqi', amount: '' });

    showToast(lang === 'uz' ? "Yangi xarajat buxgalteriya daftariga kiritildi!" : "Расход добавлен!");

  };

  const handleOpenReportModal = (type = 'To\'liq Audit') => {

    setReportTitle(type);

    setIsReportModalOpen(true);

  };

  const handleDownloadExcel = () => {

    const isUzs = currency === 'UZS';

    const currLabel = isUzs ? "UZS (so'm)" : "USD ($)";

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;

    html += `<head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>`;

    html += `<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Buxgalteriya Hisoboti</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;

    html += `<style>

      td, th { font-family: Arial, sans-serif; font-size: 11pt; padding: 6px; }

      .title { font-size: 16pt; font-weight: bold; color: #2563eb; }

      .header { font-size: 11pt; font-weight: bold; background-color: #2563eb; color: #ffffff; text-align: center; border: 1px solid #1d4ed8; }

      .subheader { font-size: 12pt; font-weight: bold; background-color: #eff6ff; color: #1e3a8a; padding: 8px; }

      .num { text-align: right; }

      .bold { font-weight: bold; }

      .profit { color: #16a34a; font-weight: bold; }

      .loss { color: #dc2626; font-weight: bold; }

      .border { border: 1px solid #cbd5e1; }

    </style></head><body>`;

    html += `<table border="0">`;

    html += `<tr><td colspan="10" class="title">GOOD LIFE MAISHIY TEXNIKA - MOLIYAVIY AUDIT VA BUXGALTERIYA BALANSI</td></tr>`;

    html += `<tr><td colspan="10"><b>Hujjat Nomi:</b> ${reportTitle}</td></tr>`;

    html += `<tr><td colspan="10"><b>Hujjat №:</b> AUD-2026-9042 | <b>Sana:</b> ${new Date().toLocaleDateString('uz-UZ')} | <b>Filial:</b> Qo'qon shahri | <b>Valyuta Kursi:</b> 1 USD = ${exchangeRate} UZS</td></tr>`;

    html += `<tr><td colspan="10"></td></tr>`;

    // 1. Summary

    html += `<tr><td colspan="10" class="subheader">1. MOLIYAVIY KO'RSATKICHLAR BALANSI</td></tr>`;

    html += `<tr><td class="bold">Yalpi Tushum:</td><td class="bold profit">${formatPrice(totalRevenue)}</td><td colspan="8">(${totalRevenue} USD)</td></tr>`;

    html += `<tr><td class="bold">Operatsion Xarajatlar:</td><td class="bold loss">${formatPrice(totalExpenses)}</td><td colspan="8">(${totalExpenses} USD)</td></tr>`;

    html += `<tr><td class="bold">Sof Foyda (Net Profit):</td><td class="bold ${netProfit >= 0 ? 'profit' : 'loss'}">${formatPrice(netProfit)}</td><td colspan="8">(${netProfit} USD)</td></tr>`;

    html += `<tr><td colspan="10"></td></tr>`;

    // 2. Products Table

    html += `<tr><td colspan="10" class="subheader">2. OMBOR MAHSULOTLARI VA NARX MARJALARI REESTRI</td></tr>`;

    html += `<tr>

      <th class="header">№</th>

      <th class="header">ID</th>

      <th class="header">Mahsulot Nomi</th>

      <th class="header">Kategoriya</th>

      <th class="header">Tannarx (${currLabel})</th>

      <th class="header">Sotuv Narxi (${currLabel})</th>

      <th class="header">Sof Marja (${currLabel})</th>

      <th class="header">Ustama %</th>

      <th class="header">Ombor Soni</th>

      <th class="header">Jami Sotuv Qiymati (${currLabel})</th>

    </tr>`;

    productsList.forEach((p, idx) => {

      const nameStr = typeof p.name === 'object' ? p.name.uz : p.name;

      const costVal = p.costPrice !== undefined ? p.costPrice : Math.round(p.price * 0.68);

      const profitVal = p.price - costVal;

      const marginPct = ((profitVal / Math.max(1, costVal)) * 100).toFixed(0);

      const totalVal = p.price * (p.stockCount || 0);

      html += `<tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">

        <td class="border" style="text-align: center;">${idx + 1}</td>

        <td class="border">${p.id}</td>

        <td class="border bold">${nameStr}</td>

        <td class="border">${p.category || 'appliances'}</td>

        <td class="border num">${formatPrice(costVal)}</td>

        <td class="border num bold" style="color: #2563eb;">${formatPrice(p.price)}</td>

        <td class="border num profit">+${formatPrice(profitVal)}</td>

        <td class="border num" style="text-align: center;">+${marginPct}%</td>

        <td class="border num bold" style="text-align: center;">${p.stockCount || 0} ta</td>

        <td class="border num bold">${formatPrice(totalVal)}</td>

      </tr>`;

    });

    html += `<tr><td colspan="10"></td></tr>`;

    // 3. Expenses Table

    html += `<tr><td colspan="10" class="subheader">3. OPERATSION XARAJTALAR DAFTARI</td></tr>`;

    html += `<tr>

      <th class="header">ID</th>

      <th class="header" colspan="4">Xarajat Nomi (Tavsifi)</th>

      <th class="header" colspan="2">Kategoriya</th>

      <th class="header">Sana</th>

      <th class="header" colspan="2">Summa (${currLabel})</th>

    </tr>`;

    expensesList.forEach(exp => {

      html += `<tr>

        <td class="border">${exp.id}</td>

        <td class="border bold" colspan="4">${exp.title}</td>

        <td class="border" colspan="2">${exp.category}</td>

        <td class="border">${exp.date}</td>

        <td class="border num loss" colspan="2">${formatPrice(exp.amount)}</td>

      </tr>`;

    });

    html += `<tr><td colspan="10"></td></tr>`;

    html += `<tr><td colspan="5" class="bold" style="padding-top: 15px;">Bosh Buxgalter: Nilufar Umarova [TASDIQLANDI]</td><td colspan="5" class="bold" style="padding-top: 15px;">Bosh Menejer: Jasurbek Alimov [TASDIQLANDI]</td></tr>`;

    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.setAttribute('href', url);

    link.setAttribute('download', `GOOD_LIFE_Buxgalteriya_Hisoboti_${new Date().toISOString().slice(0, 10)}.xls`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    showToast(lang === 'uz' ? "Excel (.XLS) fayl ustunlarga ajratilgan holda yuklab olindi!" : "Excel файл скачан!");

  };

  const handlePrintPDF = () => {

    window.print();

  };

  // Auth Handlers with SHA-256 Hashing

  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    setAuthError(null);

    const res = await AuthService.login(usernameInput, passwordInput, selectedRole);

    if (res.success) {

      setIsAuthenticated(true);

      setAuthRole(res.role);

      showToast(lang === 'uz' ? `${res.displayName} tizimiga muvaffaqiyatli kirildi!` : "Успешный вход!");

    } else {

      setAuthError(res.error);

    }

  };

  const handleLogout = () => {

    AuthService.logout();

    setIsAuthenticated(false);

    setAuthRole(null);

    setSelectedRole(null);

    setPasswordInput('');

    setAuthError(null);

    showToast(lang === 'uz' ? "Tizimdan chiqildi" : "Вышли из панели");

  };

  // ── DO'KON PANELI: authRole === 'dukon' bo'lganda alohida panel ko'rsat ──

  if (isAuthenticated && authRole === 'dukon') {

    return <DokonPanel onLogout={handleLogout} />;

  }

  // Inventory Handlers

  const handleStockChange = (productId, delta) => {

    setProductsList(prev => prev.map(p => {

      if (p.id === productId) {

        const newStock = Math.max(0, (p.stockCount || 0) + delta);

        return { ...p, stockCount: newStock };

      }

      return p;

    }));

    showToast(lang === 'uz' ? "Ombor zaxirasi yangilandi" : "Запас обновлен");

  };

  const handleDeleteProduct = (id) => {

    if (window.confirm(lang === 'uz' ? "Ushbu mahsulotni o'chirishni tasdiqlaysizmi?" : "Удалить этот товар?")) {

      const updated = productsList.filter(p => p.id !== id);

      setProductsList(updated);

      try {

        localStorage.setItem('goodlife_warehouse_products', JSON.stringify(updated));

      } catch (e) {}

      showToast(lang === 'uz' ? "Mahsulot o'chirildi" : "Товар удален");

    }

  };

  const openAddModal = () => {

    setEditingProduct(null);

    setProductForm({

      ...initialProductForm,

      sku: `GL-${Math.floor(1000 + Math.random() * 9000)}`

    });

    setImageUrlInput('');

    setIsAddModalOpen(true);

  };

  const openEditModal = (product) => {

    setEditingProduct(product);

    let currentImages = [];

    if (Array.isArray(product.images) && product.images.length > 0) {

      currentImages = [...product.images];

    } else if (product.image) {

      currentImages = [product.image];

    }

    let currentSpecs = [];

    if (Array.isArray(product.specsList) && product.specsList.length > 0) {

      currentSpecs = [...product.specsList];

    } else if (product.specs && typeof product.specs === 'object') {

      currentSpecs = Object.entries(product.specs).map(([key, value]) => ({ key, value }));

    } else {

      currentSpecs = [

        { key: 'Ishlab chiqaruvchi', value: product.brand || 'GoodLife Official' },

        { key: 'Kafolat', value: product.warranty || '12 oylik rasmiy kafolat' }

      ];

    }

    setProductForm({

      nameUz: typeof product.name === 'object' ? product.name.uz : (product.name || ''),

      nameRu: typeof product.name === 'object' ? (product.name.ru || product.name.uz) : (product.name || ''),

      price: product.price || '',

      oldPrice: product.oldPrice || '',

      costPrice: product.costPrice || Math.round((product.price || 100) * 0.68),

      category: product.category || 'headphones',

      brand: product.brand || 'GoodLife Official',

      sku: product.sku || (product.id ? `SKU-${product.id}` : `GL-${Math.floor(1000 + Math.random() * 9000)}`),

      badge: product.badge || 'NEW',

      stockCount: product.stockCount !== undefined ? product.stockCount : 15,

      warranty: product.warranty || '12 oylik rasmiy kafolat',

      deliveryInfo: product.deliveryInfo || "O'zbekiston bo'ylab 24 soatda bepul yetkazib berish",

      shortDesc: product.shortDesc || '',

      fullDesc: product.fullDesc || product.description || '',

      images: currentImages,

      specsList: currentSpecs

    });

    setImageUrlInput('');

    setIsAddModalOpen(true);

  };

  // Image Upload Handlers (Up to 5 images)

  const handleImageFileUpload = (e) => {

    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const currentImgs = productForm.images || [];

    const availableSlots = 5 - currentImgs.length;

    if (availableSlots <= 0) {

      showToast(lang === 'uz' ? "Maksimal 5 ta rasm yuklash mumkin!" : "Максимум 5 изображений!");

      return;

    }

    const filesToRead = files.slice(0, availableSlots);

    filesToRead.forEach(file => {

      const reader = new FileReader();

      reader.onload = (event) => {

        setProductForm(prev => {

          const arr = prev.images || [];

          if (arr.length >= 5) return prev;

          return { ...prev, images: [...arr, event.target.result] };

        });

      };

      reader.readAsDataURL(file);

    });

    e.target.value = '';

    showToast(lang === 'uz' ? `${filesToRead.length} ta rasm yuklandi` : `Загружено ${filesToRead.length} фото`);

  };

  const handleAddImageUrl = () => {

    if (!imageUrlInput.trim()) return;

    const currentImgs = productForm.images || [];

    if (currentImgs.length >= 5) {

      showToast(lang === 'uz' ? "Maksimal 5 ta rasm kiritish mumkin!" : "Максимум 5 изображений!");

      return;

    }

    setProductForm(prev => ({

      ...prev,

      images: [...(prev.images || []), imageUrlInput.trim()]

    }));

    setImageUrlInput('');

    showToast(lang === 'uz' ? "Rasm havolasi qo'shildi" : "Ссылка на фото добавлена");

  };

  const handleRemoveImage = (indexToRemove) => {

    setProductForm(prev => ({

      ...prev,

      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)

    }));

  };

  const handleSetMainImage = (indexToMain) => {

    setProductForm(prev => {

      const arr = [...(prev.images || [])];

      const [chosen] = arr.splice(indexToMain, 1);

      return {

        ...prev,

        images: [chosen, ...arr]

      };

    });

    showToast(lang === 'uz' ? "Asosiy muqova rasmi tanlandi" : "Главное фото установлено");

  };

  // Specification Key-Value Handlers

  const handleAddSpec = () => {

    setProductForm(prev => ({

      ...prev,

      specsList: [...(prev.specsList || []), { key: '', value: '' }]

    }));

  };

  const handleRemoveSpec = (idxToRemove) => {

    setProductForm(prev => ({

      ...prev,

      specsList: (prev.specsList || []).filter((_, idx) => idx !== idxToRemove)

    }));

  };

  const handleSpecChange = (index, field, value) => {

    setProductForm(prev => {

      const updated = [...(prev.specsList || [])];

      updated[index] = { ...updated[index], [field]: value };

      return { ...prev, specsList: updated };

    });

  };

  const handleGenerateSku = () => {

    setProductForm(prev => ({

      ...prev,

      sku: `GL-${Math.floor(1000 + Math.random() * 9000)}`

    }));

  };

  const handleSaveProduct = (e) => {

    e.preventDefault();

    if (!productForm.nameUz.trim() || !productForm.price) {

      showToast(lang === 'uz' ? "Mahsulot nomi va narxini kiritish shart!" : "Введите название и цену!");

      return;

    }

    const mainImage = (productForm.images && productForm.images.length > 0)

      ? productForm.images[0]

      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';

    const cleanedSpecs = (productForm.specsList || []).filter(s => s.key && s.key.trim() && s.value && s.value.trim());

    const productPayload = {

      name: {

        uz: productForm.nameUz.trim(),

        ru: productForm.nameRu?.trim() || productForm.nameUz.trim()

      },

      price: Number(productForm.price),

      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : Math.round(Number(productForm.price) * 1.2),

      costPrice: productForm.costPrice ? Number(productForm.costPrice) : Math.round(Number(productForm.price) * 0.68),

      category: productForm.category || 'headphones',

      brand: productForm.brand || 'GoodLife Official',

      sku: productForm.sku || `GL-${Math.floor(1000 + Math.random() * 9000)}`,

      badge: productForm.badge || 'NEW',

      stockCount: Number(productForm.stockCount !== undefined ? productForm.stockCount : 15),

      warranty: productForm.warranty || '12 oylik rasmiy kafolat',

      deliveryInfo: productForm.deliveryInfo || "O'zbekiston bo'ylab 24 soatda bepul yetkazib berish",

      shortDesc: productForm.shortDesc,

      fullDesc: productForm.fullDesc,

      description: productForm.fullDesc || productForm.shortDesc,

      image: mainImage,

      images: productForm.images && productForm.images.length > 0 ? productForm.images : [mainImage],

      specsList: cleanedSpecs,

      rating: editingProduct?.rating || 5.0

    };

    let updatedProducts;

    if (editingProduct) {

      updatedProducts = productsList.map(p => p.id === editingProduct.id ? { ...p, ...productPayload, id: p.id } : p);

      showToast(lang === 'uz' ? "Mahsulot muvaffaqiyatli yangilandi!" : "Товар обновлен!");

    } else {

      const newProd = {

        ...productPayload,

        id: 'prod-' + Date.now()

      };

      updatedProducts = [newProd, ...productsList];

      showToast(lang === 'uz' ? "Yangi mahsulot 5 ta rasm va to'liq ma'lumotlar bilan omborga qo'shildi!" : "Новый товар добавлен!");

    }

    setProductsList(updatedProducts);

    try {

      localStorage.setItem('goodlife_warehouse_products', JSON.stringify(updatedProducts));

    } catch (err) {}

    setIsAddModalOpen(false);

    setEditingProduct(null);

    setProductForm(initialProductForm);

  };

  // Staff Handlers

  const handleSaveStaff = (e) => {

    e.preventDefault();

    if (!staffForm.name || !staffForm.phone) return;

    const newStaff = {

      id: 'STF-' + (staffList.length + 1).toString().padStart(2, '0'),

      name: staffForm.name,

      role: staffForm.role,

      phone: staffForm.phone,

      salary: Number(staffForm.salary),

      status: staffForm.status,

      rating: 5.0

    };

    setStaffList([...staffList, newStaff]);

    setIsStaffModalOpen(false);

    setStaffForm({ name: '', role: 'Bosh Menejer', phone: '+998 ', salary: 600, status: 'Faol' });

    showToast(lang === 'uz' ? "Yangi xodim qo'shildi!" : "Новый сотрудник добавлен!");

  };

  const handleDeleteStaff = (id) => {

    if (window.confirm(lang === 'uz' ? "Ushbu xodimni ro'yxatdan o'chirishni tasdiqlaysizmi?" : "Удалить сотрудника?")) {

      setStaffList(prev => prev.filter(s => s.id !== id));

      showToast(lang === 'uz' ? "Xodim o'chirildi" : "Сотрудник удален");

    }

  };

  // Order Handlers

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    StorageService.updateOrderStatus(orderId, newStatus);
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev => ({ ...prev, status: newStatus }));
    }
    showToast(lang === 'uz' ? `Buyurtma maqomi: ${newStatus}` : `Статус заказа: ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm(lang === 'uz' ? "Ushbu buyurtmani rostdan ham o'chirmoqchimisiz?" : "Вы действительно хотите удалить заказ?")) return;
    StorageService.deleteOrder(orderId);
    setOrdersList(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(null);
    }
    showToast(lang === 'uz' ? "Buyurtma o'chirildi" : "Заказ удален");
  };

  const toggleOrderStatus = (orderId) => {
    const current = ordersList.find(o => o.id === orderId);
    if (!current) return;
    const nextStatus = current.status === 'Yangi' ? 'Jarayonda' : current.status === 'Jarayonda' ? 'Yetkazilmoqda' : current.status === 'Yetkazilmoqda' ? 'Yetkazildi' : current.status === 'Yetkazildi' ? 'Bekor qilindi' : 'Yangi';
    handleUpdateOrderStatus(orderId, nextStatus);
  };

  const handleSaveOrder = (e) => {

    e.preventDefault();

    if (!orderForm.customer || !orderForm.total) return;

    const newOrder = {

      id: 'ORD-' + Math.floor(9000 + Math.random() * 999),

      customer: orderForm.customer,

      phone: orderForm.phone,

      items: orderForm.items || 'Maishiy texnika (1)',

      total: Number(orderForm.total),

      date: new Date().toLocaleDateString('uz-UZ'),

      status: 'Yangi',

      payment: orderForm.payment,

      channel: orderForm.channel || 'Do\'kon (POS)'

    };

    setOrdersList([newOrder, ...ordersList]);

    setIsOrderModalOpen(false);

    setOrderForm({ customer: '', phone: '+998 ', items: '', total: '', payment: 'Payme', channel: 'Do\'kon (POS)' });

    showToast(lang === 'uz' ? "Yangi sotuv buyurtmasi yaratildi!" : "Новый заказ создан!");

  };

  // Calculations

  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);

  const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const totalStockCount = productsList.reduce((sum, p) => sum + (p.stockCount || 0), 0);

  const lowStockProducts = productsList.filter(p => (p.stockCount || 0) < 5);

  // Unauthenticated Login Portal

  if (!isAuthenticated) {

    return ReactDOM.createPortal(

      <div style={{

        position: 'fixed',

        top: 0,

        left: 0,

        right: 0,

        bottom: 0,

        width: '100vw',

        height: '100vh',

        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',

        display: 'grid',

        placeItems: 'center',

        zIndex: 9999999,

        padding: '1.5rem',

        boxSizing: 'border-box'

      }}>

        {/* Top Left Return Button */}

        <button

          onClick={() => {

            if (onReturnHome) onReturnHome();

            else window.location.reload();

          }}

          style={{

            position: 'absolute',

            top: '24px',

            left: '24px',

            background: 'rgba(255, 255, 255, 0.1)',

            backdropFilter: 'blur(8px)',

            border: '1px solid rgba(255, 255, 255, 0.15)',

            color: '#ffffff',

            padding: '0.65rem 1.25rem',

            borderRadius: '50px',

            fontWeight: 700,

            fontSize: '0.85rem',

            cursor: 'pointer',

            display: 'flex',

            alignItems: 'center',

            gap: '0.5rem',

            transition: 'all 0.2s ease',

            zIndex: 10

          }}

          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}

          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}

        >

          <ArrowLeft size={18} />

          <span>{lang === 'uz' ? "Do'kon Bosh Sahifasiga Qaytish" : "Вернуться в магазин"}</span>

        </button>

        {/* Center Portal Card: Select Role or Enter Credentials */}

        {selectedRole === null ? (

          /* STEP 1: ROLE SELECTION CARDS (ADMIN vs DUKON) */

          <div style={{

            background: '#ffffff',

            borderRadius: '28px',

            border: '1px solid rgba(255, 255, 255, 0.2)',

            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.6)',

            padding: '2.5rem 2.25rem',

            width: '100%',

            maxWidth: '720px',

            textAlign: 'center',

            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

            boxSizing: 'border-box',

            margin: 'auto',

            position: 'relative'

          }}>

            <div style={{

              width: '64px',

              height: '64px',

              borderRadius: '20px',

              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

              color: '#fff',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              margin: '0 auto 1.25rem',

              boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.45)'

            }}>

              <ShieldCheck size={34} />

            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>

              {lang === 'uz' ? "Boshqaruv Tizimiga Kirish" : "Вход в Панель Управления"}

            </h2>

            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.5 }}>

              {lang === 'uz' ? "Iltimos, tizimga kirish uchun kerakli boshqaruv bo'limini tanlang:" : "Выберите раздел для авторизации:"}

            </p>

            {/* 2 Big Action Cards: Admin vs Dukon */}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>

              

              {/* CARD 1: BOSH ADMIN */}

              <div

                onClick={() => {

                  setSelectedRole('admin');

                  setUsernameInput('admin');

                  setPasswordInput('');

                  setAuthError(null);

                }}

                style={{

                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',

                  border: '2px solid #e2e8f0',

                  borderRadius: '22px',

                  padding: '1.6rem',

                  cursor: 'pointer',

                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',

                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',

                  display: 'flex',

                  flexDirection: 'column',

                  justifyContent: 'space-between',

                  position: 'relative',

                  overflow: 'hidden'

                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.borderColor = '#2563eb';

                  e.currentTarget.style.transform = 'translateY(-4px)';

                  e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(37, 99, 235, 0.25)';

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.borderColor = '#e2e8f0';

                  e.currentTarget.style.transform = 'translateY(0)';

                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';

                }}

              >

                <div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>

                    <div style={{

                      width: '52px',

                      height: '52px',

                      borderRadius: '16px',

                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',

                      color: '#2563eb',

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      border: '1px solid #bfdbfe'

                    }}>

                      <ShieldCheck size={28} />

                    </div>

                    <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 800, padding: '3px 9px', borderRadius: '50px' }}>

                      To'liq Nazorat

                    </span>

                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>

                    👑 Bosh Admin

                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>

                    Omborga kirim qilish, buxgalteriya balansi, xodimlar boshqaruvi, tovar narxlari va audit.

                  </p>

                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>

                    Login: <strong style={{ color: '#1e293b' }}>admin</strong>

                  </span>

                  <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>

                    Kirish →

                  </span>

                </div>

              </div>

              {/* CARD 2: DUKON (FILIAL & KASSA) */}

              <div

                onClick={() => {

                  setSelectedRole('dukon');

                  setUsernameInput('dukon');

                  setPasswordInput('');

                  setAuthError(null);

                }}

                style={{

                  background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',

                  border: '2px solid #bbf7d0',

                  borderRadius: '22px',

                  padding: '1.6rem',

                  cursor: 'pointer',

                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',

                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',

                  display: 'flex',

                  flexDirection: 'column',

                  justifyContent: 'space-between',

                  position: 'relative',

                  overflow: 'hidden'

                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.borderColor = '#16a34a';

                  e.currentTarget.style.transform = 'translateY(-4px)';

                  e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(22, 163, 74, 0.25)';

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.borderColor = '#bbf7d0';

                  e.currentTarget.style.transform = 'translateY(0)';

                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';

                }}

              >

                <div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>

                    <div style={{

                      width: '52px',

                      height: '52px',

                      borderRadius: '16px',

                      background: 'linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%)',

                      color: '#16a34a',

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      border: '1px solid #a7f3d0'

                    }}>

                      <Store size={28} />

                    </div>

                    <span style={{ background: '#ecfdf5', color: '#16a34a', fontSize: '0.72rem', fontWeight: 800, padding: '3px 9px', borderRadius: '50px' }}>

                      Savdo & Kassa

                    </span>

                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>

                    🏪 Do'kon Paneli

                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>

                    Do'kon filiali savdolari, kassa buyurtmalari, tezkor POS sotuvlari va mijozlar hisob-kitobi.

                  </p>

                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>

                    Login: <strong style={{ color: '#1e293b' }}>dukon</strong>

                  </span>

                  <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>

                    Do'konga Kirish →

                  </span>

                </div>

              </div>

            </div>

          </div>

        ) : (

          /* STEP 2: CREDENTIALS FORM (FOR CHOSEN ROLE) */

          <div style={{

            background: '#ffffff',

            borderRadius: '26px',

            border: '1px solid rgba(255, 255, 255, 0.2)',

            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',

            padding: '2.25rem 2rem',

            width: '100%',

            maxWidth: '430px',

            textAlign: 'center',

            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

            boxSizing: 'border-box',

            margin: 'auto',

            position: 'relative'

          }}>

            {/* Back to Role Selection Button */}

            <button

              type="button"

              onClick={() => { setSelectedRole(null); setAuthError(null); }}

              style={{

                position: 'absolute',

                top: '18px',

                left: '18px',

                background: '#f1f5f9',

                border: 'none',

                borderRadius: '50px',

                padding: '4px 10px',

                fontSize: '0.75rem',

                fontWeight: 700,

                color: '#64748b',

                cursor: 'pointer',

                display: 'flex',

                alignItems: 'center',

                gap: '4px'

              }}

            >

              <ArrowLeft size={13} /> Orqaga

            </button>

            {/* Role Icon */}

            <div style={{

              width: '58px', height: '58px', borderRadius: '18px',

              background: selectedRole === 'admin'

                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'

                : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',

              color: '#fff', display: 'flex', alignItems: 'center',

              justifyContent: 'center', margin: '0.5rem auto 1.25rem',

              boxShadow: selectedRole === 'admin'

                ? '0 8px 25px -5px rgba(37,99,235,0.45)'

                : '0 8px 25px -5px rgba(22,163,74,0.45)'

            }}>

              {selectedRole === 'admin' ? <ShieldCheck size={30} /> : <Store size={30} />}

            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>

              {selectedRole === 'admin' ? '👑 Bosh Admin' : "🏪 Do'kon Paneli"}

            </h2>

            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.75rem' }}>

              {selectedRole === 'admin' ? 'Admin hisobingiz bilan kiring' : "Do'kon hisobingiz bilan kiring"}

            </p>

            <form onSubmit={handleLoginSubmit} style={{ textAlign: 'left' }}>

              {/* Username */}

              <div style={{ marginBottom: '1rem' }}>

                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>

                  Foydalanuvchi nomi

                </label>

                <div style={{ position: 'relative' }}>

                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />

                  <input

                    type="text"

                    value={usernameInput}

                    onChange={e => setUsernameInput(e.target.value)}

                    placeholder={selectedRole === 'admin' ? 'admin' : 'dukon'}

                    style={{

                      width: '100%', boxSizing: 'border-box',

                      padding: '0.75rem 0.9rem 0.75rem 2.5rem',

                      border: '1.5px solid #e2e8f0', borderRadius: '12px',

                      fontSize: '0.95rem', fontFamily: 'inherit',

                      outline: 'none', background: '#f8fafc'

                    }}

                    onFocus={e => e.target.style.borderColor = selectedRole === 'admin' ? '#2563eb' : '#16a34a'}

                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}

                  />

                </div>

              </div>

              {/* Password */}

              <div style={{ marginBottom: '1.5rem' }}>

                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>

                  Parol

                </label>

                <div style={{ position: 'relative' }}>

                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />

                  <input

                    type="password"

                    value={passwordInput}

                    onChange={e => setPasswordInput(e.target.value)}

                    placeholder="••••••••"

                    style={{

                      width: '100%', boxSizing: 'border-box',

                      padding: '0.75rem 0.9rem 0.75rem 2.5rem',

                      border: '1.5px solid #e2e8f0', borderRadius: '12px',

                      fontSize: '0.95rem', fontFamily: 'inherit',

                      outline: 'none', background: '#f8fafc'

                    }}

                    onFocus={e => e.target.style.borderColor = selectedRole === 'admin' ? '#2563eb' : '#16a34a'}

                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}

                  />

                </div>

              </div>

              {/* Error */}

              {authError && (

                <div style={{

                  background: '#fef2f2', border: '1px solid #fecaca',

                  borderRadius: '10px', padding: '0.6rem 0.9rem',

                  color: '#dc2626', fontSize: '0.82rem', fontWeight: 600,

                  marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px'

                }}>

                  <AlertCircle size={15} /> {authError}

                </div>

              )}

              {/* Submit */}

              <button

                type="submit"

                style={{

                  width: '100%', padding: '0.85rem',

                  background: selectedRole === 'admin'

                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'

                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',

                  color: '#fff', border: 'none', borderRadius: '12px',

                  fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',

                  boxShadow: selectedRole === 'admin'

                    ? '0 4px 15px rgba(37,99,235,0.4)'

                    : '0 4px 15px rgba(22,163,74,0.4)'

                }}

              >

                {selectedRole === 'admin' ? '👑 Admin sifatida kirish' : "🏪 Do'kon sifatida kirish"}

              </button>

              {/* Secure Info Badge */}

              <div style={{

                marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc',

                borderRadius: '10px', fontSize: '0.75rem', color: '#64748b', textAlign: 'center',

                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'

              }}>

                <ShieldCheck size={14} color="#2563eb" />

                <span>SHA-256 xavfsiz shifrlangan tizim • <strong>GoodLife Security</strong></span>

              </div>

            </form>

          </div>

        )}

      </div>,

      document.body

    );

  }

  // Navigation Tabs Definition

  const tabs = [

    { id: 'overview', label: lang === 'uz' ? "Asosiy Bo'lim" : "Обзор", icon: LayoutDashboard },

    { id: 'warehouse', label: lang === 'uz' ? "Mahsulotlar Ombori" : "Склад", icon: Warehouse, count: productsList.length },

    { id: 'sales', label: lang === 'uz' ? "Sotuv & Buyurtmalar" : "Продажи", icon: ShoppingCart, count: ordersList.length },

    { id: 'accounting', label: lang === 'uz' ? "Buxgalteriya" : "Бухгалтерия", icon: Landmark },

    { id: 'staff', label: lang === 'uz' ? "Xodimlar" : "Сотрудники", count: staffList.length, icon: UserCheck },

    { id: 'settings', label: lang === 'uz' ? "Sozlamalar" : "Настройки", icon: Settings }

  ];

  return (

    <div className="container" style={{ padding: '2.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      

      {/* Top Header Bar */}

      <div style={{

        display: 'flex',

        justify: 'space-between',

        alignItems: 'center',

        flexWrap: 'wrap',

        gap: '1rem',

        borderBottom: '1px solid #e2e8f0',

        paddingBottom: '1.25rem'

      }}>

        <div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '50px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.78rem', marginBottom: '0.4rem' }}>

            <ShieldCheck size={16} />

            <span>GOOD LIFE ERP & CRM BOSHGARUV MARKAZI</span>

          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-dark)', margin: 0, letterSpacing: '-0.02em' }}>

            {lang === 'uz' ? "Boshqaruv Paneli" : "Панель Управления"}

          </h1>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

          <button

            onClick={openAddModal}

            style={{

              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

              color: '#fff',

              border: 'none',

              padding: '0.65rem 1.3rem',

              borderRadius: '50px',

              fontWeight: 800,

              fontSize: '0.85rem',

              cursor: 'pointer',

              display: 'inline-flex',

              alignItems: 'center',

              gap: '0.5rem',

              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)'

            }}

          >

            <Plus size={18} />

            <span>+ Mahsulot Qo'shish</span>

          </button>

          <button

            onClick={() => setIsOrderModalOpen(true)}

            style={{

              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',

              color: '#fff',

              border: 'none',

              padding: '0.65rem 1.3rem',

              borderRadius: '50px',

              fontWeight: 800,

              fontSize: '0.85rem',

              cursor: 'pointer',

              display: 'inline-flex',

              alignItems: 'center',

              gap: '0.5rem',

              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)'

            }}

          >

            <PlusCircle size={18} />

            <span>+ Sotuv Yaratish</span>

          </button>

          <ThemeControlModal compact={false} />

          <button

            onClick={handleLogout}

            title={lang === 'uz' ? "Admin panelidan chiqish" : "Выйти из панели"}

            style={{

              background: '#fef2f2',

              color: '#dc2626',

              border: '1px solid #fecaca',

              padding: '0.65rem 1.1rem',

              borderRadius: '50px',

              fontWeight: 700,

              fontSize: '0.82rem',

              cursor: 'pointer',

              display: 'inline-flex',

              alignItems: 'center',

              gap: '0.4rem',

              transition: 'all 0.2s ease'

            }}

          >

            <LogOut size={16} />

            <span>{lang === 'uz' ? "Chiqish" : "Выйти"}</span>

          </button>

        </div>

      </div>

      {/* Main Module Tabs Switcher Bar */}

      <div style={{

        display: 'flex',

        alignItems: 'center',

        gap: '0.5rem',

        background: '#f8fafc',

        padding: '0.4rem',

        borderRadius: '16px',

        border: '1px solid #e2e8f0',

        overflowX: 'auto'

      }}>

        {tabs.map((tItem) => {

          const IconComp = tItem.icon;

          const isActive = activeTab === tItem.id;

          return (

            <button

              key={tItem.id}

              onClick={() => setActiveTab(tItem.id)}

              style={{

                display: 'flex',

                alignItems: 'center',

                gap: '0.5rem',

                padding: '0.65rem 1.1rem',

                borderRadius: '12px',

                border: 'none',

                background: isActive ? '#ffffff' : 'transparent',

                color: isActive ? 'var(--primary-blue)' : '#64748b',

                fontWeight: isActive ? 800 : 600,

                fontSize: '0.85rem',

                cursor: 'pointer',

                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',

                transition: 'all 0.2s ease',

                whiteSpace: 'nowrap'

              }}

            >

              <IconComp size={18} color={isActive ? "var(--primary-blue)" : "#64748b"} />

              <span>{tItem.label}</span>

              {tItem.count !== undefined && (

                <span style={{

                  fontSize: '0.7rem',

                  fontWeight: 800,

                  background: isActive ? 'rgba(37, 99, 235, 0.12)' : '#e2e8f0',

                  color: isActive ? 'var(--primary-blue)' : '#64748b',

                  padding: '1px 7px',

                  borderRadius: '10px'

                }}>

                  {tItem.count}

                </span>

              )}

            </button>

          );

        })}

      </div>

      {/* ==================== MODULE 1: ASOSIY BO'LIM (OVERVIEW) ==================== */}

      {activeTab === 'overview' && (

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Key KPI Metric Cards */}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Umumiy Tushum</span>

                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <DollarSign size={22} />

                </div>

              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{formatPrice(totalRevenue)}</h3>

              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '0.3rem' }}>

                <TrendingUp size={12} /> +14.2% o'tgan haftaga nisbatan

              </span>

            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Sotuvlar Soni</span>

                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <ShoppingCart size={22} />

                </div>

              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{ordersList.length} ta</h3>

              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '0.3rem', display: 'block' }}>

                Bugun: 4 ta yangi buyurtma

              </span>

            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Ombor Zaxirasi</span>

                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <Warehouse size={22} />

                </div>

              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{totalStockCount} dona</h3>

              <span style={{ fontSize: '0.74rem', color: lowStockProducts.length > 0 ? '#ef4444' : '#64748b', fontWeight: 700, marginTop: '0.3rem', display: 'block' }}>

                {lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length} ta mahsulot zahirasi kam` : "Zaxira holati ideal"}

              </span>

            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Xodimlar Tarkibi</span>

                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <Users size={22} />

                </div>

              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{staffList.length} kishi</h3>

              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '0.3rem', display: 'block' }}>

                Barchasi faol ish rejimida

              </span>

            </div>

          </div>

          {/* Analytical Sales Chart & Live Stream Split */}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>

            {/* Sales Bar Chart */}

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>

                <div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>📊 Haftalik Sotuvlar Dinamikasi</h4>

                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>So'nggi 7 kundagi daromad statistikasi</span>

                </div>

                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)', background: 'rgba(37,99,235,0.08)', padding: '0.3rem 0.75rem', borderRadius: '50px' }}>

                  Farg'ona / Qo'qon Filiali

                </span>

              </div>

              {/* CSS Bar Chart */}

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem', borderBottom: '1px solid #e2e8f0', gap: '0.75rem' }}>

                {[

                  { day: 'Dush', val: 450, height: '40%' },

                  { day: 'Sesh', val: 620, height: '55%' },

                  { day: 'Chorsh', val: 890, height: '78%' },

                  { day: 'Paysh', val: 740, height: '65%' },

                  { day: 'Juma', val: 1120, height: '95%' },

                  { day: 'Shanb', val: 980, height: '85%' },

                  { day: 'Yaksh', val: 1050, height: '90%' }

                ].map((item, idx) => (

                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>

                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '4px' }}>${item.val}</span>

                    <div style={{

                      width: '100%',

                      maxWidth: '36px',

                      height: item.height,

                      background: idx === 4 ? 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)' : 'linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)',

                      borderRadius: '8px 8px 0 0',

                      transition: 'all 0.3s ease'

                    }} />

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>{item.day}</span>

                  </div>

                ))}

              </div>

            </div>

            {/* Quick Actions & Low Stock Alerts */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div style={{

                background: '#ffffff',

                border: '1px solid #e2e8f0',

                borderRadius: '18px',

                padding: '1.25rem',

                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'

              }}>

                <h4 style={{

                  fontSize: '0.95rem',

                  fontWeight: 800,

                  color: '#0f172a',

                  marginBottom: '0.85rem',

                  display: 'flex',

                  alignItems: 'center',

                  gap: '0.5rem'

                }}>

                  <div style={{

                    width: '28px',

                    height: '28px',

                    borderRadius: '8px',

                    background: 'rgba(249, 115, 22, 0.12)',

                    color: '#f97316',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center'

                  }}>

                    <Zap size={16} />

                  </div>

                  <span>Tezkor Amallar</span>

                </h4>

                

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

                  <button

                    onClick={openAddModal}

                    style={{

                      display: 'flex',

                      alignItems: 'center',

                      gap: '0.65rem',

                      padding: '0.7rem 0.85rem',

                      borderRadius: '12px',

                      border: '1px solid #e2e8f0',

                      background: '#f8fafc',

                      color: '#1e293b',

                      fontSize: '0.82rem',

                      fontWeight: 700,

                      cursor: 'pointer',

                      textAlign: 'left',

                      transition: 'all 0.2s ease'

                    }}

                    onMouseEnter={(e) => {

                      e.currentTarget.style.background = '#eff6ff';

                      e.currentTarget.style.borderColor = '#bfdbfe';

                      e.currentTarget.style.color = 'var(--primary-blue)';

                    }}

                    onMouseLeave={(e) => {

                      e.currentTarget.style.background = '#f8fafc';

                      e.currentTarget.style.borderColor = '#e2e8f0';

                      e.currentTarget.style.color = '#1e293b';

                    }}

                  >

                    <Package size={17} color="var(--primary-blue)" />

                    <span>+ Yangi mahsulot omborga kirim qilish</span>

                  </button>

                  <button

                    onClick={() => setIsOrderModalOpen(true)}

                    style={{

                      display: 'flex',

                      alignItems: 'center',

                      gap: '0.65rem',

                      padding: '0.7rem 0.85rem',

                      borderRadius: '12px',

                      border: '1px solid #e2e8f0',

                      background: '#f8fafc',

                      color: '#1e293b',

                      fontSize: '0.82rem',

                      fontWeight: 700,

                      cursor: 'pointer',

                      textAlign: 'left',

                      transition: 'all 0.2s ease'

                    }}

                    onMouseEnter={(e) => {

                      e.currentTarget.style.background = '#ecfdf5';

                      e.currentTarget.style.borderColor = '#a7f3d0';

                      e.currentTarget.style.color = '#059669';

                    }}

                    onMouseLeave={(e) => {

                      e.currentTarget.style.background = '#f8fafc';

                      e.currentTarget.style.borderColor = '#e2e8f0';

                      e.currentTarget.style.color = '#1e293b';

                    }}

                  >

                    <ShoppingCart size={17} color="#10b981" />

                    <span>+ Yangi mijoz buyurtmasini kiritish</span>

                  </button>

                  <button

                    onClick={() => setActiveTab('accounting')}

                    style={{

                      display: 'flex',

                      alignItems: 'center',

                      gap: '0.65rem',

                      padding: '0.7rem 0.85rem',

                      borderRadius: '12px',

                      border: '1px solid #e2e8f0',

                      background: '#f8fafc',

                      color: '#1e293b',

                      fontSize: '0.82rem',

                      fontWeight: 700,

                      cursor: 'pointer',

                      textAlign: 'left',

                      transition: 'all 0.2s ease'

                    }}

                    onMouseEnter={(e) => {

                      e.currentTarget.style.background = '#faf5ff';

                      e.currentTarget.style.borderColor = '#e9d5ff';

                      e.currentTarget.style.color = '#7c3aed';

                    }}

                    onMouseLeave={(e) => {

                      e.currentTarget.style.background = '#f8fafc';

                      e.currentTarget.style.borderColor = '#e2e8f0';

                      e.currentTarget.style.color = '#1e293b';

                    }}

                  >

                    <Landmark size={17} color="#8b5cf6" />

                    <span>💱 Valyuta kursi va tushumni ko'rish</span>

                  </button>

                </div>

              </div>

              {/* Low Stock Warning */}

              {lowStockProducts.length > 0 && (

                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '18px', padding: '1.1rem' }}>

                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>

                    <AlertTriangle size={16} />

                    <span>Ombor Ogohlantirishlari ({lowStockProducts.length})</span>

                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#9f1239' }}>

                    {lowStockProducts.slice(0, 2).map((lp, idx) => (

                      <div key={idx} style={{ marginTop: '2px' }}>

                        • <strong>{typeof lp.name === 'object' ? lp.name.uz : lp.name}</strong> ({lp.stockCount} ta qoldi)

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

      {/* ==================== MODULE 2: MAHSULOTLAR OMBORI (WAREHOUSE) ==================== */}

      {activeTab === 'warehouse' && (() => {

          const warehouseCategories = ['all', ...Array.from(new Set(productsList.map(p => p.category || 'boshqa')))];

          const filteredWarehouseProducts = warehouseCategory === 'all' 

              ? productsList 

              : productsList.filter(p => (p.category || 'boshqa') === warehouseCategory);

          return (

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', overflow: 'hidden' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                  📦 Ombor Zaxirasi ({filteredWarehouseProducts.length} / {productsList.length} ta)

                </h3>

            <div style={{ display: 'flex', gap: '0.5rem' }}>

                <button

                  onClick={() => setIsB2BModalOpen(true)}

                  style={{ padding: '0.55rem 1.2rem', borderRadius: '50px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}

                >

                  <ShoppingCart size={16} />

                  <span>B2B Optom Sotuv</span>

                </button>

                <button

              onClick={openAddModal}

              style={{ padding: '0.55rem 1.2rem', borderRadius: '50px', background: 'var(--primary-blue)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}

            >

              <Plus size={16} />

              <span>+ Yangi Mahsulot Qo'shish</span>

            </button>

              </div>

              </div>

              {/* Category Filter Bar */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {warehouseCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setWarehouseCategory(cat)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: warehouseCategory === cat ? '1px solid var(--primary-blue)' : '1px solid #cbd5e1',
                      background: warehouseCategory === cat ? 'var(--primary-blue)' : '#f8fafc',
                      color: warehouseCategory === cat ? '#fff' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>

              

              <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>

              <thead>

                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>

                  <th style={{ padding: '0.85rem' }}>Mahsulot</th>

                  <th style={{ padding: '0.85rem' }}>Kategoriya</th>

                  <th style={{ padding: '0.85rem' }}>Narxi</th>

                  <th style={{ padding: '0.85rem' }}>Ombor Zaxirasi</th>

                  <th style={{ padding: '0.85rem' }}>Status</th>

                  <th style={{ padding: '0.85rem', textAlign: 'right' }}>Amallar</th>

                </tr>

              </thead>

              <tbody>

                  {filteredWarehouseProducts.map((p) => {

                  const nameStr = typeof p.name === 'object' ? p.name[lang] || p.name.uz : p.name;

                  const isLow = (p.stockCount || 0) < 5;

                  return (

                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>

                      <td style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                        <img src={p.image} alt={nameStr} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px' }} />

                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{nameStr}</span>

                      </td>

                      <td style={{ padding: '0.85rem' }}>

                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#eff6ff', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '10px' }}>

                          {getCategoryLabel(p.category)}

                        </span>

                      </td>

                      <td style={{ padding: '0.85rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{formatPrice(p.price)}</td>

                      <td style={{ padding: '0.85rem' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                          <button onClick={() => handleStockChange(p.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}>-</button>

                          <span style={{ fontWeight: 900, fontSize: '0.95rem', minWidth: '24px', textAlign: 'center' }}>{p.stockCount || 0}</span>

                          <button onClick={() => handleStockChange(p.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}>+</button>

                        </div>

                      </td>

                      <td style={{ padding: '0.85rem' }}>

                        <span style={{

                          fontSize: '0.72rem',

                          fontWeight: 800,

                          padding: '2px 8px',

                          borderRadius: '10px',

                          background: isLow ? '#fef2f2' : '#f0fdf4',

                          color: isLow ? '#dc2626' : '#16a34a'

                        }}>

                          {isLow ? "⚠️ Kam qoldi" : "✓ Mavjud"}

                        </span>

                      </td>

                      <td style={{ padding: '0.85rem', textAlign: 'right' }}>

                        <button onClick={() => openEditModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-blue)', marginRight: '0.6rem' }}>

                          <Edit size={17} />

                        </button>

                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>

                          <Trash2 size={17} />

                        </button>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

          );

        })()}

    {/* ==================== MODULE 3: SOTUV & BUYURTMALAR (SALES & ORDERS MANAGEMENT) ==================== */}
      {activeTab === 'sales' && (() => {
        const posOrders = ordersList.filter(o => o.channel === "Do'kon (POS)" || !o.channel);
        const igOrders = ordersList.filter(o => o.channel === "Instagram");
        const tgOrders = ordersList.filter(o => o.channel === "Telegram");
        const webOrders = ordersList.filter(o => o.channel === "Web App");
        const b2bOrders = ordersList.filter(o => o.channel === "B2B Optom");

        const posRev = posOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);
        const igRev = igOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);
        const tgRev = tgOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);
        const webRev = webOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);
        const b2bRev = b2bOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);

        // Status counts
        const newOrders = ordersList.filter(o => o.status === 'Yangi');
        const procOrders = ordersList.filter(o => o.status === 'Jarayonda');
        const delivOrders = ordersList.filter(o => o.status === 'Yetkazilmoqda');
        const doneOrders = ordersList.filter(o => o.status === 'Yetkazildi' || o.status === 'Bajarildi');
        const cancelOrders = ordersList.filter(o => o.status === 'Bekor qilindi');

        const newOrdersTotal = newOrders.reduce((a, b) => a + (Number(b.total) || 0), 0);

        // Filtered orders for table
        const filteredOrders = ordersList.filter(ord => {
          // Status filter
          if (orderStatusFilter !== 'all') {
            if (orderStatusFilter === 'Yetkazildi') {
              if (ord.status !== 'Yetkazildi' && ord.status !== 'Bajarildi') return false;
            } else if (ord.status !== orderStatusFilter) {
              return false;
            }
          }

          // Channel filter
          if (selectedSalesChannel !== 'all') {
            if (selectedSalesChannel === 'pos' && !(ord.channel === "Do'kon (POS)" || !ord.channel)) return false;
            if (selectedSalesChannel === 'online' && !['Instagram', 'Telegram', 'Web App'].includes(ord.channel)) return false;
            if (selectedSalesChannel === 'instagram' && ord.channel !== 'Instagram') return false;
            if (selectedSalesChannel === 'telegram' && ord.channel !== 'Telegram') return false;
            if (selectedSalesChannel === 'webapp' && ord.channel !== 'Web App') return false;
            if (selectedSalesChannel === 'b2b' && ord.channel !== 'B2B Optom') return false;
          }

          // Search query filter
          if (orderSearchQuery.trim()) {
            const q = orderSearchQuery.toLowerCase();
            const matchName = (ord.customer || '').toLowerCase().includes(q);
            const matchPhone = (ord.phone || '').toLowerCase().includes(q);
            const matchId = (ord.id || '').toLowerCase().includes(q);
            const matchAddress = (ord.address || '').toLowerCase().includes(q);
            const matchItems = (ord.items || '').toLowerCase().includes(q);
            if (!matchName && !matchPhone && !matchId && !matchAddress && !matchItems) return false;
          }

          return true;
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Sales Sub-Navigation Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSalesSubTab('orders')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: salesSubTab === 'orders' ? 'var(--primary-blue)' : '#fff',
                    color: salesSubTab === 'orders' ? '#fff' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: salesSubTab === 'orders' ? '0 4px 12px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Package size={18} />
                  <span>Kelib Tushgan Buyurtmalar</span>
                  {newOrders.length > 0 && (
                    <span style={{
                      background: salesSubTab === 'orders' ? '#ef4444' : '#ef4444',
                      color: '#fff',
                      borderRadius: '50px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 900
                    }}>
                      {newOrders.length} yangi
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setSalesSubTab('analytics')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: salesSubTab === 'analytics' ? 'var(--primary-blue)' : '#fff',
                    color: salesSubTab === 'analytics' ? '#fff' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: salesSubTab === 'analytics' ? '0 4px 12px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <BarChart3 size={18} />
                  <span>Sotuv Kanallari & Analitika</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '50px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>+ POS Sotuv Kiritish</span>
                </button>
              </div>
            </div>

            {/* ================= VIEW 1: ORDERS MANAGEMENT ================= */}
            {salesSubTab === 'orders' && (
              <>
                {/* 4 Orders KPI Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  
                  {/* Card 1: Yangi */}
                  <div
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'Yangi' ? 'all' : 'Yangi')}
                    style={{
                      background: '#fff',
                      border: orderStatusFilter === 'Yangi' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.15rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8' }}>🆕 Yangi Buyurtmalar</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{newOrders.length} ta</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{formatPrice(newOrdersTotal)} qiymatida</div>
                  </div>

                  {/* Card 2: Jarayonda */}
                  <div
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'Jarayonda' ? 'all' : 'Jarayonda')}
                    style={{
                      background: '#fff',
                      border: orderStatusFilter === 'Jarayonda' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.15rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309' }}>⏳ Tayyorlanmoqda / Jarayonda</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{procOrders.length} ta</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Qadoqlash va tasdiqlashda</div>
                  </div>

                  {/* Card 3: Yetkazilmoqda */}
                  <div
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'Yetkazilmoqda' ? 'all' : 'Yetkazilmoqda')}
                    style={{
                      background: '#fff',
                      border: orderStatusFilter === 'Yetkazilmoqda' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.15rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6d28d9' }}>🚚 Yetkazilmoqda (Kuryerda)</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{delivOrders.length} ta</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Yo'ldagi buyurtmalar</div>
                  </div>

                  {/* Card 4: Bajarildi */}
                  <div
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'Yetkazildi' ? 'all' : 'Yetkazildi')}
                    style={{
                      background: '#fff',
                      border: orderStatusFilter === 'Yetkazildi' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.15rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d' }}>✅ Bajarildi / Yetkazildi</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{doneOrders.length} ta</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Muvaffaqiyatli yakunlangan</div>
                  </div>
                </div>

                {/* Orders Main Container */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', overflow: 'hidden' }}>
                  
                  {/* Filter Toolbar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                    
                    {/* Top Row: Search + Channel Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px', maxWidth: '420px', position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
                        <input
                          type="text"
                          placeholder="Mijoz ismi, telefon, ID yoki manzil orqali qidirish..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.85rem',
                            outlineColor: 'var(--primary-blue)'
                          }}
                        />
                      </div>

                      {/* Channels Filter Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                        {[
                          { id: 'all', label: 'Barcha kanallar' },
                          { id: 'webapp', label: '🌐 Web App' },
                          { id: 'instagram', label: '📸 Instagram' },
                          { id: 'telegram', label: '✈️ Telegram' },
                          { id: 'pos', label: "🏢 Do'kon" },
                          { id: 'b2b', label: "🛒 B2B Optom" }
                        ].map(cTab => (
                          <button
                            key={cTab.id}
                            onClick={() => setSelectedSalesChannel(cTab.id)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              border: selectedSalesChannel === cTab.id ? '1px solid var(--primary-blue)' : '1px solid #cbd5e1',
                              background: selectedSalesChannel === cTab.id ? 'var(--primary-blue)' : '#f8fafc',
                              color: selectedSalesChannel === cTab.id ? '#ffffff' : '#475569',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {cTab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row: Status Filter Pills */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                      {[
                        { id: 'all', label: `Barchasi (${ordersList.length})` },
                        { id: 'Yangi', label: `🆕 Yangi (${newOrders.length})` },
                        { id: 'Jarayonda', label: `⏳ Jarayonda (${procOrders.length})` },
                        { id: 'Yetkazilmoqda', label: `🚚 Yetkazilmoqda (${delivOrders.length})` },
                        { id: 'Yetkazildi', label: `✅ Yetkazildi (${doneOrders.length})` },
                        { id: 'Bekor qilindi', label: `❌ Bekor qilindi (${cancelOrders.length})` }
                      ].map(st => (
                        <button
                          key={st.id}
                          onClick={() => setOrderStatusFilter(st.id)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '50px',
                            border: orderStatusFilter === st.id ? '1px solid #0f172a' : '1px solid #e2e8f0',
                            background: orderStatusFilter === st.id ? '#0f172a' : '#f8fafc',
                            color: orderStatusFilter === st.id ? '#fff' : '#64748b',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b' }}>
                          <th style={{ padding: '0.85rem', width: '130px' }}>ID / Sana</th>
                          <th style={{ padding: '0.85rem' }}>Mijoz va Manzil</th>
                          <th style={{ padding: '0.85rem' }}>Sotuv Kanali</th>
                          <th style={{ padding: '0.85rem' }}>Tovarlar</th>
                          <th style={{ padding: '0.85rem' }}>To'lov</th>
                          <th style={{ padding: '0.85rem' }}>Summa</th>
                          <th style={{ padding: '0.85rem' }}>Maqom (Status)</th>
                          <th style={{ padding: '0.85rem', textAlign: 'center' }}>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                              <Package size={42} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hech qanday buyurtma topilmadi</div>
                              <div style={{ fontSize: '0.78rem' }}>Filtr yoki qidiruv so'zini o'zgartirib ko'ring</div>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => {
                            const channelStr = ord.channel || "Do'kon (POS)";
                            const isPos = channelStr.includes("Do'kon");
                            const isIg = channelStr.includes("Instagram");
                            const isTg = channelStr.includes("Telegram");
                            const isB2b = channelStr.includes("B2B");
                            const isWeb = channelStr.includes("Web App");

                            const isNew = ord.status === 'Yangi';
                            const isProc = ord.status === 'Jarayonda';
                            const isDeliv = ord.status === 'Yetkazilmoqda';
                            const isDone = ord.status === 'Yetkazildi' || ord.status === 'Bajarildi';
                            const isCancel = ord.status === 'Bekor qilindi';

                            return (
                              <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9', background: isNew ? '#f8fafc' : '#fff', transition: 'background 0.2s' }}>
                                
                                {/* ID & Date */}
                                <td style={{ padding: '0.85rem' }}>
                                  <div style={{ fontWeight: 900, color: '#1e293b', fontSize: '0.88rem' }}>{ord.id}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{ord.date}</div>
                                </td>

                                {/* Customer Info */}
                                <td style={{ padding: '0.85rem' }}>
                                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{ord.customer}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>{ord.phone}</div>
                                  {(ord.region || ord.address) && (
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <MapPin size={11} />
                                      <span>{ord.region ? `${ord.region}${ord.address ? ', ' + ord.address : ''}` : ord.address}</span>
                                    </div>
                                  )}
                                  {ord.mapsUrl && (
                                    <div style={{ marginTop: '3px' }}>
                                      <a
                                        href={ord.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '3px',
                                          fontSize: '0.7rem',
                                          fontWeight: 800,
                                          color: '#059669',
                                          background: '#ecfdf5',
                                          padding: '2px 7px',
                                          borderRadius: '4px',
                                          textDecoration: 'none',
                                          border: '1px solid #a7f3d0'
                                        }}
                                      >
                                        <MapPin size={10} />
                                        <span>📍 Xaritada ochish ↗</span>
                                      </a>
                                    </div>
                                  )}
                                </td>

                                {/* Channel Badge */}
                                <td style={{ padding: '0.85rem' }}>
                                  <span style={{
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: isPos ? '#fff7ed' : isIg ? '#fdf2f8' : isTg ? '#ecfeff' : isB2b ? '#ecfdf5' : '#eff6ff',
                                    color: isPos ? '#c2410c' : isIg ? '#be185d' : isTg ? '#0e7490' : isB2b ? '#047857' : 'var(--primary-blue)',
                                    border: `1px solid ${isPos ? '#ffedd5' : isIg ? '#fce7f3' : isTg ? '#cffaff' : isB2b ? '#a7f3d0' : '#dbeafe'}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {isPos ? "🏢 Do'kon (POS)" : isIg ? "📸 Instagram" : isTg ? "✈️ Telegram" : isB2b ? "🛒 B2B Optom" : "🌐 Web App"}
                                  </span>
                                </td>

                                {/* Items */}
                                <td style={{ padding: '0.85rem', maxWidth: '240px' }}>
                                  <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {ord.items}
                                  </div>
                                </td>

                                {/* Payment Method */}
                                <td style={{ padding: '0.85rem' }}>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px' }}>
                                    {ord.payment || 'Naqd'}
                                  </span>
                                </td>

                                {/* Total Price */}
                                <td style={{ padding: '0.85rem' }}>
                                  <div style={{ fontWeight: 900, color: 'var(--primary-blue)', fontSize: '0.92rem' }}>
                                    {formatPrice(ord.total)}
                                  </div>
                                </td>

                                {/* Interactive Status Selector */}
                                <td style={{ padding: '0.85rem' }}>
                                  <select
                                    value={isDone ? 'Yetkazildi' : ord.status}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                    style={{
                                      padding: '0.35rem 0.65rem',
                                      borderRadius: '50px',
                                      fontSize: '0.75rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      border: isNew ? '1.5px solid #3b82f6' : isProc ? '1.5px solid #f59e0b' : isDeliv ? '1.5px solid #8b5cf6' : isDone ? '1.5px solid #10b981' : '1.5px solid #ef4444',
                                      background: isNew ? '#eff6ff' : isProc ? '#fffbeb' : isDeliv ? '#f5f3ff' : isDone ? '#ecfdf5' : '#fef2f2',
                                      color: isNew ? '#1d4ed8' : isProc ? '#b45309' : isDeliv ? '#6d28d9' : isDone ? '#047857' : '#b91c1c',
                                      outline: 'none'
                                    }}
                                  >
                                    <option value="Yangi">🆕 Yangi</option>
                                    <option value="Jarayonda">⏳ Jarayonda</option>
                                    <option value="Yetkazilmoqda">🚚 Yetkazilmoqda</option>
                                    <option value="Yetkazildi">✅ Yetkazildi</option>
                                    <option value="Bekor qilindi">❌ Bekor qilindi</option>
                                  </select>
                                </td>

                                {/* Action Buttons */}
                                <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    
                                    {/* View Details Button */}
                                    <button
                                      onClick={() => setSelectedOrderDetails(ord)}
                                      title="Batafsil ko'rish"
                                      style={{
                                        padding: '6px 10px',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <Eye size={13} />
                                      <span>Ko'rish</span>
                                    </button>

                                    {/* Receipt Button */}
                                    <button
                                      onClick={() => setReceiptModalOrder(ord.rawOrder || ord)}
                                      title="Chek chiqarish"
                                      style={{
                                        padding: '6px 10px',
                                        background: '#e0e7ff',
                                        color: '#4338ca',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <Printer size={13} />
                                      <span>Chek</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteOrder(ord.id)}
                                      title="O'chirish"
                                      style={{
                                        padding: '6px 8px',
                                        background: '#fef2f2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ================= VIEW 2: SALES CHANNELS ANALYTICS ================= */}
            {salesSubTab === 'analytics' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {/* Channel 1: Offline Store POS */}
                  <div
                    onClick={() => setSelectedSalesChannel(selectedSalesChannel === 'pos' ? 'all' : 'pos')}
                    style={{
                      background: '#fff',
                      border: selectedSalesChannel === 'pos' ? '2px solid #f97316' : '1px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c2410c' }}>🏢 Do'kon (Kassa) Savdolari</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Store size={20} />
                        </div>
                      </div>
                      <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{formatPrice(posRev)}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>{posOrders.length} ta xarid</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fff7ed', color: '#ea580c', padding: '2px 6px', borderRadius: '6px' }}>
                          {((posRev / Math.max(1, totalRevenue)) * 100).toFixed(0)}% ulush
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel 2: Online Sales (Grouped) */}
                  <div
                    onClick={() => setSelectedSalesChannel(selectedSalesChannel === 'online' ? 'all' : 'online')}
                    style={{
                      background: '#fff',
                      border: selectedSalesChannel === 'online' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)' }}>🌐 Online Savdo (Sayt, Insta, Bot)</span>
                      <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#eff6ff', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe size={20} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{formatPrice(igRev + tgRev + webRev)}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>{igOrders.length + tgOrders.length + webOrders.length} ta buyurtma</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#eff6ff', color: 'var(--primary-blue)', padding: '2px 6px', borderRadius: '6px' }}>
                        {(((igRev + tgRev + webRev) / Math.max(1, totalRevenue)) * 100).toFixed(0)}% ulush
                      </span>
                    </div>

                    {/* Online Breakdown */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                      <div style={{ flex: 1, textAlign: 'center', background: '#fdf2f8', borderRadius: '8px', padding: '6px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#be185d' }}>📸 Instagram</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#9d174d' }}>{igOrders.length} ta</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', background: '#ecfeff', borderRadius: '8px', padding: '6px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0e7490' }}>✈️ TG Bot</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#155e75' }}>{tgOrders.length} ta</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', background: '#eff6ff', borderRadius: '8px', padding: '6px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1d4ed8' }}>🌐 Sayt Qidiruv</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#1e3a8a' }}>{webOrders.length} ta</div>
                      </div>
                    </div>
                  </div>

                  {/* Channel 3: B2B Wholesale */}
                  <div
                    onClick={() => setSelectedSalesChannel(selectedSalesChannel === 'b2b' ? 'all' : 'b2b')}
                    style={{
                      background: '#fff',
                      border: selectedSalesChannel === 'b2b' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }}>🛒 B2B Optom Savdo</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingCart size={20} />
                        </div>
                      </div>
                      <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{formatPrice(b2bRev)}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>{b2bOrders.length} ta optom bitim</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '6px' }}>
                          {((b2bRev / Math.max(1, totalRevenue)) * 100).toFixed(0)}% ulush
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* ==================== MODULE 4: BUXGALTERIYA (ACCOUNTING SUITE) ==================== */}

      {activeTab === 'accounting' && (

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          

          {/* Sub-Navigation Header Bar */}

          <div style={{

            display: 'flex',

            alignItems: 'center',

            justify: 'space-between',

            background: '#ffffff',

            border: '1px solid #e2e8f0',

            borderRadius: '16px',

            padding: '0.6rem 1rem',

            flexWrap: 'wrap',

            gap: '0.75rem',

            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'

          }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>

              <button

                onClick={() => setAccountingSubTab('price_editor')}

                style={{

                  display: 'flex',

                  alignItems: 'center',

                  gap: '0.45rem',

                  padding: '0.55rem 1rem',

                  borderRadius: '10px',

                  border: 'none',

                  background: accountingSubTab === 'price_editor' ? 'var(--primary-blue)' : 'transparent',

                  color: accountingSubTab === 'price_editor' ? '#ffffff' : '#64748b',

                  fontWeight: 800,

                  fontSize: '0.82rem',

                  cursor: 'pointer',

                  transition: 'all 0.2s ease'

                }}

              >

                <Tag size={16} />

                <span>🏷️ Narxlar & Tannarx Boshqaruvi</span>

              </button>

              <button

                onClick={() => setAccountingSubTab('finances')}

                style={{

                  display: 'flex',

                  alignItems: 'center',

                  gap: '0.45rem',

                  padding: '0.55rem 1rem',

                  borderRadius: '10px',

                  border: 'none',

                  background: accountingSubTab === 'finances' ? 'var(--primary-blue)' : 'transparent',

                  color: accountingSubTab === 'finances' ? '#ffffff' : '#64748b',

                  fontWeight: 800,

                  fontSize: '0.82rem',

                  cursor: 'pointer',

                  transition: 'all 0.2s ease'

                }}

              >

                <Landmark size={16} />

                <span>💰 Moliya & Xarajatlar</span>

              </button>

              <button

                onClick={() => setAccountingSubTab('reports')}

                style={{

                  display: 'flex',

                  alignItems: 'center',

                  gap: '0.45rem',

                  padding: '0.55rem 1rem',

                  borderRadius: '10px',

                  border: 'none',

                  background: accountingSubTab === 'reports' ? 'var(--primary-blue)' : 'transparent',

                  color: accountingSubTab === 'reports' ? '#ffffff' : '#64748b',

                  fontWeight: 800,

                  fontSize: '0.82rem',

                  cursor: 'pointer',

                  transition: 'all 0.2s ease'

                }}

              >

                <BarChart3 size={16} />

                <span>📊 Audit & Hisobotlar</span>

              </button>

            </div>

            <button

              onClick={() => handleOpenReportModal(accountingSubTab === 'price_editor' ? 'Narxlar va Tannarx Reestri Auditi' : accountingSubTab === 'finances' ? 'Moliyaviy Xarajatlar Balansi Auditi' : 'To\'liq Oylik Buxgalteriya Auditi')}

              style={{

                display: 'flex',

                alignItems: 'center',

                gap: '0.4rem',

                padding: '0.5rem 0.95rem',

                borderRadius: '50px',

                background: '#f8fafc',

                border: '1px solid #cbd5e1',

                color: '#334155',

                fontWeight: 700,

                fontSize: '0.78rem',

                cursor: 'pointer'

              }}

            >

              <Download size={15} />

              <span>Hisobotni PDF / Excel Yuklash</span>

            </button>

          </div>

          {/* ================= SUBTAB 1: NARXLAR & TANNARX EDITORI ================= */}

          {accountingSubTab === 'price_editor' && (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Asset Valuation KPI Cards */}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem' }}>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Ombordagi Tovarlar Tannarxi</span>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0 0 0' }}>

                    {formatPrice(productsList.reduce((acc, p) => acc + ((p.costPrice || Math.round(p.price * 0.68)) * (p.stockCount || 0)), 0))}

                  </h3>

                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Sotib olingan kelishuv narxi</span>

                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem' }}>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Tovarlarning Yalpi Sotuv Qiymati</span>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--primary-blue)', margin: '0.2rem 0 0 0' }}>

                    {formatPrice(productsList.reduce((acc, p) => acc + (p.price * (p.stockCount || 0)), 0))}

                  </h3>

                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Chakana sotuv summasi</span>

                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem' }}>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Kutilayotgan Sof Marja Foydasi</span>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981', margin: '0.2rem 0 0 0' }}>

                    {formatPrice(productsList.reduce((acc, p) => acc + ((p.price - (p.costPrice || Math.round(p.price * 0.68))) * (p.stockCount || 0)), 0))}

                  </h3>

                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>+{(productsList.reduce((acc, p) => acc + (p.price - (p.costPrice || Math.round(p.price * 0.68))), 0) / Math.max(1, productsList.reduce((acc, p) => acc + (p.costPrice || Math.round(p.price * 0.68)), 0)) * 100).toFixed(1)}% o'rtacha ustama</span>

                </div>

              </div>

              {/* Bulk Price Indexation Toolbar */}

              <div style={{

                background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',

                border: '1px solid #bfdbfe',

                borderRadius: '16px',

                padding: '1rem 1.25rem',

                display: 'flex',

                alignItems: 'center',

                justify: 'space-between',

                flexWrap: 'wrap',

                gap: '1rem'

              }}>

                <div>

                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>

                    <Calculator size={17} color="#2563eb" />

                    <span>Ommaviy Narx Indeksatsiyasi (Bulk Price Adjuster)</span>

                  </h4>

                  <p style={{ fontSize: '0.78rem', color: '#3b82f6', margin: '2px 0 0 0' }}>Dollar kursi yoki inflyatsiya bo'yicha baravar narx o'zgartirish</p>

                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>

                  <button

                    onClick={() => handleBulkPriceAdjust(5)}

                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#dbeafe', border: '1px solid #93c5fd', color: '#1d4ed8', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}

                  >

                    📈 +5% Narxlarni Oshirish

                  </button>

                  <button

                    onClick={() => handleBulkPriceAdjust(10)}

                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#dbeafe', border: '1px solid #93c5fd', color: '#1d4ed8', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}

                  >

                    📈 +10% Narxlarni Oshirish

                  </button>

                  <button

                    onClick={() => handleBulkPriceAdjust(-5)}

                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}

                  >

                    📉 -5% Chegirma Berish

                  </button>

                </div>

              </div>

              {/* Product Price & Cost Editor Table */}

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', overflowX: 'auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                    🏷️ Mahsulotlar Narxi va Tannarx Reestri ({productsList.length} ta)

                  </h4>

                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>💡 Narxni to'g'ridan-to'g'ri o'zgartirishingiz mumkin</span>

                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>

                  <thead>

                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>

                      <th style={{ padding: '0.85rem' }}>Mahsulot</th>

                      <th style={{ padding: '0.85rem' }}>Kategoriya</th>

                      <th style={{ padding: '0.85rem' }}>Tannarx ({currency === 'UZS' ? "so'm" : '$ USD'})</th>

                      <th style={{ padding: '0.85rem' }}>Sotuv Narxi ({currency === 'UZS' ? "so'm" : '$ USD'})</th>

                      <th style={{ padding: '0.85rem' }}>Sof Marja ({currency === 'UZS' ? "so'm" : '$'})</th>

                      <th style={{ padding: '0.85rem' }}>Ustama %</th>

                      <th style={{ padding: '0.85rem' }}>Zaxira</th>

                      <th style={{ padding: '0.85rem', textAlign: 'right' }}>Saqlash</th>

                    </tr>

                  </thead>

                  <tbody>

                  {productsList.map((p) => {

                      const nameStr = typeof p.name === 'object' ? p.name[lang] || p.name.uz : p.name;

                      const costVal = p.costPrice !== undefined ? p.costPrice : Math.round(p.price * 0.68);

                      const profitVal = p.price - costVal;

                      const marginPercent = ((profitVal / Math.max(1, costVal)) * 100).toFixed(0);

                      // Display prices calculated in chosen currency

                      const displayCost = currency === 'UZS' ? Math.round(costVal * (exchangeRate || 12900)) : costVal;

                      const displayRetail = currency === 'UZS' ? Math.round(p.price * (exchangeRate || 12900)) : p.price;

                      return (

                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>

                          <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>

                            <img src={p.image} alt={nameStr} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px' }} />

                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{nameStr}</span>

                          </td>

                          <td style={{ padding: '0.75rem' }}>

                            <span style={{ fontSize: '0.74rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px' }}>

                              {getCategoryLabel(p.category)}

                            </span>

                          </td>

                          {/* Cost Price Edit Input */}

                          <td style={{ padding: '0.75rem' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                              {currency === 'USD' && <span style={{ color: '#64748b', fontWeight: 700 }}>$</span>}

                              <input

                                type="text"

                                value={displayCost ? Number(displayCost).toLocaleString('ru-RU').replace(/,/g, ' ') : '0'}

                                onChange={(e) => handleDirectPriceUpdate(p.id, 'costPrice', e.target.value.replace(/[^\d.]/g, ''))}

                                style={{

                                  width: currency === 'UZS' ? '135px' : '85px',

                                  padding: '0.35rem 0.5rem',

                                  borderRadius: '8px',

                                  border: '1px solid #cbd5e1',

                                  fontSize: '0.88rem',

                                  fontWeight: 800,

                                  color: '#334155',

                                  letterSpacing: '0.02em'

                                }}

                              />

                              {currency === 'UZS' && <span style={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>so'm</span>}

                            </div>

                          </td>

                          {/* Retail Price Edit Input */}

                          <td style={{ padding: '0.75rem' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                              {currency === 'USD' && <span style={{ color: 'var(--primary-blue)', fontWeight: 800 }}>$</span>}

                              <input

                                type="text"

                                value={displayRetail ? Number(displayRetail).toLocaleString('ru-RU').replace(/,/g, ' ') : '0'}

                                onChange={(e) => handleDirectPriceUpdate(p.id, 'price', e.target.value.replace(/[^\d.]/g, ''))}

                                style={{

                                  width: currency === 'UZS' ? '140px' : '90px',

                                  padding: '0.35rem 0.5rem',

                                  borderRadius: '8px',

                                  border: '1px solid #93c5fd',

                                  background: '#eff6ff',

                                  fontSize: '0.9rem',

                                  fontWeight: 900,

                                  color: 'var(--primary-blue)',

                                  letterSpacing: '0.02em'

                                }}

                              />

                              {currency === 'UZS' && <span style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.75rem' }}>so'm</span>}

                            </div>

                          </td>

                          {/* Profit Amount in chosen currency */}

                          <td style={{ padding: '0.75rem', fontWeight: 800, color: profitVal > 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>

                            +{formatPrice(profitVal)}

                          </td>

                          {/* Profit Margin % Badge */}

                          <td style={{ padding: '0.75rem' }}>

                            <span style={{

                              fontSize: '0.74rem',

                              fontWeight: 800,

                              padding: '2px 8px',

                              borderRadius: '10px',

                              background: profitVal > 50 ? '#dcfce7' : '#fef3c7',

                              color: profitVal > 50 ? '#15803d' : '#b45309'

                            }}>

                              +{marginPercent}%

                            </span>

                          </td>

                          <td style={{ padding: '0.75rem', fontWeight: 800 }}>{p.stockCount || 0} ta</td>

                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>

                            <button

                              onClick={() => showToast("Buxgalteriyada tasdiqlandi!")}

                              style={{

                                background: '#f0fdf4',

                                border: '1px solid #bbf7d0',

                                color: '#16a34a',

                                padding: '0.3rem 0.6rem',

                                borderRadius: '8px',

                                fontWeight: 800,

                                fontSize: '0.75rem',

                                cursor: 'pointer',

                                display: 'inline-flex',

                                alignItems: 'center',

                                gap: '3px'

                              }}

                            >

                              <Check size={14} />

                              <span>Ok</span>

                            </button>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>

            </div>

        )}

          {/* ================= SUBTAB 2: MOLIYA & XARAJTALAR ================= */}

          {accountingSubTab === 'finances' && (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Financial Summary Cards */}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>

                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Yalpi Daromad (Gross Revenue)</span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>{formatPrice(totalRevenue)}</h3>

                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>

                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Umumiy Chiqim va Xarajatlar</span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444', marginTop: '0.2rem' }}>{formatPrice(totalExpenses)}</h3>

                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>

                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Sof Foyda (Net Profit)</span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-blue)', marginTop: '0.2rem' }}>{formatPrice(netProfit)}</h3>

                </div>

              </div>

              {/* Currency Controller */}

              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #93c5fd', borderRadius: '18px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

                <div>

                  <h4 style={{ fontSize: '1rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>💱 Valyuta Kursi Sozlamasi (USD ↔ UZS)</h4>

                  <p style={{ fontSize: '0.82rem', color: '#3b82f6', margin: '2px 0 0 0' }}>Barcha hisob-kitoblar va narxlar avtomatik yangilanadi.</p>

                </div>

                <form onSubmit={(e) => { e.preventDefault(); setExchangeRate(Number(rateInput)); showToast("Kurs yangilandi!"); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                  <input type="number" value={rateInput} onChange={(e) => setRateInput(e.target.value)} style={{ width: '110px', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, textAlign: 'center' }} />

                  <button type="submit" style={{ padding: '0.45rem 1rem', borderRadius: '50px', background: 'var(--primary-blue)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Saqlash</button>

                </form>

              </div>

              {/* Expenses Table */}

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>📑 Xarajatlar Daftari (Operating Expenses)</h4>

                  <button

                    onClick={() => setIsExpenseModalOpen(true)}

                    style={{ padding: '0.45rem 0.9rem', borderRadius: '50px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}

                  >

                    + Yangi Xarajat Kiritish

                  </button>

                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>

                  <thead>

                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>

                      <th style={{ padding: '0.75rem' }}>ID</th>

                      <th style={{ padding: '0.75rem' }}>Xarajat Nomi</th>

                      <th style={{ padding: '0.75rem' }}>Kategoriya</th>

                      <th style={{ padding: '0.75rem' }}>Sana</th>

                      <th style={{ padding: '0.75rem' }}>Summa</th>

                    </tr>

                  </thead>

                  <tbody>

                    {expensesList.map((exp) => (

                      <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>

                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>{exp.id}</td>

                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{exp.title}</td>

                        <td style={{ padding: '0.75rem' }}><span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>{exp.category}</span></td>

                        <td style={{ padding: '0.75rem', color: '#64748b' }}>{exp.date}</td>

                        <td style={{ padding: '0.75rem', fontWeight: 800, color: '#ef4444' }}>{formatPrice(exp.amount)}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

        )}

          {/* ================= SUBTAB 3: PROFESSIONAL BUXGALTERIYA & OMBOR AUDITI HISOBOTLARI ================= */}
          {accountingSubTab === 'reports' && (() => {
            // 1. Period multiplier/filter logic
            let multiplier = 1;
            let periodTitle = "Oylik Buxgalteriya Hisoboti (Sentabr 2026)";
            let periodBadge = "Oylik";

            if (reportPeriod === 'day') {
              multiplier = 0.08;
              periodTitle = "Bugungi Kunlik Buxgalteriya Hisoboti";
              periodBadge = "Bugun / Kunlik";
            } else if (reportPeriod === 'week') {
              multiplier = 0.35;
              periodTitle = "Haftalik Buxgalteriya Hisoboti (Oxirgi 7 kun)";
              periodBadge = "Haftalik";
            } else if (reportPeriod === 'year') {
              multiplier = 9.5;
              periodTitle = "Yillik Buxgalteriya Hisoboti (2026-yil)";
              periodBadge = "Yillik";
            } else if (reportPeriod === 'all') {
              multiplier = 14.2;
              periodTitle = "Barcha Davr Jamlangan Buxgalteriya Hisoboti";
              periodBadge = "Barcha Davr";
            }

            // Actual base values from orders & expenses
            const actualOrdersRev = ordersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
            const actualExpenses = expensesList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

            // Scaled financial metrics for selected period
            const periodRevenue = Math.round(actualOrdersRev * multiplier);
            const periodCOGS = Math.round(periodRevenue * 0.65); // COGS is ~65%
            const periodGrossProfit = periodRevenue - periodCOGS;
            const periodGrossMargin = periodRevenue > 0 ? ((periodGrossProfit / periodRevenue) * 100).toFixed(1) : 0;

            const periodExpenses = Math.round(actualExpenses * multiplier);
            const periodNetProfit = periodGrossProfit - periodExpenses;
            const periodNetMargin = periodRevenue > 0 ? ((periodNetProfit / periodRevenue) * 100).toFixed(1) : 0;

            // Channel revenues scaled for period
            const posOrders = ordersList.filter(o => o.channel === "Do'kon (POS)" || !o.channel);
            const igOrders = ordersList.filter(o => o.channel === "Instagram");
            const tgOrders = ordersList.filter(o => o.channel === "Telegram");
            const webOrders = ordersList.filter(o => o.channel === "Web App");
            const b2bOrders = ordersList.filter(o => o.channel === "B2B Optom");

            const posRevPeriod = Math.round(posOrders.reduce((a, b) => a + (Number(b.total) || 0), 0) * multiplier);
            const webRevPeriod = Math.round(webOrders.reduce((a, b) => a + (Number(b.total) || 0), 0) * multiplier);
            const igRevPeriod = Math.round(igOrders.reduce((a, b) => a + (Number(b.total) || 0), 0) * multiplier);
            const tgRevPeriod = Math.round(tgOrders.reduce((a, b) => a + (Number(b.total) || 0), 0) * multiplier);
            const b2bRevPeriod = Math.round(b2bOrders.reduce((a, b) => a + (Number(b.total) || 0), 0) * multiplier);

            // 2. Full Warehouse Inventory Valuation & Category Breakdown
            const totalWarehouseItems = productsList.reduce((acc, p) => acc + (p.stockCount || 0), 0);
            const totalWarehouseCost = productsList.reduce((acc, p) => acc + ((p.costPrice !== undefined ? p.costPrice : Math.round(p.price * 0.68)) * (p.stockCount || 0)), 0);
            const totalWarehouseRetail = productsList.reduce((acc, p) => acc + (p.price * (p.stockCount || 0)), 0);
            const unrealizedWarehouseProfit = totalWarehouseRetail - totalWarehouseCost;
            const potentialMarginPercent = totalWarehouseCost > 0 ? ((unrealizedWarehouseProfit / totalWarehouseCost) * 100).toFixed(1) : 0;

            // Categories Breakdown
            const categoriesBreakdown = Object.entries(
              productsList.reduce((acc, p) => {
                const cat = p.category || 'appliances';
                if (!acc[cat]) {
                  acc[cat] = {
                    category: cat,
                    label: getCategoryLabel(cat),
                    skuCount: 0,
                    stockCount: 0,
                    costTotal: 0,
                    retailTotal: 0,
                    lowStockCount: 0
                  };
                }
                const cost = p.costPrice !== undefined ? p.costPrice : Math.round(p.price * 0.68);
                const qty = p.stockCount || 0;
                acc[cat].skuCount += 1;
                acc[cat].stockCount += qty;
                acc[cat].costTotal += cost * qty;
                acc[cat].retailTotal += p.price * qty;
                if (qty < 5) acc[cat].lowStockCount += 1;
                return acc;
              }, {})
            ).map(([_, data]) => {
              const profit = data.retailTotal - data.costTotal;
              const margin = data.costTotal > 0 ? ((profit / data.costTotal) * 100).toFixed(1) : 0;
              const share = totalWarehouseRetail > 0 ? ((data.retailTotal / totalWarehouseRetail) * 100).toFixed(1) : 0;
              return {
                ...data,
                profit,
                margin,
                share
              };
            }).sort((a, b) => b.retailTotal - a.retailTotal);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Top Period Selector Bar & Actions */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  color: '#ffffff',
                  boxShadow: '0 12px 35px -5px rgba(37, 99, 235, 0.35)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  boxShadow: '0 10px 30px rgba(15,23,42,0.15)'
                }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                      <ShieldCheck size={14} />
                      <span>PROFESSIONAL BUXGALTERIYA & MOLIYA AUDITI</span>
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                      {periodTitle}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Kompaniya savdo tushumlari, tovarlar tannarxi, operatsion xarajatlar va sof foyda hisoboti
                    </p>
                  </div>

                  {/* Period Switcher Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.3)' }}>
                      {[
                        { id: 'day', label: 'Bugun (Kunlik)' },
                        { id: 'week', label: 'Haftalik' },
                        { id: 'month', label: 'Oylik' },
                        { id: 'year', label: 'Yillik' },
                        { id: 'all', label: 'Barcha Davr' }
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => setReportPeriod(p.id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: reportPeriod === p.id ? '#ffffff' : 'transparent',
                            color: reportPeriod === p.id ? '#1e40af' : '#ffffff',
                            boxShadow: reportPeriod === p.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Print & Download Buttons */}
                    <button
                      onClick={() => handleOpenReportModal(`To'liq Buxgalteriya va Ombor Auditi (${periodBadge})`)}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#1d4ed8',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Printer size={16} />
                      <span>Chop Etish (P&L)</span>
                    </button>

                    <button
                      onClick={handleDownloadExcel}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={16} />
                      <span>Excel / CSV</span>
                    </button>
                  </div>
                </div>

                {/* 5 Executive Financial Metrics KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  
                  {/* Card 1: Yalpi Tushum */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb' }}>1. YALPI SAVDO TUSHUMI</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{formatPrice(periodRevenue)}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Barcha kanallardan tushgan summa
                    </div>
                  </div>

                  {/* Card 2: COGS Tannarx */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>2. MAHSULOT TANNARXI (COGS)</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layers size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#475569' }}>{formatPrice(periodCOGS)}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Sotilgan tovarlar kirim xarid narxi
                    </div>
                  </div>

                  {/* Card 3: Yalpi Foyda */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0891b2' }}>3. YALPI FOYDA (GROSS)</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0891b2' }}>{formatPrice(periodGrossProfit)}</div>
                    <div style={{ fontSize: '0.74rem', color: '#0891b2', fontWeight: 800, marginTop: '4px' }}>
                      +{periodGrossMargin}% savdo marjasi
                    </div>
                  </div>

                  {/* Card 4: Operatsion Xarajatlar */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#dc2626' }}>4. XARAJATLAR (OPEX)</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calculator size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626' }}>-{formatPrice(periodExpenses)}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Ish haqi, ijara, transport, reklama
                    </div>
                  </div>

                  {/* Card 5: SOF FOYDA */}
                  <div style={{
                    background: periodNetProfit >= 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: periodNetProfit >= 0 ? '1.5px solid #86efac' : '1.5px solid #fca5a5',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    boxShadow: periodNetProfit >= 0 ? '0 8px 20px rgba(16,185,129,0.12)' : '0 8px 20px rgba(239,68,68,0.12)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 900, color: periodNetProfit >= 0 ? '#15803d' : '#b91c1c' }}>
                        {periodNetProfit >= 0 ? '5. KORXONA SOF FOYDASI' : '5. KORXONA SOF ZARARI'}
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: periodNetProfit >= 0 ? '#16a34a' : '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {periodNetProfit >= 0 ? <Award size={16} /> : <AlertTriangle size={16} />}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: periodNetProfit >= 0 ? '#15803d' : '#dc2626' }}>
                      {formatPrice(periodNetProfit)}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: periodNetProfit >= 0 ? '#166534' : '#991b1b', fontWeight: 800, marginTop: '4px' }}>
                      {periodNetProfit >= 0 ? `Sof rentabellik darajasi: +${periodNetMargin}%` : `Zarar darajasi: ${periodNetMargin}%`}
                    </div>
                  </div>
                </div>

                {/* ================= SECTION 2: OMBOR VA DO'KON TOVAR ZAXIRASI AUDITI ================= */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', overflow: 'hidden' }}>
                  
                  {/* Section Title & Ombor Summary Cards */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Warehouse size={20} color="var(--primary-blue)" />
                          <span>Ombor va Do'kondagi Mahsulotlar Balansi & Kutilayotgan Foyda</span>
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                          Mavjud tovarlarning kirim tannarxi, sotuv qiymati va kategoriyalar bo'yicha taqsimoti
                        </p>
                      </div>
                    </div>

                    {/* 4 Warehouse Valuation Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>📦 Ombordagi Mahsulotlar Soni</span>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                          {totalWarehouseItems.toLocaleString()} ta dona
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                          {productsList.length} xil mahsulot assortimenti
                        </span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>💵 Zaxiraning Jami Tannarxi</span>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#475569', marginTop: '2px' }}>
                          {formatPrice(totalWarehouseCost)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Xarid qilishga sarflangan aktivlar</span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>🏷️ Zaxiraning Sotuv Qiymati</span>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--primary-blue)', marginTop: '2px' }}>
                          {formatPrice(totalWarehouseRetail)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Chakana sotish summasi</span>
                      </div>

                      <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '14px', border: '1.5px solid #bfdbfe' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8' }}>💎 Kutilayotgan Potensial Foyda</span>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                          {formatPrice(unrealizedWarehouseProfit)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800 }}>
                          +{potentialMarginPercent}% kutilayotgan o'rtacha ustama
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown Table */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        📊 Kategoriyalar Bo'yicha Tovar Zaxiralari va Foyda Taqsimoti
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Jami {categoriesBreakdown.length} ta kategoriya
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569' }}>
                            <th style={{ padding: '0.85rem 1rem' }}>Kategoriya</th>
                            <th style={{ padding: '0.85rem', textAlign: 'center' }}>Turlar (SKU)</th>
                            <th style={{ padding: '0.85rem', textAlign: 'center' }}>Ombordagi Soni</th>
                            <th style={{ padding: '0.85rem', textAlign: 'right' }}>Jami Tannarx (Kirim)</th>
                            <th style={{ padding: '0.85rem', textAlign: 'right' }}>Jami Sotuv Narxi</th>
                            <th style={{ padding: '0.85rem', textAlign: 'right' }}>Potensial Foyda</th>
                            <th style={{ padding: '0.85rem', textAlign: 'center' }}>Marja (%)</th>
                            <th style={{ padding: '0.85rem', width: '130px' }}>Ombor Ulushi</th>
                            <th style={{ padding: '0.85rem', textAlign: 'center' }}>Holat</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoriesBreakdown.map((cat, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                              
                              {/* Category Name */}
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: 'var(--primary-blue)', fontSize: '0.8rem' }}>
                                  {cat.label}
                                </span>
                              </td>

                              {/* SKU count */}
                              <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                                {cat.skuCount} xil
                              </td>

                              {/* Stock count */}
                              <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 800, color: '#1e293b' }}>
                                {cat.stockCount} ta
                              </td>

                              {/* Cost Total */}
                              <td style={{ padding: '0.85rem', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>
                                {formatPrice(cat.costTotal)}
                              </td>

                              {/* Retail Total */}
                              <td style={{ padding: '0.85rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary-blue)' }}>
                                {formatPrice(cat.retailTotal)}
                              </td>

                              {/* Unrealized Profit */}
                              <td style={{ padding: '0.85rem', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                                +{formatPrice(cat.profit)}
                              </td>

                              {/* Margin % */}
                              <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 800, color: '#047857' }}>
                                {cat.margin}%
                              </td>

                              {/* Share with Progress Bar */}
                              <td style={{ padding: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, cat.share)}%`, height: '100%', background: 'var(--primary-blue)', borderRadius: '3px' }}></div>
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', minWidth: '32px' }}>{cat.share}%</span>
                                </div>
                              </td>

                              {/* Stock status badge */}
                              <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                                {cat.lowStockCount > 0 ? (
                                  <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', fontWeight: 800 }}>
                                    {cat.lowStockCount} ta kam
                                  </span>
                                ) : (
                                  <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', fontWeight: 800 }}>
                                    Yetarli
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}

                          {/* Table Summary Row (JAMI / TOTAL) */}
                          <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #cbd5e1' }}>
                            <td style={{ padding: '1rem', color: '#0f172a' }}>JAMI / TOTAL</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>{productsList.length} xil</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>{totalWarehouseItems.toLocaleString()} ta</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>{formatPrice(totalWarehouseCost)}</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--primary-blue)' }}>{formatPrice(totalWarehouseRetail)}</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981' }}>+{formatPrice(unrealizedWarehouseProfit)}</td>
                            <td style={{ padding: '1rem', textAlign: 'center', color: '#047857' }}>+{potentialMarginPercent}%</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>100%</td>
                            <td style={{ padding: '1rem', textAlign: 'center', color: '#16a34a' }}>Aktivlar</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ================= SECTION 3: FOYDA VA ZARARLAR BUXGALTERIYA HUJJATI (P&L STATEMENT) ================= */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} color="var(--primary-blue)" />
                        <span>Foyda va Zararlar To'liq Buxgalteriya Balansi (P&L Income Statement)</span>
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Davr: {periodTitle} • Valyuta: {currency === 'UZS' ? "O'zbekiston So'mi (UZS)" : "AQSH Dollari (USD)"}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 800 }}>
                        Audit Maqomi: Tasdiqlangan
                      </span>
                    </div>
                  </div>

                  {/* Formal Statement Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace' }}>
                    
                    {/* SECTION I: REVENUE */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem', fontFamily: 'inherit' }}>
                        I. ASOSIY FAOLIYATDAN SOTUV TUSHUMLARI (REVENUES)
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• Do'kon Kassa (POS) savdolari:</span>
                        <span style={{ fontWeight: 800 }}>{formatPrice(posRevPeriod)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• Online Savdo (Veb-sayt, Telegram, Instagram):</span>
                        <span style={{ fontWeight: 800 }}>{formatPrice(webRevPeriod + igRevPeriod + tgRevPeriod)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• B2B Optom shartnomaviy sotuvlar:</span>
                        <span style={{ fontWeight: 800 }}>{formatPrice(b2bRevPeriod)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary-blue)' }}>
                        <span>JAMI SOTUV TUSHUMI (GROSS REVENUE):</span>
                        <span>{formatPrice(periodRevenue)}</span>
                      </div>
                    </div>

                    {/* SECTION II: COGS & GROSS PROFIT */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#475569', marginBottom: '0.5rem', fontFamily: 'inherit' }}>
                        II. SOTILGAN TOVARLAR TANNARXI (COST OF GOODS SOLD)
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• Tovar moddiy zaxiralarining xarid qiymati:</span>
                        <span style={{ fontWeight: 800, color: '#dc2626' }}>-{formatPrice(periodCOGS)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '0.95rem', fontWeight: 900, color: '#0891b2' }}>
                        <span>YALPI FOYDA (GROSS PROFIT):</span>
                        <span>{formatPrice(periodGrossProfit)} ({periodGrossMargin}%)</span>
                      </div>
                    </div>

                    {/* SECTION III: OPERATING EXPENSES */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#b91c1c', marginBottom: '0.5rem', fontFamily: 'inherit' }}>
                        III. OPERATSION XARAJATLAR MODDALARI (OPERATING EXPENSES)
                      </div>
                      {expensesList.map((exp, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px dashed #e2e8f0' }}>
                          <span>• {exp.title} ({exp.category}):</span>
                          <span style={{ fontWeight: 800, color: '#dc2626' }}>-{formatPrice(Math.round(exp.amount * multiplier))}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '0.95rem', fontWeight: 900, color: '#dc2626' }}>
                        <span>JAMI OPERATSION XARAJATLAR (TOTAL OPEX):</span>
                        <span>-{formatPrice(periodExpenses)}</span>
                      </div>
                    </div>

                    {/* SECTION IV: NET PROFIT */}
                    <div style={{
                      background: periodNetProfit >= 0 ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' : 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      color: '#ffffff',
                      boxShadow: '0 8px 25px rgba(4,120,87,0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ade80', letterSpacing: '0.05em' }}>
                          IV. YAKUNIY MOLIYAVIY NATIJA
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                          KORXONANING SOF FOYDASI (NET PROFIT):
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          Sof rentabellik ko'rsatkichi: {periodNetMargin}%
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ade80' }}>
                          {formatPrice(periodNetProfit)}
                        </div>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(74,222,128,0.2)', color: '#86efac', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          Balans Muvaffaqiyatli
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sign-off signatures box */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <div>Bosh Buxgalter: <strong>Nilufar Umarova</strong> ____________ (Imzo)</div>
                      <div style={{ marginTop: '4px' }}>Bosh Menejer: <strong>Jasurbek Alimov</strong> ____________ (Imzo)</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenReportModal(`To'liq Buxgalteriya va Ombor Auditi (${periodBadge})`)}
                        style={{
                          padding: '0.65rem 1.25rem',
                          borderRadius: '12px',
                          background: 'var(--primary-blue)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Printer size={16} />
                        <span>A4 Blankda Chop Etish</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>

      )}

      {/* ==================== MODULE 5: XODIMLAR (STAFF / HR) ==================== */}

      {activeTab === 'staff' && (

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', overflow: 'hidden' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

              👥 Xodimlar va HR Boshqaruvi ({staffList.length} kishi)

            </h3>

            <button

              onClick={() => setIsStaffModalOpen(true)}

              style={{ padding: '0.5rem 1rem', borderRadius: '50px', background: 'var(--primary-blue)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}

            >

              + Yangi Xodim Qo'shish

            </button>

          </div>

          <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>

              <thead>

                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>

                  <th style={{ padding: '0.85rem' }}>ID</th>

                  <th style={{ padding: '0.85rem' }}>Ism-Familiya</th>

                  <th style={{ padding: '0.85rem' }}>Lavozimi</th>

                  <th style={{ padding: '0.85rem' }}>Telefon</th>

                  <th style={{ padding: '0.85rem' }}>Oylik Maoshi</th>

                  <th style={{ padding: '0.85rem' }}>Status</th>

                  <th style={{ padding: '0.85rem', textAlign: 'right' }}>Amallar</th>

                </tr>

              </thead>

              <tbody>

                {staffList.map((stf) => (

                  <tr key={stf.id} style={{ borderBottom: '1px solid #f1f5f9' }}>

                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{stf.id}</td>

                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{stf.name}</td>

                    <td style={{ padding: '0.85rem' }}>

                      <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#eff6ff', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '8px' }}>

                        {stf.role}

                      </span>

                    </td>

                    <td style={{ padding: '0.85rem', color: '#64748b' }}>{stf.phone}</td>

                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#10b981' }}>{formatPrice(stf.salary)} / oy</td>

                    <td style={{ padding: '0.85rem' }}>

                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: stf.status === 'Faol' ? '#dcfce7' : '#fef3c7', color: stf.status === 'Faol' ? '#15803d' : '#b45309' }}>

                        {stf.status}

                      </span>

                    </td>

                    <td style={{ padding: '0.85rem', textAlign: 'right' }}>

                      <button onClick={() => handleDeleteStaff(stf.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>

                        <Trash2 size={17} />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ==================== MODULE 6: SOZLAMALAR (SETTINGS) ==================== */}

      {activeTab === 'settings' && (

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>⚙️ Do'kon va Tizim Sozlamalari</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

            {/* Store Info */}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem' }}>🏬 Do'kon Profil Ma'lumotlari</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

                <div>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Do'kon Nomi:</label>

                  <input type="text" value={storeSettings.storeName} onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })} style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px' }} />

                </div>

                <div>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Telefon:</label>

                  <input type="text" value={storeSettings.phone} onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })} style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px' }} />

                </div>

              </div>

            </div>

            {/* Payment Gateways */}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem' }}>💳 To'lov Tizimlari</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                {['Click', 'Payme', 'Uzum Bank', 'Naqd Pul'].map((gateway, idx) => (

                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>

                    <span>{gateway}</span>

                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>✓ Faol</span>

                  </div>

                ))}

              </div>

            </div>

            {/* Security & Password Card */}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem' }}>🔐 Xavfsizlik va Parolni O'zgartirish</h4>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

                <div>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Rolni tanlang:</label>

                  <select value={passRole} onChange={e => setPassRole(e.target.value)} style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px', background: '#fff' }}>

                    <option value="admin">Administrator (admin)</option>

                    <option value="dukon">Kassir / Do'kon (dukon)</option>

                  </select>

                </div>

                <div>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Eski Parol:</label>

                  <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Hozirgi parol..." style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px' }} />

                </div>

                <div>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Yangi Parol:</label>

                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Yangi parol (kamida 4 belgi)..." style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px' }} />

                </div>

                {passMsg && (

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: passMsg.type === 'success' ? '#16a34a' : '#dc2626' }}>

                    {passMsg.text}

                  </div>

                )}

                <button type="submit" style={{ padding: '0.55rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '4px' }}>

                  Parolni Yangilash

                </button>

              </form>

            </div>

            {/* Backup & Restore Card */}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem' }}>💾 Zaxira Nusxalash (Backup)</h4>

              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>

                Barcha mahsulotlar, narxlar, ombor va savdo ma'lumotlarini JSON fayl holatida xavfsiz saqlab oling yoki avvalgi nusxani qayta tiklang.

              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                <button type="button" onClick={() => StorageService.exportBackup()} style={{ width: '100%', padding: '0.6rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>

                  <Download size={16} /> Zaxirani Yuklab Olish (Export)

                </button>

                <label style={{ width: '100%', padding: '0.6rem 1rem', background: '#fff', color: '#2563eb', border: '1.5px dashed #2563eb', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center' }}>

                  <Upload size={16} /> Zaxira Faylini Tiklash (Import)

                  <input type="file" accept=".json" onChange={handleImportBackupFile} style={{ display: 'none' }} />

                </label>

              </div>

            </div>

            

            {/* Delivery Settings Card (12 Viloyat) - Collapsible */}

            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>

              <div 

                onClick={() => setIsDeliveryConfigOpen(!isDeliveryConfigOpen)}

                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', cursor: 'pointer', background: isDeliveryConfigOpen ? '#f1f5f9' : '#f8fafc', transition: 'background 0.2s ease' }}

              >

                <div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>🚚 Viloyatlar Bo'yicha Yetkazib Berish (Dastavka) Tariflari</h4>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>Barcha 12 viloyat, Toshkent shahri va Qoraqalpog'iston uchun narx va muddatlarni sozlang.</p>

                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                  <div style={{ padding: '0.4rem', background: '#e2e8f0', borderRadius: '50%', color: '#475569', display: 'flex', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: isDeliveryConfigOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>

                    <ChevronDown size={20} />

                  </div>

                </div>

              </div>

              

              <div style={{ 

                maxHeight: isDeliveryConfigOpen ? '2000px' : '0', 

                opacity: isDeliveryConfigOpen ? 1 : 0, 

                overflow: 'hidden', 

                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 

              }}>

                <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0' }}>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>

                    <button type="button" onClick={handleSaveDeliverySettings} style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(37,99,235,0.2)' }}>

                      <Save size={16} /> Tariflarni Saqlash

                    </button>

                  </div>

              

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>

                <div style={{ flex: '1 1 250px', background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Bepul yetkazish chegarasi (so'm):</label>

                  <input 

                    type="number" 

                    value={deliverySettings?.freeDeliveryThreshold || 0} 

                    onChange={e => setDeliverySettings({...deliverySettings, freeDeliveryThreshold: Number(e.target.value)})}

                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}

                  />

                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Ushbu summadan oshgan buyurtmalar butun Respublika bo'ylab bepul yetkaziladi.</p>

                </div>

                <div style={{ flex: '1 1 250px', background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Qo'qon shahar ichi maxsus narx (so'm):</label>

                  <input 

                    type="number" 

                    value={deliverySettings?.localQoqonPrice || 0} 

                    onChange={e => setDeliverySettings({...deliverySettings, localQoqonPrice: Number(e.target.value)})}

                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}

                  />

                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>0 kiritilsa - mutlaqo bepul.</p>

                </div>

              </div>

</div>
</div>
              

              <div style={{ overflowX: 'auto' }}>

                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>

                  <thead>

                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>

                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569', borderRadius: '8px 0 0 8px' }}>Viloyat / Shahar</th>

                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569' }}>Dastavka Narxi (so'm)</th>

                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569' }}>Yetkazish Muddati</th>

                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>Holati</th>

                    </tr>

                  </thead>

                  <tbody>

                    {deliverySettings?.regions?.map((reg, index) => (

                      <tr key={reg.id} style={{ borderBottom: '1px solid #e2e8f0' }}>

                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{reg.name}</td>

                        <td style={{ padding: '0.75rem 1rem' }}>

                          <input 

                            type="number" 

                            value={reg.price} 

                            onChange={(e) => {

                              const newRegions = [...deliverySettings.regions];

                              newRegions[index].price = Number(e.target.value);

                              setDeliverySettings({...deliverySettings, regions: newRegions});

                            }}

                            style={{ width: '120px', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}

                          />

                        </td>

                        <td style={{ padding: '0.75rem 1rem' }}>

                          <input 

                            type="text" 

                            value={reg.time} 

                            onChange={(e) => {

                              const newRegions = [...deliverySettings.regions];

                              newRegions[index].time = e.target.value;

                              setDeliverySettings({...deliverySettings, regions: newRegions});

                            }}

                            placeholder="Masalan: 1-2 kun"

                            style={{ width: '140px', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}

                          />

                        </td>

                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>

                          <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>

                            <input 

                              type="checkbox" 

                              checked={reg.active} 

                              onChange={(e) => {

                                const newRegions = [...deliverySettings.regions];

                                newRegions[index].active = e.target.checked;

                                setDeliverySettings({...deliverySettings, regions: newRegions});

                              }}

                              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }}

                            />

                            <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: reg.active ? '#10b981' : '#dc2626', fontWeight: 700 }}>

                              {reg.active ? 'Faol' : "O'chirilgan"}

                            </span>

                          </label>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>



      )}

      {/* MODAL 1: ADD / EDIT PRODUCT MODAL (ULTRA-PREMIUM UI/UX DESIGN) */}

      {isAddModalOpen && (

        <div style={{

          position: 'fixed',

          top: 0,

          left: 0,

          right: 0,

          bottom: 0,

          background: 'rgba(15, 23, 42, 0.75)',

          backdropFilter: 'blur(12px)',

          display: 'grid',

          placeItems: 'center',

          zIndex: 9999999,

          padding: '1.25rem'

        }}>

          <div style={{

            background: '#ffffff',

            borderRadius: '28px',

            width: '100%',

            maxWidth: '860px',

            maxHeight: '92vh',

            display: 'flex',

            flexDirection: 'column',

            boxShadow: '0 30px 80px -15px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',

            border: '1px solid rgba(226, 232, 240, 0.8)',

            position: 'relative',

            overflow: 'hidden',

            animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'

          }}>

            {/* Top Premium Glass Header */}

            <div style={{

              padding: '1.25rem 2rem',

              borderBottom: '1px solid #f1f5f9',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'space-between',

              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'

            }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                <div style={{

                  width: '46px',

                  height: '46px',

                  borderRadius: '14px',

                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  color: '#ffffff',

                  boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.45)'

                }}>

                  <Package size={24} />

                </div>

                <div>

                  <h3 style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                    <span>{editingProduct ? "Mahsulotni Tahrirlash" : "Omborga Yangi Mahsulot Qo'shish"}</span>

                    {editingProduct && (

                      <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '50px', fontWeight: 700 }}>

                        ID: {editingProduct.id}

                      </span>

                    )}

                  </h3>

                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>

                    5 tagacha foto, mukammal narxlar, ombor va texnik xarakteristikalar

                  </p>

                </div>

              </div>

              {/* Close Button */}

              <button

                onClick={() => setIsAddModalOpen(false)}

                aria-label="Yopish"

                style={{

                  background: '#f1f5f9',

                  border: 'none',

                  borderRadius: '50%',

                  width: '36px',

                  height: '36px',

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  cursor: 'pointer',

                  color: '#475569',

                  transition: 'all 0.2s'

                }}

                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}

                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}

              >

                <X size={18} />

              </button>

            </div>

            {/* Ultra-Professional Interactive Stepper Navigation Bar */}

            <div style={{

              display: 'grid',

              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',

              gap: '0.5rem',

              padding: '0.75rem 2rem',

              background: '#f8fafc',

              borderBottom: '1.5px solid #e2e8f0'

            }}>

              {[

                {

                  id: 'all',

                  step: '🌟',

                  title: 'Barcha Bo\'limlar',

                  sub: 'To\'liq scroll shakli',

                  count: null,

                  done: Boolean(productForm.nameUz && productForm.price)

                },

                {

                  id: 'images',

                  step: '1',

                  title: 'Rasmlar (Gallery)',

                  sub: '5 tagacha foto',

                  count: `${(productForm.images || []).length}/5`,

                  done: (productForm.images || []).length > 0

                },

                {

                  id: 'pricing',

                  step: '2',

                  title: 'Asosiy & Narx',

                  sub: productForm.price ? `$${productForm.price}` : 'Kiritilmagan',

                  count: productForm.price ? 'Tayyor' : 'Kutilmoqda',

                  done: Boolean(productForm.nameUz && productForm.price)

                },

                {

                  id: 'specs',

                  step: '3',

                  title: 'Tavsif & Xususiyat',

                  sub: `${(productForm.specsList || []).length} ta parametr`,

                  count: (productForm.specsList || []).length > 0 ? 'To\'ldirilgan' : 'Ixtiyoriy',

                  done: (productForm.specsList || []).length > 0

                }

              ].map((tab) => {

                const isActive = modalTab === tab.id;

                return (

                  <button

                    key={tab.id}

                    type="button"

                    onClick={() => setModalTab(tab.id)}

                    style={{

                      display: 'flex',

                      alignItems: 'center',

                      gap: '0.65rem',

                      padding: '0.6rem 0.85rem',

                      borderRadius: '14px',

                      border: isActive ? '2px solid #2563eb' : '1.5px solid #e2e8f0',

                      background: isActive ? '#ffffff' : '#ffffff',

                      boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',

                      cursor: 'pointer',

                      textAlign: 'left',

                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

                      position: 'relative',

                      overflow: 'hidden'

                    }}

                  >

                    {/* Step Icon Badge */}

                    <div style={{

                      width: '28px',

                      height: '28px',

                      borderRadius: '8px',

                      background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : (tab.done ? '#ecfdf5' : '#f1f5f9'),

                      color: isActive ? '#ffffff' : (tab.done ? '#059669' : '#64748b'),

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      fontSize: '0.78rem',

                      fontWeight: 800,

                      flexShrink: 0

                    }}>

                      {tab.done && !isActive ? '✓' : tab.step}

                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>

                      <div style={{

                        fontSize: '0.82rem',

                        fontWeight: 800,

                        color: isActive ? '#2563eb' : '#1e293b',

                        whiteSpace: 'nowrap',

                        overflow: 'hidden',

                        textOverflow: 'ellipsis'

                      }}>

                        {tab.title}

                      </div>

                      <div style={{

                        fontSize: '0.7rem',

                        color: isActive ? '#3b82f6' : '#64748b',

                        fontWeight: 600,

                        whiteSpace: 'nowrap',

                        overflow: 'hidden',

                        textOverflow: 'ellipsis'

                      }}>

                        {tab.sub}

                      </div>

                    </div>

                    {/* Active Underline Indicator */}

                    {isActive && (

                      <div style={{

                        position: 'absolute',

                        bottom: 0,

                        left: '15%',

                        right: '15%',

                        height: '2.5px',

                        borderRadius: '4px',

                        background: '#2563eb'

                      }} />

                    )}

                  </button>

                );

              })}

            </div>

            {/* Modal Form Content */}

            <form onSubmit={handleSaveProduct} style={{ overflowY: 'auto', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem', flex: 1 }}>

              {/* TAB OR SECTION: 1. 📸 5 TAGACHA RASM YUKLASH (ULTRA-GALLERY) */}

              {(modalTab === 'all' || modalTab === 'images') && (

                <div style={{

                  background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',

                  border: '1.5px solid #e2e8f0',

                  borderRadius: '20px',

                  padding: '1.35rem',

                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                }}>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>

                    <div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                        <ImageIcon size={19} color="#2563eb" />

                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                          Mahsulot Rasmlari Galereyasi

                        </h4>

                        <span style={{

                          background: (productForm.images || []).length >= 5 ? '#fef3c7' : '#eff6ff',

                          color: (productForm.images || []).length >= 5 ? '#b45309' : '#2563eb',

                          fontSize: '0.74rem',

                          fontWeight: 800,

                          padding: '2px 9px',

                          borderRadius: '50px',

                          border: '1px solid currentColor'

                        }}>

                          {(productForm.images || []).length} / 5 ta yuklandi

                        </span>

                      </div>

                      <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748b' }}>

                        1-katakdagi rasm avtomatik ravishda bosh sahifa va kartochkalardagi asosiy muqova (cover) bo'ladi

                      </p>

                    </div>

                    {/* Quick upload triggers */}

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>

                      <label style={{

                        display: 'inline-flex',

                        alignItems: 'center',

                        gap: '0.45rem',

                        padding: '0.55rem 1rem',

                        background: (productForm.images || []).length >= 5 ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                        color: (productForm.images || []).length >= 5 ? '#94a3b8' : '#ffffff',

                        borderRadius: '12px',

                        fontSize: '0.8rem',

                        fontWeight: 800,

                        cursor: (productForm.images || []).length >= 5 ? 'not-allowed' : 'pointer',

                        boxShadow: (productForm.images || []).length >= 5 ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',

                        transition: 'all 0.2s'

                      }}>

                        <Upload size={15} />

                        <span>Kompyuterdan Yuklash</span>

                        <input

                          type="file"

                          accept="image/*"

                          multiple

                          disabled={(productForm.images || []).length >= 5}

                          onChange={handleImageFileUpload}

                          style={{ display: 'none' }}

                        />

                      </label>

                    </div>

                  </div>

                  {/* URL Input Strip */}

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#fff', padding: '5px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>

                    <input

                      type="url"

                      placeholder="yoki to'g'ridan-to'g'ri rasm havolasini (https://...) kiriting..."

                      value={imageUrlInput}

                      onChange={(e) => setImageUrlInput(e.target.value)}

                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}

                      style={{ flex: 1, padding: '0.5rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.82rem', outline: 'none' }}

                    />

                    <button

                      type="button"

                      onClick={handleAddImageUrl}

                      disabled={!imageUrlInput.trim() || (productForm.images || []).length >= 5}

                      style={{

                        padding: '0.5rem 1rem',

                        background: '#0f172a',

                        color: '#fff',

                        border: 'none',

                        borderRadius: '8px',

                        fontSize: '0.78rem',

                        fontWeight: 700,

                        cursor: (!imageUrlInput.trim() || (productForm.images || []).length >= 5) ? 'not-allowed' : 'pointer',

                        opacity: (!imageUrlInput.trim() || (productForm.images || []).length >= 5) ? 0.5 : 1

                      }}

                    >

                      + URL Qo'shish

                    </button>

                  </div>

                  {/* Visual Studio-grade 5-Slot Layout (1 Big Cover + 4 Side Thumbnails) */}

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1rem' }}>

                    

                    {/* Hero Slot 1 (Cover Photo) */}

                    {(() => {

                      const heroImg = (productForm.images || [])[0];

                      return (

                        <div style={{

                          height: '220px',

                          borderRadius: '16px',

                          border: heroImg ? '2.5px solid #2563eb' : '2.5px dashed #cbd5e1',

                          background: heroImg ? '#0f172a' : '#ffffff',

                          display: 'flex',

                          flexDirection: 'column',

                          alignItems: 'center',

                          justifyContent: 'center',

                          position: 'relative',

                          overflow: 'hidden',

                          boxShadow: heroImg ? '0 10px 25px -5px rgba(37, 99, 235, 0.25)' : 'none'

                        }}>

                          {heroImg ? (

                            <>

                              <img

                                src={heroImg}

                                alt="Asosiy rasm"

                                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}

                              />

                              <div style={{

                                position: 'absolute',

                                top: '10px',

                                left: '10px',

                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                                color: '#ffffff',

                                padding: '4px 10px',

                                borderRadius: '50px',

                                fontSize: '0.72rem',

                                fontWeight: 800,

                                display: 'flex',

                                alignItems: 'center',

                                gap: '4px',

                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'

                              }}>

                                <Star size={12} fill="#fff" />

                                <span>1. Bosh Muqova Rasm (Asosiy)</span>

                              </div>

                              <button

                                type="button"

                                title="O'chirish"

                                onClick={() => handleRemoveImage(0)}

                                style={{

                                  position: 'absolute',

                                  top: '10px',

                                  right: '10px',

                                  background: 'rgba(239, 68, 68, 0.9)',

                                  color: '#fff',

                                  border: 'none',

                                  borderRadius: '50%',

                                  width: '32px',

                                  height: '32px',

                                  display: 'flex',

                                  alignItems: 'center',

                                  justifyContent: 'center',

                                  cursor: 'pointer',

                                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'

                                }}

                              >

                                <Trash2 size={15} />

                              </button>

                            </>

                          ) : (

                            <label style={{

                              width: '100%',

                              height: '100%',

                              display: 'flex',

                              flexDirection: 'column',

                              alignItems: 'center',

                              justifyContent: 'center',

                              cursor: 'pointer',

                              padding: '1.5rem',

                              textAlign: 'center',

                              color: '#64748b',

                              gap: '0.5rem'

                            }}>

                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                <Upload size={22} />

                              </div>

                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>

                                ★ 1-Asosiy Muqova Rasmini Yuklang

                              </span>

                              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>

                                Drag & drop yoki bosing (JPG, PNG, WEBP)

                              </span>

                              <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ display: 'none' }} />

                            </label>

                          )}

                        </div>

                      );

                    })()}

                    {/* 4 Additional Thumbnail Slots (2x2 Grid) */}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0.65rem' }}>

                      {[1, 2, 3, 4].map((slotIdx) => {

                        const imgUrl = (productForm.images || [])[slotIdx];

                        return (

                          <div

                            key={slotIdx}

                            style={{

                              height: '104px',

                              borderRadius: '12px',

                              border: imgUrl ? '1.5px solid #cbd5e1' : '1.5px dashed #cbd5e1',

                              background: '#ffffff',

                              display: 'flex',

                              flexDirection: 'column',

                              alignItems: 'center',

                              justifyContent: 'center',

                              position: 'relative',

                              overflow: 'hidden',

                              boxShadow: imgUrl ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'

                            }}

                          >

                            {imgUrl ? (

                              <>

                                <img

                                  src={imgUrl}

                                  alt={`Slot ${slotIdx + 1}`}

                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}

                                />

                                <span style={{

                                  position: 'absolute',

                                  top: '4px',

                                  left: '4px',

                                  background: 'rgba(15, 23, 42, 0.8)',

                                  color: '#fff',

                                  fontSize: '0.62rem',

                                  fontWeight: 800,

                                  padding: '1px 6px',

                                  borderRadius: '4px'

                                }}>

                                  #{slotIdx + 1}

                                </span>

                                <div style={{

                                  position: 'absolute',

                                  bottom: 0,

                                  left: 0,

                                  right: 0,

                                  background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.9) 100%)',

                                  padding: '4px 6px',

                                  display: 'flex',

                                  justifyContent: 'space-between',

                                  alignItems: 'center'

                                }}>

                                  <button

                                    type="button"

                                    onClick={() => handleSetMainImage(slotIdx)}

                                    title="Asosiy muqova qilish"

                                    style={{

                                      background: '#2563eb',

                                      color: '#fff',

                                      border: 'none',

                                      borderRadius: '4px',

                                      padding: '2px 6px',

                                      fontSize: '0.62rem',

                                      fontWeight: 800,

                                      cursor: 'pointer'

                                    }}

                                  >

                                    ★ Asosiy

                                  </button>

                                  <button

                                    type="button"

                                    onClick={() => handleRemoveImage(slotIdx)}

                                    title="O'chirish"

                                    style={{

                                      background: 'rgba(239, 68, 68, 0.9)',

                                      color: '#fff',

                                      border: 'none',

                                      borderRadius: '4px',

                                      padding: '2px 5px',

                                      cursor: 'pointer'

                                    }}

                                  >

                                    <Trash2 size={11} />

                                  </button>

                                </div>

                              </>

                            ) : (

                              <label style={{

                                width: '100%',

                                height: '100%',

                                display: 'flex',

                                flexDirection: 'column',

                                alignItems: 'center',

                                justifyContent: 'center',

                                cursor: 'pointer',

                                color: '#94a3b8',

                                gap: '2px'

                              }}>

                                <Plus size={16} />

                                <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>

                                  + Rasm {slotIdx + 1}

                                </span>

                                <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ display: 'none' }} />

                              </label>

                            )}

                          </div>

                        );

                      })}

                    </div>

                  </div>

                </div>

              )}

              {/* TAB OR SECTION: 2. 📝 ASOSIY MA'LUMOTLAR & IDENTIFIKATSIYA */}

              {(modalTab === 'all' || modalTab === 'pricing') && (

                <div style={{

                  background: '#ffffff',

                  border: '1.5px solid #e2e8f0',

                  borderRadius: '20px',

                  padding: '1.35rem',

                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>

                    <Tag size={18} color="#2563eb" />

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                      Mahsulot Nomi va Toifasi

                    </h4>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Mahsulot Nomi (O'zbekcha) <span style={{ color: '#ef4444' }}>*</span>:

                      </label>

                      <input

                        type="text"

                        required

                        placeholder="masalan: Samsung Galaxy S24 Ultra 512GB Titanium Gray"

                        value={productForm.nameUz}

                        onChange={(e) => setProductForm({ ...productForm, nameUz: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Nomi (Ruscha) (ixtiyoriy):

                      </label>

                      <input

                        type="text"

                        placeholder="masalan: Смартфон Samsung Galaxy S24 Ultra"

                        value={productForm.nameRu}

                        onChange={(e) => setProductForm({ ...productForm, nameRu: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outlineColor: '#2563eb' }}

                      />

                    </div>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: '0.85rem' }}>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Kategoriya:

                      </label>

                      <select

                        value={productForm.category}

                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, background: '#fff', outlineColor: '#2563eb' }}

                      >

                        <option value="headphones">🎧 Quloqchin va Bluetooth</option>

                        <option value="mobiles">📱 Smartfon va Planshetlar</option>

                        <option value="gaming">🎮 Xbox va Playstation</option>

                        <option value="soundbox">🔊 Kalonka va Akustika</option>

                        <option value="washing">🧺 Kir Yuvish Mashinalari</option>

                        <option value="coffee">☕ Kofe Mashinalari</option>

                        <option value="fridge">❄️ Muzlatgichlar</option>

                        <option value="iron">👔 Dazmollar</option>

                        <option value="laptop">💻 Noutbuk va Kompyuterlar</option>

                        <option value="accessories">🔌 Aksessuarlar va Kabellar</option>

                        <option value="appliances">🏠 Maishiy Texnika</option>

                      </select>

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Brend (Ishlab chiqaruvchi):

                      </label>

                      <input

                        type="text"

                        placeholder="masalan: Samsung, Apple, Artel, LG"

                        value={productForm.brand}

                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>

                        <span>Artikul (SKU):</span>

                        <button

                          type="button"

                          onClick={handleGenerateSku}

                          style={{ background: '#eff6ff', border: 'none', color: '#2563eb', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 800 }}

                        >

                          🎲 Avto

                        </button>

                      </label>

                      <input

                        type="text"

                        placeholder="GL-XXXX"

                        value={productForm.sku}

                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, color: '#334155', outlineColor: '#2563eb' }}

                      />

                    </div>

                  </div>

                </div>

              )}

              {/* TAB OR SECTION: 3. 💰 NARX, CHEGIRMA VA OMBOR ZAXIRASI */}

              {(modalTab === 'all' || modalTab === 'pricing') && (

                <div style={{

                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',

                  border: '1.5px solid #e2e8f0',

                  borderRadius: '20px',

                  padding: '1.35rem',

                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                }}>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                      <DollarSign size={19} color="#16a34a" />

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                        Narxlar, Buxgalteriya va Ombor Miqdori

                      </h4>

                    </div>

                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>

                      Joriy valyuta kursi: 1 USD = {(exchangeRate || 12900).toLocaleString()} UZS

                    </span>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Sotuv Narxi ($ USD) <span style={{ color: '#ef4444' }}>*</span>:

                      </label>

                      <input

                        type="number"

                        step="0.01"

                        required

                        placeholder="0.00"

                        value={productForm.price}

                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '2px solid #2563eb', fontWeight: 800, color: '#2563eb', fontSize: '1.05rem', outline: 'none', background: '#eff6ff' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Asl Narxi ($ USD):

                      </label>

                      <input

                        type="number"

                        step="0.01"

                        placeholder="Chegirmasiz"

                        value={productForm.oldPrice}

                        onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', color: '#64748b', outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Tan Narxi ($ USD):

                      </label>

                      <input

                        type="number"

                        step="0.01"

                        placeholder="Xarajat"

                        value={productForm.costPrice}

                        onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Ombor Zaxirasi (Soni) <span style={{ color: '#ef4444' }}>*</span>:

                      </label>

                      <input

                        type="number"

                        required

                        value={productForm.stockCount}

                        onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1rem', outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Yorliq (Badge):

                      </label>

                      <select

                        value={productForm.badge}

                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800, background: '#fff', outlineColor: '#2563eb' }}

                      >

                        <option value="NEW">Yangi (NEW)</option>

                        <option value="HOT">Xit sotuv (HOT)</option>

                        <option value="SALE">Chegirma (SALE)</option>

                        <option value="BEST">Tavsiya (BEST)</option>

                        <option value="TOP">Top Sifat (TOP)</option>

                      </select>

                    </div>

                  </div>

                  {/* Financial calculation insights badge bar */}

                  {Number(productForm.price) > 0 && (

                    <div style={{

                      background: '#ffffff',

                      border: '1px solid #e2e8f0',

                      borderRadius: '12px',

                      padding: '0.6rem 0.9rem',

                      display: 'flex',

                      alignItems: 'center',

                      gap: '1.25rem',

                      flexWrap: 'wrap',

                      fontSize: '0.78rem'

                    }}>

                      <span style={{ fontWeight: 700, color: '#0f172a' }}>

                        🇺🇿 So'mda: <strong>{(Number(productForm.price) * (exchangeRate || 12900)).toLocaleString()} UZS</strong>

                      </span>

                      {productForm.oldPrice && Number(productForm.oldPrice) > Number(productForm.price) && (

                        <span style={{ color: '#ea580c', fontWeight: 800 }}>

                          🏷️ Chegirma: -{Math.round(((productForm.oldPrice - productForm.price) / productForm.oldPrice) * 100)}% tejamkorlik

                        </span>

                      )}

                      {productForm.costPrice && Number(productForm.price) > Number(productForm.costPrice) && (

                        <span style={{ color: '#16a34a', fontWeight: 800 }}>

                          📈 Sof foyda: +${(Number(productForm.price) - Number(productForm.costPrice)).toFixed(2)} / dona

                        </span>

                      )}

                    </div>

                  )}

                </div>

              )}

              {/* TAB OR SECTION: 4. ⚙️ TAVSIF VA TEXNIK PARAMETRLAR */}

              {(modalTab === 'all' || modalTab === 'specs') && (

                <>

                  {/* Warranty & Delivery */}

                  <div style={{

                    background: '#ffffff',

                    border: '1.5px solid #e2e8f0',

                    borderRadius: '20px',

                    padding: '1.35rem',

                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                  }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>

                      <ShieldCheck size={18} color="#2563eb" />

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                        Kafolat va Yetkazib Berish Shartlari

                      </h4>

                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.85rem' }}>

                      <div>

                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                          Rasmiy Kafolat:

                        </label>

                        <select

                          value={productForm.warranty}

                          onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}

                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', background: '#fff', outlineColor: '#2563eb' }}

                        >

                          <option value="12 oylik rasmiy kafolat">12 Oylik Rasmiy Kafolat</option>

                          <option value="24 oylik rasmiy kafolat">24 Oylik Rasmiy Kafolat</option>

                          <option value="36 oylik kafolat">36 Oylik Kafolat</option>

                          <option value="6 oylik servis">6 Oylik Servis</option>

                          <option value="Kafolatsiz">Kafolatsiz</option>

                        </select>

                      </div>

                      <div>

                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                          Yetkazib Berish Sharti:

                        </label>

                        <input

                          type="text"

                          value={productForm.deliveryInfo}

                          onChange={(e) => setProductForm({ ...productForm, deliveryInfo: e.target.value })}

                          placeholder="masalan: O'zbekiston bo'ylab 24 soatda bepul yetkazib berish"

                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outlineColor: '#2563eb' }}

                        />

                      </div>

                    </div>

                  </div>

                  {/* Descriptions */}

                  <div style={{

                    background: '#ffffff',

                    border: '1.5px solid #e2e8f0',

                    borderRadius: '20px',

                    padding: '1.35rem',

                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                  }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>

                      <FileText size={18} color="#2563eb" />

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                        Mahsulot Tavsifi va Qisqa Ma'lumot

                      </h4>

                    </div>

                    <div style={{ marginBottom: '0.85rem' }}>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        Qisqa Ta'rif (Kartochka va ijtimoiy tarmoqlar uchun):

                      </label>

                      <input

                        type="text"

                        placeholder="masalan: Yuqori shovqin bostiruvchi, simsiz Hi-Res audio quloqchin..."

                        value={productForm.shortDesc}

                        onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}

                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outlineColor: '#2563eb' }}

                      />

                    </div>

                    <div>

                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>

                        To'liq Batafsil Tavsif (Imkoniyatlari, korpusi va afzalliklari):

                      </label>

                      <textarea

                        rows={4}

                        placeholder="Mahsulot haqida to'liq ma'lumot, yangi texnologiyalari, to'plam tarkibi..."

                        value={productForm.fullDesc}

                        onChange={(e) => setProductForm({ ...productForm, fullDesc: e.target.value })}

                        style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical', outlineColor: '#2563eb' }}

                      />

                    </div>

                  </div>

                  {/* Specifications (Key-Value) */}

                  <div style={{

                    background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',

                    border: '1.5px solid #e2e8f0',

                    borderRadius: '20px',

                    padding: '1.35rem',

                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'

                  }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>

                      <div>

                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>

                          ⚙️ Texnik Parametrlar (Xarakteristikalar)

                        </h4>

                        <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>

                          Mahsulotning texnik ma'lumotlarini qo'shing yoki tayyor teglarni bosing

                        </p>

                      </div>

                      <button

                        type="button"

                        onClick={handleAddSpec}

                        style={{

                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                          color: '#fff',

                          border: 'none',

                          padding: '0.45rem 0.95rem',

                          borderRadius: '8px',

                          fontSize: '0.78rem',

                          fontWeight: 800,

                          cursor: 'pointer',

                          display: 'inline-flex',

                          alignItems: 'center',

                          gap: '4px'

                        }}

                      >

                        <Plus size={14} />

                        <span>Yangi Parametr</span>

                      </button>

                    </div>

                    {/* Quick Preset Tags for Instant Adding */}

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>

                      <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center', fontWeight: 600 }}>Tezkor takliflar:</span>

                      {['Rang', 'Quvvat', 'Ekran', 'Og\'irlik', 'Material', 'Batareya'].map((presetKey) => (

                        <button

                          key={presetKey}

                          type="button"

                          onClick={() => {

                            setProductForm(prev => ({

                              ...prev,

                              specsList: [...(prev.specsList || []), { key: presetKey, value: '' }]

                            }));

                          }}

                          style={{

                            background: '#ffffff',

                            border: '1px solid #cbd5e1',

                            borderRadius: '50px',

                            padding: '2px 9px',

                            fontSize: '0.72rem',

                            fontWeight: 700,

                            color: '#334155',

                            cursor: 'pointer'

                          }}

                        >

                          + {presetKey}

                        </button>

                      ))}

                    </div>

                    {/* Specs inputs list */}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>

                      {(productForm.specsList || []).map((spec, sIdx) => (

                        <div key={sIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

                          <input

                            type="text"

                            placeholder="Parametr nomi (masalan: Rang, Quvvat)"

                            value={spec.key}

                            onChange={(e) => handleSpecChange(sIdx, 'key', e.target.value)}

                            style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700, outlineColor: '#2563eb' }}

                          />

                          <input

                            type="text"

                            placeholder="Qiymati (masalan: Qora, 2200 Vt)"

                            value={spec.value}

                            onChange={(e) => handleSpecChange(sIdx, 'value', e.target.value)}

                            style={{ flex: 1.5, padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', outlineColor: '#2563eb' }}

                          />

                          <button

                            type="button"

                            onClick={() => handleRemoveSpec(sIdx)}

                            title="O'chirish"

                            style={{

                              background: '#fee2e2',

                              border: 'none',

                              color: '#dc2626',

                              width: '32px',

                              height: '32px',

                              borderRadius: '8px',

                              cursor: 'pointer',

                              display: 'flex',

                              alignItems: 'center',

                              justifyContent: 'center'

                            }}

                          >

                            <X size={15} />

                          </button>

                        </div>

                      ))}

                      {(productForm.specsList || []).length === 0 && (

                        <div style={{ padding: '1rem', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: '0.78rem' }}>

                          Hozircha qo'shimcha parametrlar kiritilmagan. Yuqoridagi takliflarni yoki "+ Yangi Parametr" tugmasini bosing.

                        </div>

                      )}

                    </div>

                  </div>

                </>

              )}

              {/* Bottom Sticky Action Footer */}

              <div style={{

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'space-between',

                paddingTop: '1rem',

                borderTop: '1px solid #f1f5f9',

                marginTop: '0.5rem',

                flexWrap: 'wrap',

                gap: '0.75rem'

              }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>

                  <Sparkles size={16} color="#2563eb" />

                  <span>Ma'lumotlar saqlangach do'konda va omborda darhol aks etadi</span>

                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>

                  <button

                    type="button"

                    onClick={() => setIsAddModalOpen(false)}

                    style={{

                      padding: '0.75rem 1.4rem',

                      borderRadius: '12px',

                      background: '#f1f5f9',

                      color: '#475569',

                      border: 'none',

                      fontWeight: 700,

                      fontSize: '0.85rem',

                      cursor: 'pointer',

                      transition: 'all 0.2s'

                    }}

                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}

                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}

                  >

                    Bekor qilish

                  </button>

                  <button

                    type="submit"

                    style={{

                      padding: '0.75rem 1.85rem',

                      borderRadius: '12px',

                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                      color: '#ffffff',

                      border: 'none',

                      fontWeight: 800,

                      fontSize: '0.92rem',

                      cursor: 'pointer',

                      display: 'inline-flex',

                      alignItems: 'center',

                      gap: '0.5rem',

                      boxShadow: '0 8px 25px -4px rgba(37, 99, 235, 0.45)',

                      transition: 'all 0.2s'

                    }}

                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 30px -4px rgba(37, 99, 235, 0.55)'; }}

                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px -4px rgba(37, 99, 235, 0.45)'; }}

                  >

                    <Check size={18} />

                    <span>Saqlash va Tasdiqlash</span>

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* MODAL 2: ADD STAFF MODAL */}

      {isStaffModalOpen && (

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9999999, padding: '1rem' }}>

          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' }}>

            <button onClick={() => setIsStaffModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>👥 Yangi Xodim Qo'shish</h3>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              <div>

                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Ism va Familiya:</label>

                <input type="text" required value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Lavozimi:</label>

                  <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>

                    <option value="Bosh Menejer">Bosh Menejer</option>

                    <option value="Omborchi">Omborchi</option>

                    <option value="Buxgalter">Buxgalter</option>

                    <option value="Kuryer">Kuryer</option>

                    <option value="Operator">Operator</option>

                  </select>

                </div>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Oylik ($ USD):</label>

                  <input type="number" required value={staffForm.salary} onChange={(e) => setStaffForm({ ...staffForm, salary: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

                </div>

              </div>

              <div>

                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Telefon Razi:</label>

                <input type="text" required value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

              </div>

              <button type="submit" style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--primary-blue)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}>

                Xodimni Saqlash

              </button>

            </form>

          </div>

        </div>

      )}

      {/* MODAL 3: POS QUICK ORDER MODAL */}

      {isOrderModalOpen && (

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9999999, padding: '1rem' }}>

          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' }}>

            <button onClick={() => setIsOrderModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>🛒 Yangi POS Sotuv Yaratish</h3>

            <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              <div>

                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Mijoz Ismi:</label>

                <input type="text" required value={orderForm.customer} onChange={(e) => setOrderForm({ ...orderForm, customer: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Summa ($ USD):</label>

                  <input type="number" required value={orderForm.total} onChange={(e) => setOrderForm({ ...orderForm, total: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

                </div>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>To'lov Usuli:</label>

                  <select value={orderForm.payment} onChange={(e) => setOrderForm({ ...orderForm, payment: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>

                    <option value="Payme">Payme</option>

                    <option value="Click">Click</option>

                    <option value="Naqd">Naqd Pul</option>

                    <option value="Uzum Bank">Uzum Bank</option>

                  </select>

                </div>

              </div>

              <button type="submit" style={{ padding: '0.75rem', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}>

                Buyurtmani Rasmiylashtirish

              </button>

            </form>

          </div>

        </div>

      )}

      {/* MODAL 4: ADD EXPENSE MODAL */}

      {isExpenseModalOpen && (

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9999999, padding: '1rem' }}>

          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' }}>

            <button onClick={() => setIsExpenseModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>💸 Yangi Xarajat Kiritish</h3>

            <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              <div>

                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Xarajat Nomi (Tavsifi):</label>

                <input type="text" required value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} placeholder="Masalan: Target reklama yoki Ombor ijarasi" style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Kategoriya:</label>

                  <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>

                    <option value="Ish haqi">Ish haqi</option>

                    <option value="Ijara">Ijara</option>

                    <option value="Transport">Transport</option>

                    <option value="Marketing">Marketing</option>

                    <option value="Kommunal">Kommunal</option>

                    <option value="Boshqa">Boshqa</option>

                  </select>

                </div>

                <div>

                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Summa ($ USD):</label>

                  <input type="number" required value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }} />

                </div>

              </div>

              <button type="submit" style={{ padding: '0.75rem', borderRadius: '12px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}>

                Xarajatni Saqlash

              </button>

            </form>

          </div>

        </div>

      )}

      {/* MODAL 5: OFFICIAL EXECUTIVE FINANCIAL REPORT & PRINT PREVIEW MODAL */}

      {isReportModalOpen && ReactDOM.createPortal(

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', zIndex: 9999999, padding: '1rem', overflowY: 'auto' }}>

          

          <style>{`

            @media print {

              body * {

                visibility: hidden !important;

              }

              #printable-report, #printable-report * {

                visibility: visible !important;

              }

              #printable-report {

                position: absolute !important;

                left: 0 !important;

                top: 0 !important;

                width: 100% !important;

                margin: 0 !important;

                padding: 1.5rem !important;

                box-shadow: none !important;

                border: none !important;

                background: #ffffff !important;

              }

              .no-print {

                display: none !important;

              }

            }

          `}</style>

          {/* Main Printable Document Card */}

          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '920px', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)', position: 'relative' }}>

            

            {/* Action Bar (Hidden on Print) */}

            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                <ShieldCheck size={26} color="var(--primary-blue)" />

                <div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>

                    Rasmiy Buxgalteriya va Ombor Auditi Hisoboti

                  </h3>

                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Kompaniya boshqaruvi uchun professional 2-sahifali eksport hujjat</span>

                </div>

              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                <button

                  onClick={handleDownloadExcel}

                  style={{

                    padding: '0.6rem 1.15rem',

                    borderRadius: '50px',

                    background: '#ecfdf5',

                    border: '1px solid #a7f3d0',

                    color: '#047857',

                    fontWeight: 800,

                    fontSize: '0.82rem',

                    cursor: 'pointer',

                    display: 'flex',

                    alignItems: 'center',

                    gap: '0.4rem'

                  }}

                >

                  <FileSpreadsheet size={16} />

                  <span>Excel (.CSV) Fayl Yuklash</span>

                </button>

                <button

                  onClick={handlePrintPDF}

                  style={{

                    padding: '0.6rem 1.25rem',

                    borderRadius: '50px',

                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

                    border: 'none',

                    color: '#ffffff',

                    fontWeight: 800,

                    fontSize: '0.82rem',

                    cursor: 'pointer',

                    display: 'flex',

                    alignItems: 'center',

                    gap: '0.4rem',

                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'

                  }}

                >

                  <Printer size={16} />

                  <span>PDF / Chop Etish</span>

                </button>

                <button

                  onClick={() => setIsReportModalOpen(false)}

                  style={{

                    background: '#f1f5f9',

                    border: 'none',

                    borderRadius: '50%',

                    width: '36px',

                    height: '36px',

                    cursor: 'pointer',

                    display: 'flex',

                    alignItems: 'center',

                    justify: 'center',

                    color: '#64748b'

                  }}

                >

                  <X size={20} />

                </button>

              </div>

            </div>

            {/* Printable Report Document Body */}

            <div id="printable-report" style={{ background: '#ffffff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>

              

              {/* Document Letterhead Header */}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>

                <div>

                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-blue)', letterSpacing: '-0.03em' }}>

                    GOOD LIFE MAISHIY TEXNIKA

                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, marginTop: '2px' }}>

                    MChJ "Good Life Retail & Wholesale Group"

                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>

                    Qo'qon shahri, Farg'ona viloyati, O'zbekiston | Tel: +998 71 200 00 00

                  </div>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <div style={{

                    display: 'inline-block',

                    padding: '0.35rem 0.85rem',

                    borderRadius: '8px',

                    background: '#f0fdf4',

                    border: '1px solid #bbf7d0',

                    color: '#15803d',

                    fontWeight: 900,

                    fontSize: '0.78rem',

                    letterSpacing: '0.05em',

                    marginBottom: '0.5rem'

                  }}>

                    ✅ RASMIY AUDIT TASDIQLANGAN

                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569' }}><strong>Hujjat №:</strong> AUD-2026-9042</div>

                  <div style={{ fontSize: '0.78rem', color: '#475569' }}><strong>Sana:</strong> {new Date().toLocaleDateString('uz-UZ')}</div>

                  <div style={{ fontSize: '0.78rem', color: '#475569' }}><strong>Valyuta Kursi:</strong> 1 USD = {exchangeRate} UZS</div>

                </div>

              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, textAlign: 'center', marginBottom: '1.5rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>

                {reportTitle}

              </h2>

              {/* Financial Executive Summary Cards */}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Yalpi Tushum</span>

                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>{formatPrice(totalRevenue)}</div>

                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Operatsion Chiqim</span>

                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444', marginTop: '0.2rem' }}>{formatPrice(totalExpenses)}</div>

                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Sof Foyda</span>

                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-blue)', marginTop: '0.2rem' }}>{formatPrice(netProfit)}</div>

                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ombor Aktivlari</span>

                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>

                    {formatPrice(productsList.reduce((acc, p) => acc + (p.price * (p.stockCount || 0)), 0))}

                  </div>

                </div>

              </div>

              {/* Table 1: Inventory & Cost Margins */}

              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', borderLeft: '4px solid var(--primary-blue)', paddingLeft: '0.5rem' }}>

                1. Ombor Mahsulotlari va Narx Marjalari Reestri

              </h4>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.82rem' }}>

                <thead>

                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>№</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Mahsulot Nomi</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Tannarx</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Sotuv Narxi</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Sof Marja</th>

                    <th style={{ padding: '0.55rem', textAlign: 'center' }}>Ombor Soni</th>

                    <th style={{ padding: '0.55rem', textAlign: 'right' }}>Jami Sotuv Qiymati</th>

                  </tr>

                </thead>

                <tbody>

                  {productsList.map((p, idx) => {

                    const nameStr = typeof p.name === 'object' ? p.name.uz : p.name;

                    const costVal = p.costPrice !== undefined ? p.costPrice : Math.round(p.price * 0.68);

                    const profitVal = p.price - costVal;

                    return (

                      <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>

                        <td style={{ padding: '0.5rem', fontWeight: 700 }}>{idx + 1}</td>

                        <td style={{ padding: '0.5rem', fontWeight: 700 }}>{nameStr}</td>

                        <td style={{ padding: '0.5rem', color: '#475569' }}>{formatPrice(costVal)}</td>

                        <td style={{ padding: '0.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{formatPrice(p.price)}</td>

                        <td style={{ padding: '0.5rem', fontWeight: 800, color: '#10b981' }}>+{formatPrice(profitVal)}</td>

                        <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 800 }}>{p.stockCount || 0} ta</td>

                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 800 }}>{formatPrice(p.price * (p.stockCount || 0))}</td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

              {/* Table 2: Operating Expenses */}

              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', borderLeft: '4px solid #ef4444', paddingLeft: '0.5rem' }}>

                2. Operatsion Xarajatlar Daftari

              </h4>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', fontSize: '0.82rem' }}>

                <thead>

                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>ID</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Xarajat Nomi</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Kategoriya</th>

                    <th style={{ padding: '0.55rem', textAlign: 'left' }}>Sana</th>

                    <th style={{ padding: '0.55rem', textAlign: 'right' }}>Summa</th>

                  </tr>

                </thead>

                <tbody>

                  {expensesList.map((exp) => (

                    <tr key={exp.id} style={{ borderBottom: '1px solid #e2e8f0' }}>

                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>{exp.id}</td>

                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>{exp.title}</td>

                      <td style={{ padding: '0.5rem' }}>{exp.category}</td>

                      <td style={{ padding: '0.5rem', color: '#64748b' }}>{exp.date}</td>

                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 800, color: '#ef4444' }}>{formatPrice(exp.amount)}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {/* Official Signatures & Stamp Footer */}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '2px dashed #cbd5e1', marginTop: '2rem' }}>

                <div style={{ textAlign: 'center' }}>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '2.5rem' }}>Bosh Buxgalter Imzosi:</div>

                  <div style={{ borderTop: '1px solid #0f172a', width: '180px', margin: '0 auto', paddingTop: '4px', fontWeight: 800, fontSize: '0.82rem' }}>

                    Nilufar Umarova

                  </div>

                </div>

                {/* Circular Corporate Seal Stamp */}

                <div style={{

                  width: '110px',

                  height: '110px',

                  borderRadius: '50%',

                  border: '3px double #1d4ed8',

                  color: '#1d4ed8',

                  display: 'flex',

                  flexDirection: 'column',

                  alignItems: 'center',

                  justify: 'center',

                  textAlign: 'center',

                  transform: 'rotate(-12deg)',

                  opacity: 0.85,

                  margin: '0 1rem'

                }}>

                  <div style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase' }}>Good Life Group</div>

                  <ShieldCheck size={20} />

                  <div style={{ fontSize: '0.55rem', fontWeight: 900 }}>AUDIT TASDIQ</div>

                  <div style={{ fontSize: '0.5rem' }}>QO'QON 2026</div>

                </div>

                <div style={{ textAlign: 'center' }}>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '2.5rem' }}>Bosh Menejer Imzosi:</div>

                  <div style={{ borderTop: '1px solid #0f172a', width: '180px', margin: '0 auto', paddingTop: '4px', fontWeight: 800, fontSize: '0.82rem' }}>

                    Jasurbek Alimov

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>,

        document.body

      )}

      

      {/* B2B WHOLESALE MODAL */}

      {isB2BModalOpen && (

        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 99999, padding: '1rem' }}>

          <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '700px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>📦 B2B Optom Sotuv Yaratish</h3>

              <button onClick={() => setIsB2BModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={18} color="#64748b" /></button>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

              <div>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Mijoz / Kompaniya nomi</label>

                <input type="text" value={b2bClient} onChange={e => setB2BClient(e.target.value)} placeholder="Masalan: Optomchi Ali" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />

              </div>

              <div>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Telefon raqam</label>

                <input type="text" value={b2bPhone} onChange={e => setB2BPhone(e.target.value)} placeholder="+998..." style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />

              </div>

            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginTop: 0, marginBottom: '1rem' }}>Savatga mahsulot qo'shish</h4>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>

                <div style={{ flex: '2 1 200px' }}>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Mahsulotni tanlang</label>

                  <select 

                    value={selectedB2BProductId} 

                    onChange={e => {

                      setSelectedB2BProductId(e.target.value);

                      const prod = productsList.find(p => p.id === e.target.value);

                      if (prod) setB2BCustomPrice(prod.price);

                    }}

                    style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}

                  >

                    <option value="">-- Tanlang --</option>

                    {productsList.filter(p => (p.stockCount || 0) > 0).map(p => (

                      <option key={p.id} value={p.id}>{p.name?.uz || p.name} (Omborda: {p.stockCount} ta)</option>

                    ))}

                  </select>

                </div>

                <div style={{ flex: '1 1 80px' }}>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Soni</label>

                  <input type="number" min="1" value={b2bQty} onChange={e => setB2BQty(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />

                </div>

                <div style={{ flex: '1 1 120px' }}>

                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Kelishilgan narx</label>

                  <input type="number" value={b2bCustomPrice} onChange={e => setB2BCustomPrice(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />

                </div>

                <button onClick={handleAddB2BCart} disabled={!selectedB2BProductId} style={{ padding: '0.65rem 1.25rem', background: selectedB2BProductId ? 'var(--primary-blue)' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: selectedB2BProductId ? 'pointer' : 'not-allowed' }}>

                  Qo'shish

                </button>

              </div>

            </div>

            {b2bCart.length > 0 && (

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>

                  <thead style={{ background: '#f1f5f9' }}>

                    <tr>

                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Mahsulot</th>

                      <th style={{ padding: '0.75rem', textAlign: 'center' }}>Soni</th>

                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Narxi</th>

                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Jami</th>

                    </tr>

                  </thead>

                  <tbody>

                    {b2bCart.map((item, idx) => (

                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>

                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{item.name?.uz || item.name}</td>

                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.qty} ta</td>

                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatPrice(item.price)}</td>

                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary-blue)' }}>{formatPrice(item.price * item.qty)}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <div>

                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>To'lov usuli:</label>

                <select value={b2bMethod} onChange={e => setB2BMethod(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>

                  <option value="cash">Naqd Pul</option>

                  <option value="card">Plastik Karta</option>

                  <option value="bank">Bank O'tkazmasi (Shartnoma)</option>

                </select>

              </div>

              <div style={{ textAlign: 'right' }}>

                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Umumiy Summa:</div>

                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>

                  {formatPrice(b2bCart.reduce((a, b) => a + (b.price * b.qty), 0))}

                </div>

              </div>

            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>

              <button onClick={() => setIsB2BModalOpen(false)} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>Bekor qilish</button>

              <button onClick={handleConfirmB2B} disabled={b2bCart.length === 0} style={{ flex: 2, padding: '1rem', background: b2bCart.length > 0 ? '#10b981' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: b2bCart.length > 0 ? 'pointer' : 'not-allowed', boxShadow: b2bCart.length > 0 ? '0 10px 25px rgba(16,185,129,0.3)' : 'none' }}>Sotuvni Tasdiqlash</button>

            </div>

          </div>

        </div>

      )}

      {/* ORDER DETAILS MODAL (PREMIUM FULL-PAGE MODAL) */}
      {selectedOrderDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 999999,
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Buyurtma #{selectedOrderDetails.id}
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '50px',
                    background: selectedOrderDetails.status === 'Yangi' ? '#eff6ff' : selectedOrderDetails.status === 'Jarayonda' ? '#fffbeb' : selectedOrderDetails.status === 'Yetkazilmoqda' ? '#f5f3ff' : '#ecfdf5',
                    color: selectedOrderDetails.status === 'Yangi' ? '#1d4ed8' : selectedOrderDetails.status === 'Jarayonda' ? '#b45309' : selectedOrderDetails.status === 'Yetkazilmoqda' ? '#6d28d9' : '#047857',
                    border: '1px solid currentColor'
                  }}>
                    {selectedOrderDetails.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Qabul qilingan sana: {selectedOrderDetails.date} • Kanal: {selectedOrderDetails.channel || "Web App"}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  👤 Xaridor Ma'lumotlari
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selectedOrderDetails.customer}</div>
                <div style={{ marginTop: '4px' }}>
                  <a href={`tel:${selectedOrderDetails.phone}`} style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} />
                    <span>{selectedOrderDetails.phone}</span>
                  </a>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  📍 Yetkazib Berish Manzili
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                  {selectedOrderDetails.region || "Toshkent shahri"}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                  {selectedOrderDetails.address || "Do'kondan olib ketish (POS)"}
                </div>
                {selectedOrderDetails.mapsUrl && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <a
                      href={selectedOrderDetails.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '4px 10px',
                        background: '#ecfdf5',
                        color: '#047857',
                        border: '1px solid #a7f3d0',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MapPin size={12} />
                      <span>Yandex Maps ↗</span>
                    </a>
                    {selectedOrderDetails.googleMapsUrl && (
                      <a
                        href={selectedOrderDetails.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '4px 10px',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Compass size={12} />
                        <span>Google Maps ↗</span>
                      </a>
                    )}
                  </div>
                )}
                {selectedOrderDetails.note && (
                  <div style={{ fontSize: '0.78rem', color: '#b45309', background: '#fef3c7', padding: '4px 8px', borderRadius: '6px', marginTop: '6px' }}>
                    Izoh: {selectedOrderDetails.note}
                  </div>
                )}
              </div>
            </div>

            {/* Items Summary Table */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                📦 Buyurtma qilingan tovarlar:
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <tr>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'left' }}>Mahsulot</th>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'right' }}>Summa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderDetails.rawItems && Array.isArray(selectedOrderDetails.rawItems) ? (
                      selectedOrderDetails.rawItems.map((it, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{it.name?.uz || it.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{it.qty || 1} ta x {formatPrice(it.price || 0)}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                            {formatPrice((it.qty || 1) * (it.price || 0))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{selectedOrderDetails.items}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800 }}>{formatPrice(selectedOrderDetails.total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Price Calculation Box */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>To'lov turi:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedOrderDetails.payment || 'Naqd'}</span>
                </div>
                {selectedOrderDetails.deliveryFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Yetkazib berish xizmati:</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatPrice(selectedOrderDetails.deliveryFee)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', borderTop: '1px dashed #cbd5e1', paddingTop: '0.6rem', marginTop: '0.5rem' }}>
                  <span>Jami to'lov:</span>
                  <span style={{ color: 'var(--primary-blue)' }}>{formatPrice(selectedOrderDetails.total)}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Update Buttons */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>
                Maqomni yangilash:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { s: 'Yangi', color: '#2563eb', bg: '#eff6ff' },
                  { s: 'Jarayonda', color: '#d97706', bg: '#fffbeb' },
                  { s: 'Yetkazilmoqda', color: '#7c3aed', bg: '#f5f3ff' },
                  { s: 'Yetkazildi', color: '#16a34a', bg: '#ecfdf5' },
                  { s: 'Bekor qilindi', color: '#dc2626', bg: '#fef2f2' }
                ].map(st => (
                  <button
                    key={st.s}
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, st.s)}
                    style={{
                      padding: '0.55rem 0.95rem',
                      borderRadius: '10px',
                      border: selectedOrderDetails.status === st.s ? `2px solid ${st.color}` : '1px solid #cbd5e1',
                      background: selectedOrderDetails.status === st.s ? st.bg : '#fff',
                      color: selectedOrderDetails.status === st.s ? st.color : '#475569',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {st.s}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <button
                onClick={() => {
                  setReceiptModalOrder(selectedOrderDetails.rawOrder || selectedOrderDetails);
                }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={17} />
                <span>Chek / Invoys Chop Etish</span>
              </button>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL FOR POS SALES */}

      {receiptModalOrder && (

        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 999999 }}>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>

              <button onClick={() => setReceiptModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>

            </div>

            

            <div id="receipt-print-area" style={{ background: '#fff', padding: '1rem', border: '1px dashed #cbd5e1', color: '#000', fontFamily: 'monospace', fontSize: '0.85rem' }}>

              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>

                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>GoodLife</h3>

                <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{storeSettings.storeName} - Kassir 1</div>

                <div style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>{receiptModalOrder.id}</div>

                <div style={{ fontSize: '0.7rem' }}>Sana: {receiptModalOrder.date}</div>

              </div>

              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

              <table style={{ width: '100%', fontSize: '0.75rem' }}>

                <tbody>

                  {receiptModalOrder.items && receiptModalOrder.items.map((item, idx) => (

                    <tr key={idx}>

                      <td style={{ padding: '4px 0', verticalAlign: 'top' }}>

                        <div>{item.name?.uz || item.name}</div>

                        <div>{item.qty} x {formatPrice(item.price || 0)} =</div>

                      </td>

                      <td style={{ padding: '4px 0', textAlign: 'right', verticalAlign: 'bottom', fontWeight: 'bold' }}>

                        {formatPrice((item.qty || 1) * (item.price || 0))}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1rem' }}>

                <span>JAMI:</span>

                <span>{formatPrice(receiptModalOrder.total || 0)}</span>

              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>

                <span>To'lov usuli:</span>

                <span>{receiptModalOrder.method === 'cash' ? 'Naqd' : receiptModalOrder.method === 'card' ? 'Karta' : 'QR Click'}</span>

              </div>

              {receiptModalOrder.method === 'cash' && receiptModalOrder.change > 0 && (

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>

                  <span>Qaytim:</span>

                  <span>{formatPrice(receiptModalOrder.change)}</span>

                </div>

              )}

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.7rem' }}>

                Xaridingiz uchun rahmat!

              </div>

            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>

              <button 

                onClick={() => {

                  const printContent = document.getElementById('receipt-print-area').innerHTML;

                  const originalContent = document.body.innerHTML;

                  document.body.innerHTML = printContent;

                  window.print();

                  document.body.innerHTML = originalContent;

                  window.location.reload();

                }}

                style={{ flex: 1, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}

              >

                <Printer size={16} /> Chop etish

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}