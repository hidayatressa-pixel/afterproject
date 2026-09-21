import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, AlertTriangle, Package, Printer, Receipt, Wallet } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const DashboardHome: React.FC = () => {
  const {
    sales,
    products,
    services,
    expenses,
    setAdminTab,
    setActiveReceiptSale,
  } = useApp();

  // Calculate Metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = useMemo(() => {
    return sales.filter((s) => s.created_at.startsWith(todayStr));
  }, [sales, todayStr]);

  const todayRevenue = useMemo(() => {
    return todaySales.reduce((acc, s) => acc + s.total, 0);
  }, [todaySales]);

  const todayTransactionsCount = todaySales.length;

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.status === 'active' && p.stock <= p.minimum_stock);
  }, [products]);

  const totalProductsCount = useMemo(() => {
    return products.filter((p) => p.status === 'active').length;
  }, [products]);

  const todayExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(todayStr))
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses, todayStr]);

  // Overall Month or All-Time Profit Estimate
  const totalRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.total, 0), [sales]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const estimatedGrossProfit = totalRevenue - totalExpenses;

  // Recent 5 Transactions
  const recentSales = useMemo(() => {
    return [...sales].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Ringkasan Operasional Toko
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau arus kas kasir, inventori kertas & ATK, dan transaksi hari ini secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('pos')}
            className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buka Kasir (POS)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Requirement 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendapatan Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pendapatan Hari Ini
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-heading">
              Rp {todayRevenue.toLocaleString('id-ID')}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Dari {todayTransactionsCount} transaksi hari ini
            </p>
          </div>
        </div>

        {/* Card 2: Transaksi Kasir Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jumlah Transaksi
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-heading">
              {todayTransactionsCount}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Total riwayat: {sales.length} nota
            </p>
          </div>
        </div>

        {/* Card 3: Peringatan Stok Menipis */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stok Perlu Restock
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                lowStockProducts.length > 0
                  ? 'bg-rose-100 text-rose-700 '
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-extrabold font-heading ${
                lowStockProducts.length > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {lowStockProducts.length} Produk
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Total {totalProductsCount} produk terdaftar
            </p>
          </div>
        </div>

        {/* Card 4: Estimasi Laba Bersih Operasional */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimasi Laba Operasional
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-extrabold font-heading ${
                estimatedGrossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              Rp {estimatedGrossProfit.toLocaleString('id-ID')}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Pendapatan - Beban Operasional
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Transactions & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Sales Transactions */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Transaksi Kasir Terbaru
              </h3>
              <p className="text-xs text-slate-500">
                5 transaksi terakhir yang dicatat oleh kasir
              </p>
            </div>
            <button
              onClick={() => setAdminTab('sales')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          {recentSales.length === 0 ? (
            <div className="py-8">
              <EmptyState
                id="empty-recent-sales"
                icon={<Receipt className="w-6 h-6" />}
                title="Belum ada transaksi hari ini."
                description="Belum ada transaksi. Mulai transaksi pertama dari menu Kasir."
                actionText="Buka Kasir (POS)"
                onAction={() => setAdminTab('pos')}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {sale.invoice_number}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {sale.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {sale.customer_name || 'Pelanggan Umum'} •{' '}
                      {new Date(sale.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block font-heading">
                        Rp {sale.total.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Lunas
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveReceiptSale(sale);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 transition-colors"
                      title="Cetak Ulang Struk"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Low Stock Alerts & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Low Stock Alert Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                  Peringatan Stok Menipis
                </h3>
              </div>
              <button
                onClick={() => setAdminTab('stock')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Kelola Stok
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Semua stok produk saat ini dalam batas aman atau belum ada produk terdaftar.
              </p>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{p.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Min. Stok: {p.minimum_stock} {p.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-rose-700 block">
                        Sisa {p.stock} {p.unit}
                      </span>
                      <button
                        onClick={() => setAdminTab('stock')}
                        className="text-[10px] font-bold text-amber-800 underline"
                      >
                        + Tambah Stok
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <h4 className="font-extrabold text-sm font-heading text-white">
              Pintasan Cepat Operasional
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                onClick={() => setAdminTab('pos')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 font-bold flex flex-col items-center gap-1.5 transition-colors border border-slate-700 text-center"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Transaksi Kasir</span>
              </button>

              <button
                onClick={() => setAdminTab('products')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 font-bold flex flex-col items-center gap-1.5 transition-colors border border-slate-700 text-center"
              >
                <Package className="w-4 h-4 text-blue-400" />
                <span>Produk ATK</span>
              </button>

              <button
                onClick={() => setAdminTab('services')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 font-bold flex flex-col items-center gap-1.5 transition-colors border border-slate-700 text-center"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Tarif Fotocopy</span>
              </button>

              <button
                onClick={() => setAdminTab('expenses')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 font-bold flex flex-col items-center gap-1.5 transition-colors border border-slate-700 text-center"
              >
                <Wallet className="w-4 h-4 text-purple-400" />
                <span>Catat Beban</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
