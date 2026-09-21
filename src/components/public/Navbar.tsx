import React, { useState } from 'react';
import { Menu, X, MessageCircle, Lock, ChevronRight } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const { websiteContent, settings, setIsAdminLoginOpen, currentUser, setCurrentView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Produk', href: '#katalog-atk' },
    { label: 'Kirim File', href: '#kirim-file' },
    { label: 'Harga', href: '#daftar-harga' },
    { label: 'Solusi Digital', href: '#digital-solutions' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const activeWhatsApp = settings?.whatsapp || websiteContent?.whatsapp_number || '081234567890';

  const handleWhatsApp = () => {
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Halo AFTER PROJECT, saya ingin bertanya seputar layanan fotocopy, print, atau ATK.'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Bar if enabled */}
      {websiteContent.announcement_banner_enabled && websiteContent.announcement_banner_text && (
        <div className="bg-slate-900 text-amber-300 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <span>{websiteContent.announcement_banner_text}</span>
          <a
            href="#kirim-file"
            className="underline text-white font-semibold hover:text-amber-200 hidden sm:inline"
          >
            Pelajari &rarr;
          </a>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#beranda" className="group shrink-0">
            <BrandLogo size="md" variant="dark" showSubtitle={true} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">

            {/* Admin trigger */}
            {currentUser ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Dashboard POS
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                title="Akses Kasir & Manajemen Toko"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Primary WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:bg-black text-white text-sm font-bold shadow-xs hover:shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi WhatsApp</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 text-sm font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp Sekarang
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    setCurrentView('admin');
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-700 p-2"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                {currentUser ? 'Masuk Dashboard POS' : 'Login Kasir / Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
