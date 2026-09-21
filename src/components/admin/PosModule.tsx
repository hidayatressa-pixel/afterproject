import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  Copy,
  PenTool,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
  CheckCircle2,
  X,
  User,
  PackageOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product, ServiceItem, CartItem, PaymentMethod } from '../../types';

export const PosModule: React.FC = () => {
  const {
    products,
    services,
    customers,
    createSale,
    addToast,
    settings,
    currentUser,
    loadDemoData,
    isDemoMode,
  } = useApp();

  // Search & Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'products' | 'services'>('all');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Active items from DB
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);
  const activeServices = useMemo(() => services.filter((s) => s.active), [services]);

  // Filtered catalog list
  const filteredCatalog = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const matchedProducts = (activeCatalogTab === 'services' ? [] : activeProducts).filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.barcode.toLowerCase().includes(term)
    );

    const matchedServices = (activeCatalogTab === 'products' ? [] : activeServices).filter(
      (s) =>
        s.service_name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
    );

    return { products: matchedProducts, services: matchedServices };
  }, [activeProducts, activeServices, searchTerm, activeCatalogTab]);

  // Add Product to Cart
  const handleAddProduct = (prod: Product) => {
    if (prod.stock <= 0) {
      addToast('error', 'Stok Habis', `Produk ${prod.name} tidak memiliki sisa stok.`);
      return;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => (item.item_type === 'PRODUCT' || (item.item_type as any) === 'product') && item.product_id === prod.id
      );

      if (existingIdx >= 0) {
        const item = prev[existingIdx];
        if (item.quantity >= prod.stock) {
          addToast('info', 'Batas Stok Tercapai', `Jumlah di kasir sudah mencapai sisa stok.`);
          return prev;
        }
        const updated = [...prev];
        const newQty = item.quantity + 1;
        updated[existingIdx] = {
          ...item,
          quantity: newQty,
          subtotal: newQty * item.unit_price,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: 'cart-' + Date.now() + Math.random().toString().slice(2, 6),
          item_type: 'PRODUCT',
          product_id: prod.id,
          name: prod.name,
          unit_price: prod.selling_price,
          cost_price: prod.purchase_price,
          quantity: 1,
          subtotal: prod.selling_price,
          unit: prod.unit,
        };
        return [...prev, newItem];
      }
    });
  };

  // Add Service to Cart (Fotocopy, Printing, Jilid, Laminating, etc.)
  const handleAddService = (svc: ServiceItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => (item.item_type === 'SERVICE' || (item.item_type as any) === 'service') && item.service_id === svc.id
      );

      if (existingIdx >= 0) {
        const item = prev[existingIdx];
        const updated = [...prev];
        const newQty = item.quantity + 1;
        updated[existingIdx] = {
          ...item,
          quantity: newQty,
          subtotal: newQty * item.unit_price,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: 'cart-' + Date.now() + Math.random().toString().slice(2, 6),
          item_type: 'SERVICE',
          service_id: svc.id,
          name: svc.service_name,
          unit_price: svc.selling_price,
          cost_price: svc.cost,
          quantity: 1,
          subtotal: svc.selling_price,
          unit: svc.unit,
        };
        return [...prev, newItem];
      }
    });
  };

  // Update Cart Item Quantity
  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];

      // Check product stock limit
      if (item.item_type === 'PRODUCT' && item.product_id) {
        const prod = products.find((p) => p.id === item.product_id);
        if (prod && newQty > prod.stock) {
          addToast('info', 'Batas Stok', `Maksimal stok tersedia adalah ${prod.stock}.`);
          return prev;
        }
      }

      updated[index] = {
        ...item,
        quantity: newQty,
        subtotal: newQty * item.unit_price,
      };
      return updated;
    });
  };

  // Remove Item from Cart
  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear Cart
  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (confirm('Kosongkan keranjang kasir saat ini?')) {
      setCart([]);
      setDiscountAmount(0);
      setNotes('');
    }
  };

  // Calculations
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.subtotal ?? item.quantity * item.unit_price), 0),
    [cart]
  );
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const changeAmount = paymentMethod === 'cash' ? Math.max(0, cashGiven - grandTotal) : 0;

  // Process Checkout
  const handleProcessCheckout = () => {
    if (cart.length === 0) {
      addToast('error', 'Keranjang Kosong', 'Tambahkan produk atau layanan terlebih dahulu.');
      return;
    }

    if (paymentMethod === 'cash' && cashGiven < grandTotal) {
      addToast('error', 'Uang Kurang', 'Nominal uang tunai yang diterima kurang dari total tagihan.');
      return;
    }

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const paymentMethodUpper = paymentMethod.toUpperCase() as PaymentMethod;

    try {
      createSale(
        {
          customer_id: selectedCustomerId || undefined,
          customer_name: selectedCust ? selectedCust.name : 'Pelanggan Umum',
          subtotal,
          discount: discountAmount,
          total: grandTotal,
          payment_method: paymentMethodUpper,
          payment_status: 'PAID',
          cash_received: paymentMethod === 'cash' ? cashGiven : grandTotal,
          cash_change: changeAmount,
          notes: notes.trim() || undefined,
          cashier_name: currentUser?.name || 'Kasir Toko',
        },
        cart.map((it) => ({
          item_type: it.item_type,
          product_id: it.product_id,
          service_id: it.service_id,
          description: it.name,
          quantity: it.quantity,
          unit_price: it.unit_price,
          cost_price: it.cost_price || 0,
          subtotal: it.quantity * it.unit_price,
        }))
      );

      // Reset Kasir state
      setCart([]);
      setDiscountAmount(0);
      setCashGiven(0);
      setNotes('');
      setIsCheckoutOpen(false);
      setSelectedCustomerId('');
    } catch (err: any) {
      addToast('error', 'Gagal Memproses Transaksi', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Barcode Scanner Simulation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Kasir Point of Sale (POS)
          </h2>
          <p className="text-xs text-slate-500">
            Mendukung transaksi gabungan: Kertas, ATK, Fotocopy, Print & Jilid dalam satu struk.
          </p>
        </div>

        {/* Search / Barcode Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, SKU, atau scan barcode..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product & Service Catalog Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Catalog Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
            <button
              onClick={() => setActiveCatalogTab('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCatalogTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveCatalogTab('products')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeCatalogTab === 'products'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span>Produk ATK ({activeProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveCatalogTab('services')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeCatalogTab === 'services'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              <span>Layanan Cetak ({activeServices.length})</span>
            </button>
          </div>

          {/* Catalog Items Container */}
          <div className="space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {/* Services Section */}
            {(activeCatalogTab === 'all' || activeCatalogTab === 'services') &&
              filteredCatalog.services.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      Layanan Fotocopy & Printing
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Klik untuk tambahkan lembar/jilid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {filteredCatalog.services.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => handleAddService(svc)}
                        className="p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 text-left transition-all duration-150 flex flex-col justify-between shadow-2xs group"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 block uppercase">
                            {svc.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-2">
                            {svc.service_name}
                          </h4>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between w-full">
                          <span className="text-xs font-extrabold text-slate-900">
                            Rp {svc.selling_price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-500">/{svc.unit}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Products Section */}
            {(activeCatalogTab === 'all' || activeCatalogTab === 'products') && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-amber-600" />
                    Barang ATK & Perlengkapan Kantor
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Klik produk untuk tambah ke keranjang
                  </span>
                </div>

                {filteredCatalog.products.length === 0 ? (
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                    Tidak ada produk ATK yang cocok dengan pencarian.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {filteredCatalog.products.map((prod) => {
                      const isOutOfStock = prod.stock <= 0;
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddProduct(prod)}
                          className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between shadow-2xs group ${
                            isOutOfStock
                              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                              : 'bg-white hover:bg-amber-50/60 border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-slate-500">
                                {prod.sku}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isOutOfStock
                                    ? 'bg-rose-100 text-rose-800'
                                    : prod.stock <= prod.minimum_stock
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isOutOfStock ? 'Habis' : `Stok: ${prod.stock}`}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 leading-snug line-clamp-2">
                              {prod.name}
                            </h4>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between w-full">
                            <span className="text-xs font-extrabold text-slate-900">
                              Rp {prod.selling_price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-slate-500">/{prod.unit}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Cart & Fast Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 flex flex-col justify-between space-y-4 sticky top-20">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Keranjang Kasir
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                {cart.length} item
              </span>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Customer Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Pelanggan (Opsional)
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="">Pelanggan Umum (Walk-in)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customer_type}) {c.phone ? `- ${c.phone}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">Keranjang masih kosong.</p>
                <p className="text-[11px] text-slate-500">
                  Pilih produk ATK atau layanan fotocopy di sebelah kiri untuk mulai transaksi.
                </p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-sm ${
                        item.item_type === 'SERVICE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.item_type === 'SERVICE' ? 'Layanan' : 'ATK'}
                    </span>
                    <h5 className="font-bold text-slate-900 truncate mt-0.5">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Rp {item.unit_price.toLocaleString('id-ID')} / {item.unit || 'pcs'}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQty(idx, Math.max(1, Number(e.target.value)))}
                      className="w-12 text-center py-1 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right pl-3 min-w-[70px]">
                    <span className="font-bold text-slate-900 block font-mono">
                      Rp {(item.subtotal ?? item.quantity * item.unit_price).toLocaleString('id-ID')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold font-mono">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Discount Field */}
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Diskon / Potongan (Rp):</span>
              </span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right px-2 py-1 rounded-lg border border-slate-300 text-xs font-mono font-bold"
              />
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between text-slate-900 pt-2 border-t border-slate-200">
              <span className="text-sm font-extrabold font-heading">
                TOTAL BAYAR:
              </span>
              <span className="text-xl font-extrabold text-amber-700 font-heading">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Checkout Action Button */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => {
              setCashGiven(grandTotal);
              setIsCheckoutOpen(true);
            }}
            className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span>Bayar Transaksi (Rp {grandTotal.toLocaleString('id-ID')})</span>
          </button>
        </div>
      </div>

      {/* Checkout & Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400">
                  Pembayaran Kasir
                </span>
                <h3 className="font-extrabold text-lg font-heading">
                  Total Rp {grandTotal.toLocaleString('id-ID')}
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span>Tunai (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'qris'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QRIS Toko</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'transfer'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Transfer Bank</span>
                  </button>
                </div>
              </div>

              {/* Cash Nominal Handler */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Uang Tunai Diterima (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-extrabold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCashGiven(grandTotal)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-amber-50"
                    >
                      Uang Pas
                    </button>
                    {[10000, 20000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCashGiven(amt)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-amber-50"
                      >
                        {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  {/* Kembalian */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Kembalian:</span>
                    <span
                      className={`text-base font-extrabold font-mono ${
                        changeAmount >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      Rp {changeAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {/* QRIS Handler Preview */}
              {paymentMethod === 'qris' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Scan QRIS AFTER PROJECT
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pastikan nominal pembayaran sesuai: <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>
                  </p>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === 'transfer' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <p className="text-slate-600">Silakan transfer ke rekening resmi:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                    <p className="font-bold text-slate-900">BCA: 1234-567-890</p>
                    <p className="text-slate-600">a.n. AFTER PROJECT</p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Konfirmasi ke pelanggan setelah dana masuk sebelum menyelesaikan transaksi.
                  </p>
                </div>
              )}

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Catatan Transaksi (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titip jilid, diambil jam 4 sore"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleProcessCheckout}
                  className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan & Cetak Struk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
