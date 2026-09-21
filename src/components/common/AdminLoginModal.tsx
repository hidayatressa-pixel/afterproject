import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, X, KeyRound, ShieldAlert, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, login } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handleQuickLogin = (role: 'admin' | 'kasir') => {
    if (role === 'admin') {
      login('admin', 'admin123');
    } else {
      login('kasir', 'kasir123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <BrandLogo size="md" variant="light" showSubtitle={true} />
          <button
            type="button"
            onClick={() => setIsAdminLoginOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Masuk untuk mengakses sistem Kasir POS, inventori stok kertas & ATK, pencatatan biaya operasional, dan laporan laba rugi.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username / ID Petugas
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / kasir"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password / PIN Keamanan
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan PIN atau password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Akses Cepat Pengujian:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block text-xs">Role: Owner / Admin</span>
                <span className="text-[10px] text-slate-500 font-mono">admin / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('kasir')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block text-xs">Role: Kasir POS</span>
                <span className="text-[10px] text-slate-500 font-mono">kasir / kasir123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
