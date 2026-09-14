import React, { useState, useMemo, useEffect } from "react";
import {
  Store, LogOut, Search, ShoppingCart, Plus, Minus, X, Trash2,
  CreditCard, Banknote, QrCode, Receipt, CheckCircle, Package,
  TrendingUp, DollarSign, AlertCircle, Printer, BarChart3, ShoppingBag, Clock,
  Settings, Calculator, Box, Edit, ChevronDown, Filter
} from "lucide-react";
import { dealProducts, pcAccessories, recentlyAddedProducts, categories as allCategories } from "../data/products";
import { StorageService } from "../services/storageService";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";

const getName = (p, lang) => {
  if (p.nameUz) return String(p.nameUz);
  if (typeof p.name === 'object' && p.name !== null) return String(p.name[lang] || p.name.uz || '');
  return String(p.name || '');
};

function PayCard({ icon: Icon, label, color, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      border: `2px solid ${selected ? color : "#e2e8f0"}`,
      borderRadius: "16px", padding: "1.25rem 0.5rem", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
      background: selected ? `${color}0A` : "#ffffff",
      transition: "all 0.2s ease", flex: 1, userSelect: "none",
      boxShadow: selected ? `0 4px 15px ${color}20` : "0 2px 4px rgba(0,0,0,0.02)"
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        background: selected ? color : "#f1f5f9",
        color: selected ? "#fff" : "#64748b",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease"
      }}><Icon size={24} /></div>
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: selected ? "#2563eb" : "#64748b" }}>{label}</span>
    </div>
  );
}

