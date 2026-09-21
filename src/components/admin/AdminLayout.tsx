import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Boxes, Wrench, Receipt, Users,
  Wallet, FileBarChart, Globe, Laptop, Settings, LogOut, ChevronRight,
  Menu, X, Store, ArrowLeft
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useApp, AdminTab } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    setCurrentView,
    currentUser,
    logout,
    
    settings,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allNavItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Kasir (POS)', icon: ShoppingCart },
    { id: 'products', label: 'Produk ATK', icon: Package },
    { id: 'services', label: 'Layanan & Tarif', icon: Wrench },
    { id: 'stock', label: 'Stok & Mutasi', icon: Boxes },
    { id: 'sales', label: 'Penjualan & Struk', icon: Receipt },
    { id: 'customers', label: 'Pelanggan', icon: Users },
    { id: 'expenses', label: 'Pengeluaran', icon: Wallet },
    { id: 'reports', label: 'Laporan Keuangan', icon: FileBarChart },
    { id: 'cms', label: 'Konten Website', icon: Globe },
    { id: 'portfolio', label: 'Digital Portfolio', icon: Laptop },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings },
  ];

  // Cashier gets only day-to-day operational screens. Owner/admin keeps full access.
  const cashierAllowedTabs = new Set<AdminTab>(['dashboard', 'pos', 'sales', 'customers']);
  const navItems = currentUser?.role === 'cashier'
    ? allNavItems.filter((item) => cashierAllowedTabs.has(item.id))
    : allNavItems;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Main Admin Wrapper */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-700 flex flex-col border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } no-print`}
        >
          {/* Sidebar Header */}
          <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
            <BrandLogo size="sm" variant="light" showSubtitle={true} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer User & Back to Public */}
          <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50">
            <button
              onClick={() => setCurrentView('public')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Publik</span>
            </button>

            <div className="flex items-center justify-between pt-1 px-1 text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Keluar / Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between no-print sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
                <Store className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 capitalize font-bold font-heading">
                  {adminTab === 'pos'
                    ? 'Kasir (Point of Sale)'
                    : adminTab === 'products'
                    ? 'Produk ATK'
                    : adminTab === 'stock'
                    ? 'Stok & Kartu Mutasi'
                    : adminTab === 'services'
                    ? 'Layanan & Tarif Fotocopy'
                    : adminTab === 'sales'
                    ? 'Riwayat Penjualan & Struk'
                    : adminTab === 'expenses'
                    ? 'Pencatatan Pengeluaran'
                    : adminTab === 'reports'
                    ? 'Laporan Keuangan & Laba'
                    : adminTab === 'cms'
                    ? 'Konten Website Publik'
                    : adminTab === 'portfolio'
                    ? 'Portofolio Solusi Digital'
                    : adminTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick POS Shortcut Button */}
              {adminTab !== 'pos' && (
                <button
                  onClick={() => setAdminTab('pos')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buka Kasir</span>
                </button>
              )}
            </div>
          </header>

          {/* Main Dashboard Child Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