function ReceiptTemplate({ order, lang, formatPrice }) {
  if (!order) return null;
  return (
    <div id="receipt-print-area" style={{ background: "#fff", padding: "1.5rem", borderRadius: "4px", border: "1px dashed #cbd5e1", marginBottom: "1.5rem", textAlign: "left", fontFamily: "'Courier New', Courier, monospace", color: "#000", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 900, fontSize: "1.4rem", letterSpacing: "1px" }}>GOOD LIFE</div>
        <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>Maishiy texnika do'koni</div>
        <div style={{ fontSize: "0.8rem" }}>Qo'qon shahar, O'zbekiston</div>
        <div style={{ fontSize: "0.8rem" }}>Tel: +998 71 200 00 00</div>
      </div>
      
      <div style={{ borderTop: "1px dashed #cbd5e1", borderBottom: "1px dashed #cbd5e1", padding: "0.75rem 0", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span>Chek:</span> <strong>{order.id}</strong></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span>Sana:</span> <span>{order.date}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Kassir:</span> <span>Asosiy Admin</span></div>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ marginBottom: "8px", fontSize: "0.85rem" }}>
            <div style={{ fontWeight: 600 }}>{getName(item, lang)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", marginTop: "2px" }}>
              <span>{item.qty} x {formatPrice(item.price)}</span>
              <span style={{ fontWeight: 700, color: "#000" }}>{formatPrice(item.price * item.qty)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "0.75rem", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span>Jami:</span> <span>{formatPrice(order.total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span>Chegirma:</span> <span>0</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "1.1rem", marginTop: "8px", marginBottom: "8px" }}>
          <span>TO'LOV:</span> <span>{formatPrice(order.total)}</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", marginBottom: "4px" }}>
          <span>To'lov turi:</span> <span>{order.method === "cash" ? "Naqd pul" : order.method === "card" ? "Plastik karta" : "QR / Click"}</span>
        </div>
        
        {order.method === "cash" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", marginBottom: "4px" }}>
              <span>Berildi:</span> <span>{formatPrice(order.total + order.change)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontWeight: 700 }}>
              <span>Qaytim:</span> <span>{formatPrice(order.change)}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: "1rem", paddingTop: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem" }}>XARIDINGIZ UCHUN RAHMAT!</div>
        <QrCode size={48} color="#000" style={{ opacity: 0.8 }} />
      </div>
    </div>
  );
}

export default function DokonPanel({ onLogout }) {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const { currency, setCurrency, formatPrice, exchangeRate } = useCurrency();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCatName = (catId) => {
    if (catId === "all") return "Barcha mahsulotlar";
    const c = categories.find(x => x.id === catId);
    return c ? (c.title[lang] || c.title.uz || catId) : catId;
  };

  const [products, setProducts] = useState(() => StorageService.getProducts());

  useEffect(() => {
    const handleSync = () => {
      setProducts(StorageService.getProducts());
    };
    window.addEventListener('goodlife_products_updated', handleSync);
    window.addEventListener('goodlife_backup_restored', handleSync);
    return () => {
      window.removeEventListener('goodlife_products_updated', handleSync);
      window.removeEventListener('goodlife_backup_restored', handleSync);
    };
  }, []);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    StorageService.saveProducts(newProducts);
  };

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(() => {
    const local = localStorage.getItem("goodlife_dokon_categories");
    if (local) { try { return JSON.parse(local); } catch (_) {} }
    return allCategories;
  });
  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [catForm, setCatForm] = useState({ id: "", titleUz: "", titleRu: "" });

  const saveCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem("goodlife_dokon_categories", JSON.stringify(newCats));
  };

  const [productModal, setProductModal] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [prodForm, setProdForm] = useState({ name: "", category: "smartphones", price: 0, stockCount: 0, image: "" });
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState([]);
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("cash");
  const [cashInput, setCashInput] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(() => {
    try { const s = localStorage.getItem("goodlife_dokon_orders"); return s ? JSON.parse(s) : []; } catch (_) { return []; }
  });
  const [tab, setTab] = useState("pos");

  const cats = useMemo(() => ["all", ...categories.map(c => c.id)], [categories]);

  const filtered = useMemo(() => products.filter(p => {
    const mc = activeCat === "all" || p.category === activeCat;
    const ms = !search || getName(p, lang).toLowerCase().includes(search.toLowerCase());
    return mc && ms && (p.stockCount === undefined || p.stockCount > 0);
  }), [products, search, activeCat, lang]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const add = (p) => setCart(prev => {
    const ex = prev.find(i => i.id === p.id);
    if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...p, qty: 1 }];
  });
  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const qty = (id, d) => setCart(prev => prev.map(i => {
    if (i.id !== id) return i;
    const q = i.qty + d;
    return q <= 0 ? null : { ...i, qty: q };
  }).filter(Boolean));

  const pay = () => { if (!cart.length) return; setPayModal(true); setCashInput(""); setPayMethod("cash"); };

  const inputInUSD = currency === 'UZS' ? Number(cashInput) / exchangeRate : Number(cashInput);
  const change = payMethod === "cash" && cashInput ? Math.max(0, inputInUSD - total) : 0;
  const canPay = payMethod !== "cash" || (inputInUSD >= total - 0.001 && cashInput !== "");
  
  const confirm = () => {
    const order = { id: `GL-${Date.now()}`, date: new Date().toLocaleString("uz-UZ"), items: [...cart], total, method: payMethod, change };
    const updated = [order, ...orders];
    setOrders(updated);
    try { localStorage.setItem("goodlife_dokon_orders", JSON.stringify(updated)); } catch (_) {}

    // Synchronize stock decrement across warehouse and catalog
    StorageService.decrementStock(cart);

    setLastReceipt(order); setCart([]); setPayModal(false); setSuccessModal(true);
    showToast("Sotuv muvaffaqiyatli amalga oshirildi!");
  };

  const todayRev = orders.reduce((s, o) => s + o.total, 0);

  const openCatModal = (cat = null) => {
    if (cat) {
      setEditCat(cat);
      setCatForm({ id: cat.id, titleUz: cat.title.uz || '', titleRu: cat.title.ru || '' });
    } else {
      setEditCat(null);
      setCatForm({ id: "", titleUz: "", titleRu: "" });
    }
    setCatModal(true);
  };

  const saveCategory = () => {
    if (!catForm.titleUz) return showToast("Kategoriya nomi kiritilmagan!");
    let updated;
    const newCat = {
      id: editCat ? editCat.id : (catForm.id || "cat-" + Date.now()),
      title: { uz: catForm.titleUz, ru: catForm.titleRu },
      icon: "Box"
    };
    if (editCat) {
      updated = categories.map(c => c.id === editCat.id ? newCat : c);
      showToast("Kategoriya tahrirlandi!");
    } else {
      updated = [...categories, newCat];
      showToast("Yangi kategoriya qo'shildi!");
    }
    saveCategories(updated);
    setCatModal(false);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Kategoriyani o'chirishni xohlaysizmi?")) {
      saveCategories(categories.filter(c => c.id !== id));
      showToast("Kategoriya o'chirildi!");
    }
  };

  const openProdModal = (prod = null) => {
    if (prod) {
      setEditProd(prod);
      setProdForm({ name: getName(prod, 'uz'), category: prod.category || 'smartphones', price: prod.price || 0, stockCount: prod.stockCount !== undefined ? prod.stockCount : 10, image: (prod.images && prod.images[0]) || prod.image || "" });
    } else {
      setEditProd(null);
      setProdForm({ name: "", category: "smartphones", price: 0, stockCount: 0, image: "" });
    }
    setProductModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProdForm({ ...prodForm, image: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = () => {
    if (!prodForm.name || prodForm.price <= 0) {
      showToast("Iltimos, mahsulot nomi va narxini to'g'ri kiriting!");
      return;
    }
    let updated;
    if (editProd) {
      updated = products.map(p => p.id === editProd.id ? { ...p, name: { uz: prodForm.name }, category: prodForm.category, price: Number(prodForm.price), stockCount: Number(prodForm.stockCount), image: prodForm.image } : p);
      showToast("Mahsulot muvaffaqiyatli tahrirlandi!");
    } else {
      const newP = { id: "LOCAL-" + Date.now(), name: { uz: prodForm.name }, category: prodForm.category, price: Number(prodForm.price), stockCount: Number(prodForm.stockCount), image: prodForm.image };
      updated = [newP, ...products];
      showToast("Yangi mahsulot omborga qo'shildi!");
    }
    saveProducts(updated);
    setProductModal(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Rostdan ham bu mahsulotni ombordan o'chirmoqchimisiz?")) {
      saveProducts(products.filter(p => p.id !== id));
      showToast("Mahsulot o'chirildi!");
    }
  };

  const N = { 
    pos: [ShoppingCart, "Kassa"], 
    inventory: [Box, "Ombor"],
    history: [Receipt, "Tarixi"], 
    finance: [Calculator, "Moliya"],
    stats: [BarChart3, "Hisobot"],
    settings: [Settings, "Sozlama"]
  };

  return (
    <div style={{ height: "100vh", background: "#f8f9fa", fontFamily: "'Inter',-apple-system,sans-serif", display: "flex", overflow: "hidden" }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: "90px", background: "#ffffff", borderRight: "1px solid #eaedf1", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 0", zIndex: 10 }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", boxShadow: "0 8px 20px rgba(37,99,235,0.2)" }}>
          <Store size={24} color="#fff" />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, width: "100%", alignItems: "center" }}>
          {Object.entries(N).map(([id, [Icon, label]]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              width: "64px", height: "64px", borderRadius: "16px", border: "none",
              background: tab === id ? "#2563eb" : "transparent",
              color: tab === id ? "#ffffff" : "#94a3b8",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
              cursor: "pointer", transition: "all 0.2s ease"
            }} onMouseEnter={e => { if(tab !== id) e.currentTarget.style.color = "#2563eb"; }} onMouseLeave={e => { if(tab !== id) e.currentTarget.style.color = "#94a3b8"; }}>
              <Icon size={22} strokeWidth={tab === id ? 2.5 : 2} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>{label}</span>
            </button>
          ))}
        </div>

        <button onClick={onLogout} style={{ width: "64px", height: "64px", borderRadius: "16px", border: "none", background: "#fef2f2", color: "#ef4444", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#fee2e2"} onMouseLeave={e => e.currentTarget.style.background="#fef2f2"}>
          <LogOut size={22} />
          <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>Chiqish</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Top Header */}
        <header style={{ height: "80px", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8f9fa" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#2563eb" }}>
              {tab === "pos" ? "Yangi Sotuv" : 
               tab === "inventory" ? "Do'kon Ombori" : 
               tab === "history" ? "Sotuvlar Tarixi" : 
               tab === "finance" ? "Buxgalteriya va Moliya" : 
               tab === "stats" ? "Do'kon Hisoboti" : 
               "Sozlamalar"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem", marginTop: "4px", fontWeight: 500 }}>
              <Clock size={14} />
              {time.toLocaleDateString("uz-UZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Search - only in POS */}
            {tab === "pos" && (
              <div style={{ position: "relative", width: "320px" }}>
                <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Mahsulot qidirish..." style={{ width: "100%", boxSizing: "border-box", padding: "0.8rem 1rem 0.8rem 2.8rem", border: "none", borderRadius: "100px", fontSize: "0.95rem", outline: "none", background: "#ffffff", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", fontFamily: "inherit", fontWeight: 500, color: "#2563eb" }} />
              </div>
            )}
            
            {/* Currency Toggle */}
            <div style={{ display: "flex", background: "#ffffff", borderRadius: "100px", padding: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <button onClick={() => setCurrency('USD')} style={{ background: currency === 'USD' ? '#2563eb' : 'transparent', color: currency === 'USD' ? '#fff' : '#64748b', border: 'none', borderRadius: '100px', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: "all 0.2s" }}>USD</button>
              <button onClick={() => setCurrency('UZS')} style={{ background: currency === 'UZS' ? '#2563eb' : 'transparent', color: currency === 'UZS' ? '#fff' : '#64748b', border: 'none', borderRadius: '100px', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: "all 0.2s" }}>UZS</button>
            </div>
          </div>
        </header>

        {tab === "pos" && (
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            
            {/* Products Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 2rem 2rem", overflow: "hidden" }}>
              
                            {/* Premium Categories Dropdown */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.25rem", borderBottom: "1px solid #eaedf1", marginBottom: "1.25rem", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
                    <Filter size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.2rem" }}>
                      {activeCat === "all" ? "Barcha mahsulotlar" : getCatName(activeCat)}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600, marginTop: "2px" }}>Tanlangan kategoriya</div>
                  </div>
                </div>
                
                <div style={{ position: "relative" }}>
                  <button onClick={() => setIsCatOpen(!isCatOpen)} style={{ padding: "0.85rem 1.25rem", borderRadius: "14px", border: "1px solid #eaedf1", background: "#ffffff", fontWeight: 700, color: "#0f172a", outline: "none", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "12px", minWidth: "240px", justifyContent: "space-between", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor="#2563eb"} onMouseLeave={e => e.currentTarget.style.borderColor="#eaedf1"}>
                    <span style={{ fontSize: "0.95rem" }}>{activeCat === "all" ? "Barcha mahsulotlar" : getCatName(activeCat)}</span>
                    <ChevronDown size={18} color="#64748b" style={{ transform: isCatOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }} />
                  </button>
                  
                  {isCatOpen && (
                    <>
                      <div onClick={() => setIsCatOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }}></div>
                      <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "260px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 100, border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", animation: "fadeIn 0.2s ease" }}>
                        <div style={{ maxHeight: "300px", overflowY: "auto", padding: "0.5rem" }}>
                          {cats.map(c => (
                            <div key={c} onClick={() => { setActiveCat(c); setIsCatOpen(false); }} style={{ padding: "0.85rem 1rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", background: activeCat === c ? "#f0fdf4" : "transparent", color: activeCat === c ? "#16a34a" : "#475569", fontWeight: activeCat === c ? 800 : 600, fontSize: "0.9rem", transition: "all 0.1s" }} onMouseEnter={e => { if(activeCat !== c) e.currentTarget.style.background="#f8f9fa" }} onMouseLeave={e => { if(activeCat !== c) e.currentTarget.style.background="transparent" }}>
                              {getCatName(c)}
                              {activeCat === c && <CheckCircle size={16} color="#16a34a" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Grid */}
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px", paddingBottom: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1.25rem" }}>
                  {filtered.map(p => {
                    const ic = cart.find(i => i.id === p.id);
                    const img = (p.images && p.images[0]) || p.image || null;
                    return (
                      <div key={p.id} onClick={() => add(p)} style={{ background: "#ffffff", borderRadius: "24px", padding: "1rem", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", position: "relative", userSelect: "none", border: "1px solid rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.03)"; }}>
                        {ic && (
                          <div style={{ position: "absolute", top: "12px", right: "12px", background: "#2563eb", color: "#fff", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, zIndex: 2, boxShadow: "0 4px 10px rgba(37,99,235,0.3)" }}>
                            {ic.qty}
                          </div>
                        )}
                        <div style={{ width: "100%", aspectRatio: "1", borderRadius: "16px", background: "#f8f9fa", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                          {img ? <img src={img} alt="" style={{ width: "85%", height: "85%", objectFit: "contain", mixBlendMode: "multiply" }} /> : <Package size={40} color="#cbd5e1" />}
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2563eb", lineHeight: 1.3, marginBottom: "0.5rem", height: "2.6em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {getName(p, lang)}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div style={{ fontWeight: 900, color: "#2563eb", fontSize: "1.1rem" }}>{formatPrice(p.price)}</div>
                          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
                            <Plus size={16} strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#94a3b8" }}><Package size={64} style={{ opacity: 0.2, marginBottom: "1rem" }} /><div style={{ fontWeight: 600, fontSize: "1.1rem" }}>Mahsulot topilmadi</div></div>}
                </div>
              </div>
            </div>

            {/* Cart Panel */}
            <div style={{ width: "380px", background: "#ffffff", borderRadius: "24px 0 0 24px", display: "flex", flexDirection: "column", boxShadow: "-4px 0 30px rgba(0,0,0,0.03)", margin: "0 0 1.5rem 0", border: "1px solid #eaedf1" }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.2rem", color: "#2563eb" }}>Joriy Buyurtma</h2>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "2px", fontWeight: 500 }}>Buyurtma #{String(Date.now()).slice(-6)}</div>
                </div>
                {cart.length > 0 && <button onClick={() => setCart([])} style={{ background: "#fef2f2", border: "none", borderRadius: "10px", padding: "8px", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#fee2e2"} onMouseLeave={e => e.currentTarget.style.background="#fef2f2"}><Trash2 size={18} /></button>}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
                {cart.length === 0 ? (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", textAlign: "center" }}>
                    <ShoppingCart size={64} style={{ opacity: 0.3, marginBottom: "1.5rem" }} />
                    <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: "1.1rem" }}>Savat bo'sh</div>
                    <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", maxWidth: "200px" }}>Mahsulotlarni qo'shish uchun chap tomondagi ro'yxatdan tanlang</div>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: "1px dashed #eaedf1" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "14px", background: "#f8f9fa", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                      {(item.images && item.images[0]) || item.image ? <img src={(item.images && item.images[0]) || item.image} alt="" style={{ width: "80%", height: "80%", objectFit: "contain", mixBlendMode: "multiply" }} /> : <Package size={24} color="#cbd5e1" />}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{getName(item, lang)}</div>
                      <div style={{ fontSize: "0.95rem", color: "#2563eb", fontWeight: 900 }}>{formatPrice(item.price * item.qty)}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #eaedf1" }}>
                          <button onClick={() => qty(item.id, -1)} style={{ width: "28px", height: "28px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><Minus size={14} /></button>
                          <span style={{ fontWeight: 800, width: "24px", textAlign: "center", fontSize: "0.85rem", color: "#2563eb" }}>{item.qty}</span>
                          <button onClick={() => qty(item.id, 1)} style={{ width: "28px", height: "28px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}><Plus size={14} /></button>
                        </div>
                        <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px", fontSize: "0.75rem", fontWeight: 600, textDecoration: "underline" }}>O'chirish</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "1.5rem", background: "#f8f9fa", borderRadius: "0 0 0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>
                  <span>Oraliq summa</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem", fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>
                  <span>QQS (0%)</span><span>{formatPrice(0)}</span>
                </div>
                
                <div style={{ borderTop: "2px dashed #e2e8f0", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#2563eb", fontSize: "1.1rem", fontWeight: 800 }}>Jami to'lov</span>
                    <span style={{ fontWeight: 900, fontSize: "1.6rem", color: "#2563eb", letterSpacing: "-0.5px" }}>{formatPrice(total)}</span>
                  </div>
                </div>

                <button onClick={pay} disabled={!cart.length} style={{ width: "100%", padding: "1.1rem", background: !cart.length ? "#e2e8f0" : "#2563eb", color: !cart.length ? "#94a3b8" : "#fff", border: "none", borderRadius: "16px", fontSize: "1.05rem", fontWeight: 800, cursor: !cart.length ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s", boxShadow: cart.length ? "0 8px 20px rgba(37,99,235,0.25)" : "none" }} onMouseEnter={e => { if(cart.length) e.currentTarget.style.transform = "translateY(-2px)" }} onMouseLeave={e => { if(cart.length) e.currentTarget.style.transform = "translateY(0)" }}>
                  <CreditCard size={20} /> To'lovga o'tish
                </button>
              </div>
            </div>

          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              {orders.length === 0 ? (
                <div style={{ background: "#ffffff", borderRadius: "24px", padding: "4rem", textAlign: "center", color: "#94a3b8", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  <Receipt size={64} style={{ opacity: 0.2, marginBottom: "1.5rem" }} />
                  <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#64748b" }}>Hali sotuvlar mavjud emas</div>
                </div>
              ) : orders.map(o => (
                <div key={o.id} onClick={() => setSelectedOrder(o)} style={{ cursor: "pointer", background: "#ffffff", borderRadius: "20px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1rem", transition: "all 0.2s", border: "1px solid rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.06)"; }} onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.02)"; }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2563eb" }}>
                    <Receipt size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ fontWeight: 800, color: "#2563eb", fontSize: "1.05rem" }}>{o.id}</div>
                      <div style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>{o.items.length} TA MAHSULOT</div>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px", fontWeight: 500 }}>{o.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, color: "#2563eb", fontSize: "1.2rem" }}>{formatPrice(o.total)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end", fontSize: "0.8rem", color: "#64748b", marginTop: "4px", fontWeight: 600 }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                      Muvaffaqiyatli РІР‚Сћ {o.method === "cash" ? "Naqd" : o.method === "card" ? "Karta" : "QR"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { label: "Bugungi tushum", value: `${formatPrice(todayRev)}`, icon: DollarSign },
                  { label: "Tranzaksiyalar", value: `${orders.length} ta`, icon: Receipt },
                  { label: "O'rtacha chek", value: `${formatPrice(orders.length ? todayRev / orders.length : 0)}`, icon: TrendingUp },
                  { label: "Sotilgan mahsulotlar", value: `${orders.reduce((s,o)=>s+o.items.reduce((sum,i)=>sum+i.qty,0),0)} ta`, icon: ShoppingBag },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#ffffff", borderRadius: "24px", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1rem", border: "1px solid rgba(0,0,0,0.02)" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}><s.icon size={26} strokeWidth={2.5} /></div>
                    <div>
                      <div style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>{s.label}</div>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem", color: "#2563eb", letterSpacing: "-0.5px" }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.2rem", color: "#2563eb" }}>Mahsulotlar zaxirasi</h2>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>Do'kondagi mavjud mahsulotlar qoldig'i</div>
                </div>
                <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", padding: "0.8rem 1.5rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(37,99,235,0.2)" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"} onClick={() => openProdModal()}>
                  <Plus size={18} /> Qabul qilish</button>
              </div>
              
              <div style={{ background: "#ffffff", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden", border: "1px solid rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ background: "#f8f9fa", borderBottom: "1px solid #eaedf1" }}>
                    <tr>
                      <th style={{ padding: "1.25rem 1.5rem", color: "#64748b", fontWeight: 700, fontSize: "0.85rem" }}>MAHSULOT NOMI</th>
                      <th style={{ padding: "1.25rem 1.5rem", color: "#64748b", fontWeight: 700, fontSize: "0.85rem" }}>KATEGORIYA</th>
                      <th style={{ padding: "1.25rem 1.5rem", color: "#64748b", fontWeight: 700, fontSize: "0.85rem" }}>NARXI</th>
                      <th style={{ padding: "1.25rem 1.5rem", color: "#64748b", fontWeight: 700, fontSize: "0.85rem", textAlign: "right" }}>QOLDIQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #eaedf1" }}>
                        <td style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            {p.images?.[0] || p.image ? <img src={p.images?.[0] || p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} /> : <Package size={20} color="#cbd5e1" />}
                          </div>
                          <span style={{ fontWeight: 700, color: "#2563eb", fontSize: "0.9rem" }}>{getName(p, lang)}</span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>{getCatName(p.category)}</td>
                        <td style={{ padding: "1rem 1.5rem", color: "#0f172a", fontWeight: 800 }}>{formatPrice(p.price)}</td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right", color: p.stockCount > 5 ? "#10b981" : "#f59e0b", fontWeight: 900 }}>{p.stockCount !== undefined ? p.stockCount : 0} dona</td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                            <button onClick={() => openProdModal(p)} style={{ background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Edit size={16} /></button>
                            <button onClick={() => deleteProduct(p.id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "finance" && (
          <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                
                <div style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "24px", padding: "2rem", color: "#fff", boxShadow: "0 10px 30px rgba(37,99,235,0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.2)", width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><Banknote size={24} /></div>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem", opacity: 0.9 }}>Kassadagi Naqd Pul</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "2.2rem", letterSpacing: "-1px" }}>{formatPrice(orders.filter(o=>o.method==="cash").reduce((s,o)=>s+o.total,0))}</div>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "24px", padding: "2rem", border: "1px solid #eaedf1", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                    <div style={{ background: "#f8f9fa", color: "#2563eb", width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><CreditCard size={24} /></div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#64748b" }}>Plastik Karta / QR</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "2.2rem", color: "#0f172a", letterSpacing: "-1px" }}>{formatPrice(orders.filter(o=>o.method!=="cash").reduce((s,o)=>s+o.total,0))}</div>
                </div>

              </div>

              <div style={{ background: "#ffffff", borderRadius: "24px", padding: "2rem", border: "1px solid #eaedf1", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 800, color: "#2563eb", fontSize: "1.2rem" }}>Xarajatlar qismi</h3>
                  <button style={{ background: "#f1f5f9", color: "#2563eb", border: "none", borderRadius: "10px", padding: "0.6rem 1rem", fontWeight: 700, cursor: "pointer" }}>+ Xarajat qo'shish</button>
                </div>
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <AlertCircle size={48} style={{ opacity: 0.2, margin: "0 auto 1rem" }} />
                  <div style={{ fontWeight: 600 }}>Hali xarajatlar ro'yxatga olinmagan</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", background: "#ffffff", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Settings size={32} /></div>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>Do'kon Sozlamalari</h2>
                  <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px", fontWeight: 500 }}>Chek, manzil va boshqa ma'lumotlarni tahrirlash</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Do'kon nomi (Chekda chiqadi)</label>
                  <input type="text" defaultValue="GOOD LIFE" style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Manzil</label>
                  <input type="text" defaultValue="Qo'qon shahar, O'zbekiston" style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Telefon raqam</label>
                  <input type="text" defaultValue="+998 71 200 00 00" style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }} />
                </div>
              </div>

              <div style={{ marginTop: "2.5rem", borderTop: "1px solid #eaedf1", paddingTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem 2rem", fontSize: "1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(37,99,235,0.25)", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Saqlash</button>
              </div>
            </div>

            <div style={{ maxWidth: "800px", margin: "2rem auto 0", background: "#ffffff", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: "1.2rem", color: "#2563eb" }}>Kategoriyalar</h3>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>Faqat ushbu do'kon uchun kategoriyalarni boshqarish</div>
                </div>
                <button onClick={() => openCatModal()} style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "0.6rem 1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><Plus size={16} /> Qo'shish</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {categories.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", border: "1px solid #eaedf1", borderRadius: "12px", background: "#f8f9fa" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{c.title.uz || c.id}</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openCatModal(c)} style={{ background: "#fff", border: "1px solid #eaedf1", color: "#2563eb", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Edit size={16} /></button>
                      <button onClick={() => deleteCategory(c.id)} style={{ background: "#fff", border: "1px solid #eaedf1", color: "#dc2626", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

            {/* Modals... */}
      {catModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(37,99,235,0.4)", display: "grid", placeItems: "center", zIndex: 9999, padding: "1rem", boxSizing: "border-box", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#ffffff", borderRadius: "24px", padding: "2.5rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>{editCat ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</div>
              <button onClick={() => setCatModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={20} color="#64748b" /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
              {!editCat && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>ID (lotin harflarida)</label>
                  <input type="text" value={catForm.id} onChange={e => setCatForm({...catForm, id: e.target.value})} placeholder="masalan: tv_audio" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Nomi (Uzbek)</label>
                <input type="text" value={catForm.titleUz} onChange={e => setCatForm({...catForm, titleUz: e.target.value})} placeholder="Televizorlar..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }} />
              </div>
            </div>
            <button onClick={saveCategory} style={{ width: "100%", padding: "1.1rem", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "16px", fontSize: "1.1rem", fontWeight: 800, cursor: "pointer" }}>Saqlash</button>
          </div>
        </div>
      )}
      {productModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(37,99,235,0.4)", display: "grid", placeItems: "center", zIndex: 9999, padding: "1rem", boxSizing: "border-box", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#ffffff", borderRadius: "24px", padding: "2.5rem", width: "100%", maxWidth: "500px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>{editProd ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</div>
              <button onClick={() => setProductModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={20} color="#64748b" /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
              <div>
                </div>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "16px", border: "2px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", background: "#f8f9fa", flexShrink: 0 }}>
                    {prodForm.image ? (
                       <img src={prodForm.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                    ) : (
                       <div style={{ textAlign: "center", color: "#94a3b8" }}><Plus size={24} /></div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>Mahsulot rasmi</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>Faqat bitta rasm yuklang (ustiga bosing)</div>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Mahsulot nomi (uz)</label>
                <input type="text" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} placeholder="iPhone 15 Pro..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Kategoriya</label>
                  <select value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a", background: "#fff" }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.title.uz || c.id}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Sotish narxi ($)</label>
                  <input type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "0.5rem" }}>Ombordagi qoldiq (dona)</label>
                <input type="number" value={prodForm.stockCount} onChange={e => setProdForm({...prodForm, stockCount: e.target.value})} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid #eaedf1", outline: "none", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }} />
              </div>
            </div>

            <button onClick={saveProduct} style={{ width: "100%", padding: "1.1rem", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "16px", fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(37,99,235,0.25)" }}>
              Saqlash
            </button>
          </div>
        </div>
      )}
      {payModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(37,99,235,0.4)", display: "grid", placeItems: "center", zIndex: 9999, padding: "1rem", boxSizing: "border-box", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#ffffff", borderRadius: "28px", padding: "2.5rem", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>To'lovni tasdiqlash</div>
                <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px", fontWeight: 500 }}>{count} ta mahsulot xarid qilinmoqda</div>
              </div>
              <button onClick={() => setPayModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background="#f1f5f9"}><X size={20} color="#64748b" /></button>
            </div>
            
            <div style={{ background: "#f8f9fa", borderRadius: "20px", padding: "1.5rem", textAlign: "center", marginBottom: "2rem", border: "1px solid #eaedf1" }}>
              <div style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "6px", fontWeight: 600 }}>Jami to'lanadigan summa</div>
              <div style={{ color: "#2563eb", fontWeight: 900, fontSize: "2.4rem", letterSpacing: "-1px" }}>{formatPrice(total)}</div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2563eb", marginBottom: "1rem" }}>To'lov usuli</div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <PayCard icon={Banknote} label="Naqd pul" color="#2563eb" selected={payMethod === "cash"} onClick={() => setPayMethod("cash")} />
                <PayCard icon={CreditCard} label="Karta" color="#2563eb" selected={payMethod === "card"} onClick={() => setPayMethod("card")} />
                <PayCard icon={QrCode} label="QR To'lov" color="#2563eb" selected={payMethod === "qr"} onClick={() => setPayMethod("qr")} />
              </div>
            </div>

            {payMethod === "cash" && (
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#2563eb", marginBottom: "0.5rem" }}>Mijoz bergan summa</label>
                <input type="number" value={cashInput} onChange={e => setCashInput(e.target.value)} placeholder="0" style={{ width: "100%", boxSizing: "border-box", padding: "1rem 1.25rem", border: "2px solid #eaedf1", borderRadius: "16px", fontSize: "1.25rem", fontWeight: 800, outline: "none", fontFamily: "inherit", color: "#2563eb", transition: "all 0.2s" }} onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#eaedf1"} />
                
                {cashInput && inputInUSD >= total && (
                  <div style={{ marginTop: "1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={20} color="#16a34a" />
                    <span style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.95rem" }}>Qaytim: <strong style={{ fontSize: "1.1rem" }}>{formatPrice(change)}</strong></span>
                  </div>
                )}
                {cashInput && inputInUSD < total && (
                  <div style={{ marginTop: "1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <AlertCircle size={20} color="#dc2626" />
                    <span style={{ fontWeight: 700, color: "#dc2626", fontSize: "0.95rem" }}>Yetishmaydi: {formatPrice(total - inputInUSD)}</span>
                  </div>
                )}
                
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {(currency === 'UZS' ? [50000, 100000, 200000, 500000] : [10, 50, 100, 500]).map(a => (
                    <button key={a} onClick={() => setCashInput(String(a))} style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid #eaedf1", background: "#ffffff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", color: "#64748b", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.color="#2563eb"}} onMouseLeave={e => {e.currentTarget.style.background="#ffffff"; e.currentTarget.style.color="#64748b"}}>{currency === 'UZS' ? Number(a).toLocaleString('ru-RU').replace(/,/g, ' ') : "$" + a}</button>
                  ))}
                </div>
              </div>
            )}
            
            {payMethod === "card" && <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", textAlign: "center", color: "#2563eb", fontSize: "1rem", fontWeight: 600, border: "1px solid #eaedf1" }}>Karta orqali terminaldan to'lovni qabul qiling</div>}
            {payMethod === "qr" && <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", textAlign: "center", color: "#2563eb", fontSize: "1rem", fontWeight: 600, border: "1px solid #eaedf1" }}>Click / Payme QR kodi orqali qabul qiling</div>}
            
            <button onClick={confirm} disabled={!canPay} style={{ width: "100%", padding: "1.1rem", background: canPay ? "#2563eb" : "#eaedf1", color: canPay ? "#ffffff" : "#94a3b8", border: "none", borderRadius: "16px", fontSize: "1.1rem", fontWeight: 800, cursor: canPay ? "pointer" : "not-allowed", boxShadow: canPay ? "0 8px 20px rgba(37,99,235,0.25)" : "none", transition: "all 0.2s" }} onMouseEnter={e => { if(canPay) e.currentTarget.style.transform="translateY(-2px)" }} onMouseLeave={e => { if(canPay) e.currentTarget.style.transform="translateY(0)" }}>
              Tasdiqlash
            </button>
          </div>
        </div>
      )}

      {successModal && lastReceipt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(37,99,235,0.6)", display: "grid", placeItems: "center", zIndex: 9999, padding: "1rem", boxSizing: "border-box", backdropFilter: "blur(8px)" }}>
          <style>{`@media print { body * { visibility: hidden !important; } #receipt-print-area, #receipt-print-area * { visibility: visible !important; } #receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; padding: 10px; margin: 0; border: none; box-shadow: none; } }`}</style>
          <div className="no-print" style={{ background: "#ffffff", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#16a34a" }}><CheckCircle size={32} strokeWidth={2.5} /></div>
              <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>Sotuv muvaffaqiyatli!</div>
            </div>
            <ReceiptTemplate order={lastReceipt} lang={lang} formatPrice={formatPrice} />
            <div className="no-print" style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: "1rem", border: "2px solid #eaedf1", borderRadius: "14px", background: "#ffffff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#2563eb", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}><Printer size={18} /> Chop etish</button>
              <button onClick={() => { setSuccessModal(false); setLastReceipt(null); }} style={{ flex: 1, padding: "1rem", background: "#2563eb", border: "none", borderRadius: "14px", color: "#ffffff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", boxShadow: "0 8px 20px rgba(37,99,235,0.2)", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"} onClick={() => openProdModal()}>Davom etish</button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(37,99,235,0.6)", display: "grid", placeItems: "center", zIndex: 9999, padding: "1rem", boxSizing: "border-box", backdropFilter: "blur(8px)" }}>
          <style>{`@media print { body * { visibility: hidden !important; } #receipt-print-area, #receipt-print-area * { visibility: visible !important; } #receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; padding: 10px; margin: 0; border: none; box-shadow: none; } }`}</style>
          <div className="no-print" style={{ background: "#ffffff", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#2563eb" }}>Sotuv ma'lumotlari</div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#e2e8f0"} onMouseLeave={e=>e.currentTarget.style.background="#f1f5f9"}><X size={20} color="#64748b" /></button>
            </div>
            <ReceiptTemplate order={selectedOrder} lang={lang} formatPrice={formatPrice} />
            <div className="no-print" style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: "1rem", border: "2px solid #eaedf1", borderRadius: "14px", background: "#ffffff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#2563eb", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}><Printer size={18} /> Chop etish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
































